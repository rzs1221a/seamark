// Prerender: stamps out one static HTML file per route with real content in
// the body, per-route <title>/description/canonical/OG, plus sitemap.xml and
// robots.txt — all from the same TS modules the app renders from, imported
// through tsx, so the crawler's copy and the visitor's copy cannot drift.
//
// Assertions here FAIL the build, they do not warn (§8 of the build spec).

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";

import App from "../src/App.tsx";
import { routeTable } from "../src/lib/routes.ts";
import { brand, SHOW_PRICING, serviceTypes } from "../src/lib/brand.ts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");

const template = readFileSync(resolve(dist, "index.html"), "utf8");
if (!template.includes('<div id="root"></div>')) {
  throw new Error("prerender: dist/index.html has no empty #root to fill");
}

// ——— route-table sanity: fails the build ———
const titles = new Set();
const descriptions = new Set();
for (const route of routeTable) {
  if (!route.title || !route.description) {
    throw new Error(`prerender: ${route.path} lacks a title or description`);
  }
  if (titles.has(route.title)) throw new Error(`prerender: duplicate title for ${route.path}`);
  if (descriptions.has(route.description)) {
    throw new Error(`prerender: duplicate description for ${route.path}`);
  }
  titles.add(route.title);
  descriptions.add(route.description);
}

const esc = (s) =>
  s.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

const jsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: brand.name,
  url: brand.origin,
  email: brand.email,
  telephone: brand.phone,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Amelia Island",
    addressRegion: "FL",
    addressCountry: "US",
  },
  serviceType: serviceTypes,
});

// Our prices, which must be absent from every page when SHOW_PRICING is false.
const PRICE_STRINGS = ["$2,400", "$5,400", "$9,800", "$18,000", "$99", "$249", "$499", "$600"];

// Honesty-contract scan (§8.2): these strings fail the build wherever they
// appear in rendered output; "guarantee" is allowed only inside the FAQ route.
const FORBIDDEN_EVERYWHERE = ["% more leads", "%more leads", "+40% leads"];


for (const route of routeTable) {
  const html = renderToString(
    React.createElement(StaticRouter, { location: route.path }, React.createElement(App)),
  );

  if (html.trim().length < 500) {
    throw new Error(`prerender: ${route.path} rendered an implausibly empty body`);
  }

  for (const bad of FORBIDDEN_EVERYWHERE) {
    if (html.includes(bad)) {
      throw new Error(`prerender: forbidden claim ${JSON.stringify(bad)} rendered on ${route.path}`);
    }
  }
  if (route.path !== "/questions" && /guarantee/i.test(html)) {
    throw new Error(`prerender: "guarantee" rendered outside the FAQ answer, on ${route.path}`);
  }
  if (!SHOW_PRICING) {
    for (const price of PRICE_STRINGS) {
      if (html.includes(price)) {
        throw new Error(
          `prerender: price ${price} rendered on ${route.path} while SHOW_PRICING is false`,
        );
      }
    }
  }

  const canonical = route.path === "/" ? `${brand.origin}/` : `${brand.origin}${route.path}`;
  const head = [
    `<meta name="description" content="${esc(route.description)}" />`,
    `<link rel="canonical" href="${canonical}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(brand.name)}" />`,
    `<meta property="og:title" content="${esc(route.title)}" />`,
    `<meta property="og:description" content="${esc(route.description)}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta name="twitter:card" content="summary" />`,
    `<script type="application/ld+json">${jsonLd}</script>`,
  ].join("\n    ");

  const page = template
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(route.title)}</title>`)
    .replace("</head>", `    ${head}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`);

  const outDir = route.path === "/" ? dist : resolve(dist, route.path.slice(1));
  mkdirSync(outDir, { recursive: true });
  writeFileSync(resolve(outDir, "index.html"), page);
  console.log(`prerendered ${route.path} (${(page.length / 1024).toFixed(1)} kB)`);
}

// ——— sitemap + robots, from the same route table ———
const urls = routeTable
  .map((r) => {
    const loc = r.path === "/" ? `${brand.origin}/` : `${brand.origin}${r.path}`;
    return `  <url><loc>${loc}</loc></url>`;
  })
  .join("\n");
writeFileSync(
  resolve(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);
writeFileSync(resolve(dist, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${brand.origin}/sitemap.xml\n`);

console.log(`prerender: ${routeTable.length} routes, sitemap, robots — all assertions passed`);
