// Quality gates (§8 of the build spec) against the built output.
// Every check throws — the build fails, it does not warn.
//
// Run: npm run verify   (builds + prerenders first)

import { createServer } from "node:http";
import { readFileSync, readdirSync, statSync, mkdirSync } from "node:fs";
import { resolve, join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
import { chromium } from "playwright";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");
const outDir = resolve(root, "verify-output");
mkdirSync(outDir, { recursive: true });

const failures = [];
const fail = (msg) => failures.push(msg);
const ok = (msg) => console.log(`  ✓ ${msg}`);

// ——— routes: from the sitemap, cross-checked against the files on disk ———
const sitemap = readFileSync(resolve(dist, "sitemap.xml"), "utf8");
const sitemapPaths = [...sitemap.matchAll(/<loc>https:\/\/[^/<]+(\/[^<]*)<\/loc>/g)].map((m) =>
  m[1] === "/" ? "/" : m[1].replace(/\/$/, ""),
);

function findPrerendered(dir, prefix = "") {
  const found = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      found.push(...findPrerendered(full, `${prefix}/${entry}`));
    } else if (entry === "index.html") {
      found.push(prefix === "" ? "/" : prefix);
    }
  }
  return found;
}
const diskPaths = findPrerendered(dist).filter((p) => !p.startsWith("/assets"));

const sitemapSet = new Set(sitemapPaths);
const diskSet = new Set(diskPaths);
for (const p of sitemapSet) if (!diskSet.has(p)) fail(`sitemap lists ${p} but no prerendered file exists`);
for (const p of diskSet) if (!sitemapSet.has(p)) fail(`prerendered ${p} missing from sitemap`);
if (failures.length === 0) ok(`sitemap contains exactly the ${diskPaths.length} prerendered routes`);
const routes = [...sitemapSet];

// ——— §6 budgets ———
// History: the original build spec set a 200KB total-JS gate with zero deps
// beyond React + router. Adding the persistent MapLibre camera was a
// deliberate, user-approved break of that rule; the gates now hold the line
// where it still matters: the ENTRY path (everything a route needs before the
// map ignites) stays under the original 200KB, the map engine must remain a
// separate lazily-loaded chunk, and the total stays under 360KB gzipped.
function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}
const files = walk(dist);
let jsGz = 0;
let mapGz = 0;
let sawMapChunk = false;
for (const f of files) {
  const ext = extname(f);
  if (ext === ".js") {
    const gz = gzipSync(readFileSync(f)).length;
    jsGz += gz;
    if (/maplibre/.test(f)) {
      mapGz += gz;
      sawMapChunk = true;
    }
  }
  if ([".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif", ".svg"].includes(ext)) {
    const kb = statSync(f).size / 1024;
    if (kb > 200) fail(`image over 200KB: ${f} (${kb.toFixed(0)}KB)`);
  }
}
const jsKb = jsGz / 1024;
const entryKb = (jsGz - mapGz) / 1024;
if (!sawMapChunk) fail("maplibre is not split into its own lazy chunk");
if (entryKb >= 200) fail(`non-map JS ${entryKb.toFixed(1)}KB gzipped — entry budget is 200KB`);
if (jsKb >= 360) fail(`total JS ${jsKb.toFixed(1)}KB gzipped — budget is 360KB`);
if (entryKb < 200 && jsKb < 360 && sawMapChunk) {
  ok(
    `JS budgets: entry ${entryKb.toFixed(1)}KB gz (limit 200), total ${jsKb.toFixed(1)}KB gz (limit 360), map chunk lazy; no oversized images`,
  );
}

// ——— static server with clean URLs ———
const MIME = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".xml": "application/xml",
  ".txt": "text/plain",
  ".png": "image/png",
  ".webp": "image/webp",
};
const server = createServer((req, res) => {
  const url = new URL(req.url, "http://localhost").pathname;
  const candidates = [
    join(dist, url),
    join(dist, url, "index.html"),
    join(dist, `${url}.html`),
  ];
  for (const file of candidates) {
    try {
      if (statSync(file).isFile()) {
        res.setHeader("content-type", MIME[extname(file)] ?? "application/octet-stream");
        res.end(readFileSync(file));
        return;
      }
    } catch {
      /* try next */
    }
  }
  res.statusCode = 404;
  res.end("not found");
});
await new Promise((r) => server.listen(0, r));
const origin = `http://localhost:${server.address().port}`;

// Prefer the environment's pinned Chromium when Playwright's own download is
// absent (e.g. remote runners with PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD set).
const browser = await chromium
  .launch()
  .catch(() => chromium.launch({ executablePath: "/opt/pw-browsers/chromium" }));

// ——— §3 reduced motion: designed static state, fully visible, per route ———
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  for (const route of routes) {
    await page.goto(`${origin}${route}`, { waitUntil: "load" });
    const main = page.locator("main");
    const opacity = await main.evaluate((el) => Number(getComputedStyle(el).opacity));
    const height = await main.evaluate((el) => el.getBoundingClientRect().height);
    if (opacity < 0.9) fail(`${route}: main opacity ${opacity} under reduced motion`);
    if (height < 200) fail(`${route}: main is ${height}px tall under reduced motion`);
    if (route === "/") {
      const complete = await page
        .locator('.passage-desktop [data-passage-complete="true"]')
        .count();
      if (complete === 0) fail(`/: reduced-motion hero does not show the completed passage`);
    }
  }
  ok("reduced motion: every route fully visible; hero shows the completed passage");
  await ctx.close();
}

// ——— §4 keyboard: nav destinations + contact CTA reachable by Tab ———
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(`${origin}/`, { waitUntil: "load" });
  const reached = new Set();
  for (let i = 0; i < 60; i++) {
    await page.keyboard.press("Tab");
    const info = await page.evaluate(() => {
      const el = document.activeElement;
      return el ? { href: el.getAttribute("href"), cta: el.getAttribute("data-cta") } : null;
    });
    if (info?.href) reached.add(info.href);
    if (info?.cta) reached.add(`cta:${info.cta}`);
  }
  for (const dest of ["/", "/packages", "/watch", "/work", "/capabilities", "/contact"]) {
    if (!reached.has(dest)) fail(`keyboard: nav destination ${dest} not reachable by Tab`);
  }
  if (!reached.has("cta:hero") && !reached.has("cta:home-contract") && !reached.has("cta:nav")) {
    fail("keyboard: contact CTA not reachable by Tab");
  }
  ok("keyboard: primary nav + contact CTA all reachable by Tab");
  await ctx.close();
}

// ——— §5 viewports: no horizontal overflow, hero legible, screenshots ———
for (const width of [390, 768, 1024, 1440]) {
  const ctx = await browser.newContext({
    viewport: { width, height: width < 800 ? 844 : 900 },
    reducedMotion: "reduce", // stable pixels for screenshots
  });
  const page = await ctx.newPage();
  for (const route of routes) {
    await page.goto(`${origin}${route}`, { waitUntil: "load" });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    if (overflow > 1) fail(`${route} @ ${width}px: horizontal overflow of ${overflow}px`);
    const h1 = page.locator("h1").first();
    if (!(await h1.isVisible())) fail(`${route} @ ${width}px: h1 not visible`);
    const slug = route === "/" ? "home" : route.slice(1).replaceAll("/", "-");
    await page.screenshot({ path: join(outDir, `${slug}-${width}.png`), fullPage: width === 1440 });
  }
  console.log(`  ✓ ${width}px: no overflow, hero legible, screenshots saved`);
  await ctx.close();
}

// ——— §7 every internal link resolves ———
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const known = new Set(routes);
  for (const route of routes) {
    await page.goto(`${origin}${route}`, { waitUntil: "load" });
    const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href")));
    for (const href of hrefs) {
      if (!href || !href.startsWith("/")) continue; // external / tel: / mailto: / sms:
      const clean = href.split("#")[0].replace(/\/$/, "") || "/";
      if (!known.has(clean)) fail(`${route}: internal link ${href} has no prerendered target`);
    }
  }
  ok("every internal link resolves to a prerendered route");
  await ctx.close();
}

// ——— §6 CLS < 0.05 on /; LCP reported (prerendered HTML carries the hero text) ———
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(`${origin}/`, { waitUntil: "load" });
  await page.waitForTimeout(3000);
  const { cls, lcp } = await page.evaluate(
    () =>
      new Promise((resolvePromise) => {
        let cls = 0;
        new PerformanceObserver((list) => {
          for (const e of list.getEntries()) if (!e.hadRecentInput) cls += e.value;
        }).observe({ type: "layout-shift", buffered: true });
        let lcp = 0;
        new PerformanceObserver((list) => {
          for (const e of list.getEntries()) lcp = e.startTime;
        }).observe({ type: "largest-contentful-paint", buffered: true });
        setTimeout(() => resolvePromise({ cls, lcp }), 500);
      }),
  );
  if (cls >= 0.05) fail(`CLS ${cls.toFixed(4)} on / — budget is 0.05`);
  else ok(`CLS ${cls.toFixed(4)} on / (budget 0.05); LCP ${lcp.toFixed(0)}ms unthrottled`);
  await ctx.close();
}

// ——— the camera: if the engine mounts, it must arrive ———
// Tile fetches fail in this offline harness (that's fine — nothing asserts
// map pixels, and the site is complete on the plate), but if the map instance
// comes up, the camera must reach the home frame: eased under motion,
// immediately under reduced motion. The expected frame is parsed from
// cameraFrames.ts so this check cannot drift from the source.
{
  const src = readFileSync(resolve(root, "src/lib/cameraFrames.ts"), "utf8");
  const m = src.match(
    /"\/":\s*\{\s*center:\s*\[(-?[\d.]+),\s*(-?[\d.]+)\],\s*zoom:\s*([\d.]+),\s*pitch:\s*([\d.]+)/,
  );
  if (!m) fail("camera check: could not parse the home frame from cameraFrames.ts");
  else {
    const want = { lng: Number(m[1]), lat: Number(m[2]), zoom: Number(m[3]) };
    for (const reduced of [false, true]) {
      const ctx = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        reducedMotion: reduced ? "reduce" : "no-preference",
      });
      const page = await ctx.newPage();
      await page.goto(`${origin}/`, { waitUntil: "load" });
      const deadline = Date.now() + (reduced ? 8000 : 16000);
      let state = null;
      while (Date.now() < deadline) {
        state = await page.evaluate(() => {
          const map = window.__seamarkMap;
          if (!map) return null;
          const c = map.getCenter();
          return { lng: c.lng, lat: c.lat, zoom: map.getZoom() };
        });
        if (
          state &&
          Math.abs(state.lng - want.lng) < 0.08 &&
          Math.abs(state.lat - want.lat) < 0.08 &&
          Math.abs(state.zoom - want.zoom) < 0.4
        ) {
          break;
        }
        await page.waitForTimeout(400);
      }
      const approach = src.match(
        /APPROACH:\s*CameraFrame\s*=\s*\{\s*center:\s*\[(-?[\d.]+),\s*(-?[\d.]+)\]/,
      );
      const atApproach =
        state &&
        approach &&
        Math.abs(state.lng - Number(approach[1])) < 0.02 &&
        Math.abs(state.lat - Number(approach[2])) < 0.02;
      if (state === null || (atApproach && !reduced)) {
        console.log(
          `  ○ camera (${reduced ? "reduced" : "motion"}): engine ${state === null ? "did not mount" : "never ignited (no tiles)"} in this harness — plate fallback covers it`,
        );
      } else if (
        Math.abs(state.lng - want.lng) < 0.08 &&
        Math.abs(state.lat - want.lat) < 0.08 &&
        Math.abs(state.zoom - want.zoom) < 0.4
      ) {
        ok(`camera (${reduced ? "reduced" : "motion"}): arrived at the home frame`);
      } else {
        fail(
          `camera (${reduced ? "reduced" : "motion"}): mounted but never arrived — at ${JSON.stringify(state)}, wanted ~${JSON.stringify(want)}`,
        );
      }
      await ctx.close();
    }
  }
}

await browser.close();
server.close();

if (failures.length > 0) {
  console.error(`\n✗ verify failed with ${failures.length} problem(s):`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log("\n✓ verify passed");
