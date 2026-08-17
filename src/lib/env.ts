// True only in `vite dev`. Under `vite build` and under the tsx-driven
// prerender this is false, so prerendered HTML always matches production
// client behavior.
export const isDev: boolean =
  typeof import.meta !== "undefined" &&
  Boolean((import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV);
