#!/usr/bin/env node
/**
 * Captures screenshots, favicons and OG metadata for every website seed.
 *
 *   npm run capture                # capture sites missing from captures.json
 *   npm run capture -- linear arc  # (re)capture specific slugs
 *   npm run capture -- --all       # recapture everything
 *
 * Uses the locally installed Google Chrome through playwright-core, so no
 * browser download is needed. Override with CHROME_PATH=/path/to/chrome.
 *
 * Output:
 *   public/screenshots/<slug>.webp         1280×800 card image
 *   public/screenshots/<slug>-full.webp    full-page desktop (capped)
 *   public/screenshots/<slug>-mobile.webp  full-page mobile (capped)
 *   public/favicons/<slug>.png
 *   src/data/captures.json
 */
import { chromium } from "playwright-core";
import sharp from "sharp";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { websiteSeeds } from "../src/data/websites.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const shotsDir = path.join(root, "public/screenshots");
const faviconDir = path.join(root, "public/favicons");
const manifestPath = path.join(root, "src/data/captures.json");

const CHROME_PATH =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const CONCURRENCY = Number(process.env.CONCURRENCY ?? 4);
const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };
const MAX_FULL_HEIGHT = 5400; // css px, desktop
const MAX_MOBILE_HEIGHT = 3600; // css px, mobile

const DESKTOP_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36";
const MOBILE_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1";

// Hide common consent banners instead of clicking through them: no consent is given.
const HIDE_OVERLAYS_CSS = `
  #onetrust-banner-sdk, #onetrust-consent-sdk, #CybotCookiebotDialog, #CybotCookiebotDialogBodyUnderlay,
  #usercentrics-root, #truste-consent-track, .truste_box_overlay, #didomi-host, #sp_message_container,
  .osano-cm-window, #cookiescript_injected, #cookie-law-info-bar, .cc-window, .cc-banner,
  [id*="cookie-banner" i], [class*="cookie-banner" i], [id*="cookieBanner" i], [class*="cookieBanner" i],
  [id*="cookie-consent" i], [class*="cookie-consent" i], [class*="CookieConsent" i], [aria-label*="cookie" i][role="dialog"],
  [id*="consent-banner" i], [class*="consent-banner" i], #intercom-container, .intercom-lightweight-app,
  #hubspot-messages-iframe-container, iframe[title*="chat" i] { display: none !important; }
  html, body { overflow: auto !important; }
`;

const args = process.argv.slice(2);
const captureAll = args.includes("--all");
const requested = args.filter((a) => !a.startsWith("--"));

const manifest = existsSync(manifestPath)
  ? JSON.parse(await readFile(manifestPath, "utf8"))
  : {};

const queue = websiteSeeds.filter((site) => {
  if (requested.length) return requested.includes(site.slug);
  return captureAll || !manifest[site.slug];
});

if (!queue.length) {
  console.log("Nothing to capture. Pass slugs or --all to recapture.");
  process.exit(0);
}

await mkdir(shotsDir, { recursive: true });
await mkdir(faviconDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: CHROME_PATH,
  headless: true,
  args: ["--hide-scrollbars", "--disable-blink-features=AutomationControlled"],
});

async function openPage(context, url) {
  const page = await context.newPage();
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => undefined });
  });
  let response = null;
  try {
    response = await page.goto(url, { waitUntil: "load", timeout: 35_000 });
  } catch {
    // Heavy pages sometimes never fire `load`; keep whatever rendered.
  }
  await page.addStyleTag({ content: HIDE_OVERLAYS_CSS }).catch(() => {});
  await page.waitForTimeout(2500);
  await hideModals(page);
  return { page, response };
}

/**
 * Newsletter, region and promo pop-ups vary per site, so hide any fixed
 * layer that looks like a modal or covers most of the viewport (nothing is
 * clicked or accepted).
 */
async function hideModals(page) {
  await page.keyboard.press("Escape").catch(() => {});
  await page
    .evaluate(() => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const modalHint = /modal|popup|pop-up|newsletter|overlay|klaviyo|dialog|consent|cookie|geo|country|locale|signup|offer|privacy|gdpr|banner-bottom/i;
      for (const el of document.querySelectorAll("body *")) {
        const style = getComputedStyle(el);
        if (style.position !== "fixed" && style.position !== "sticky") continue;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;
        const isHeader = rect.top <= 4 && rect.height < 160;
        if (isHeader) continue;
        const label = `${el.id} ${el.className?.toString?.() ?? ""} ${el.getAttribute("role") ?? ""} ${el.getAttribute("aria-modal") ?? ""} ${el.getAttribute("aria-label") ?? ""}`;
        const translucent = /rgba\([^)]*,\s*0?\.\d+\)/.test(style.backgroundColor);
        const coversViewport = translucent && rect.width * rect.height > vw * vh * 0.35;
        const looksModal = modalHint.test(label) || el.getAttribute("aria-modal") === "true" || el.tagName === "DIALOG";
        if (looksModal || coversViewport) el.style.setProperty("display", "none", "important");
      }
      document.documentElement.style.setProperty("overflow", "auto", "important");
      document.body.style.setProperty("overflow", "auto", "important");
    })
    .catch(() => {});
  await page.waitForTimeout(400);
}

/** Scroll through the page so lazy content renders, then return to top. */
async function warmScroll(page, maxHeight) {
  await page
    .evaluate(async (limit) => {
      const step = window.innerHeight * 0.8;
      for (let y = 0; y < Math.min(document.body.scrollHeight, limit); y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 180));
      }
      window.scrollTo(0, 0);
    }, maxHeight)
    .catch(() => {});
  await page.waitForTimeout(1200);
}

async function fullPageShot(page, viewport, maxHeight) {
  const height = await page
    .evaluate(() => document.documentElement.scrollHeight)
    .catch(() => viewport.height);
  return page.screenshot({
    type: "png",
    fullPage: true,
    clip: { x: 0, y: 0, width: viewport.width, height: Math.min(height, maxHeight) },
    timeout: 45_000,
  });
}

function frameableFromHeaders(headers) {
  if (!headers) return null;
  const xfo = headers["x-frame-options"];
  if (xfo && /deny|sameorigin|allow-from/i.test(xfo)) return false;
  const csp = headers["content-security-policy"];
  const fa = csp?.match(/frame-ancestors([^;]*)/i)?.[1]?.trim();
  if (fa !== undefined && !/(^|\s)\*(\s|$)/.test(fa)) return false;
  return true;
}

async function captureSite(site) {
  const out = { capturedAt: new Date().toISOString() };

  // Desktop
  const desktop = await browser.newContext({
    viewport: DESKTOP,
    deviceScaleFactor: 1,
    userAgent: DESKTOP_UA,
    locale: "en-US",
  });
  try {
    const { page, response } = await openPage(desktop, site.websiteUrl);
    out.frameable = frameableFromHeaders(response?.headers());

    const meta = await page
      .evaluate(() => {
        const abs = (href) => (href ? new URL(href, location.href).href : null);
        const og =
          document.querySelector('meta[property="og:image"]')?.getAttribute("content") ??
          document.querySelector('meta[name="twitter:image"]')?.getAttribute("content");
        return { ogImage: abs(og), finalUrl: location.href };
      })
      .catch(() => ({ ogImage: null }));
    out.ogImage = meta.ogImage ?? null;

    const viewportPng = await page.screenshot({ type: "png", timeout: 30_000 });
    await sharp(viewportPng)
      .resize(1280, 800, { fit: "cover", position: "top" })
      .webp({ quality: 80 })
      .toFile(path.join(shotsDir, `${site.slug}.webp`));
    out.previewImage = `/screenshots/${site.slug}.webp`;

    await warmScroll(page, MAX_FULL_HEIGHT);
    const fullPng = await fullPageShot(page, DESKTOP, MAX_FULL_HEIGHT);
    await sharp(fullPng, { limitInputPixels: false })
      .resize({ width: 1280 })
      .webp({ quality: 72 })
      .toFile(path.join(shotsDir, `${site.slug}-full.webp`));
    out.fullPageImage = `/screenshots/${site.slug}-full.webp`;
  } finally {
    await desktop.close();
  }

  // Mobile
  const mobile = await browser.newContext({
    viewport: MOBILE,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent: MOBILE_UA,
    locale: "en-US",
  });
  try {
    const { page } = await openPage(mobile, site.websiteUrl);
    await warmScroll(page, MAX_MOBILE_HEIGHT);
    const png = await fullPageShot(page, MOBILE, MAX_MOBILE_HEIGHT);
    await sharp(png, { limitInputPixels: false })
      .resize({ width: 780 })
      .webp({ quality: 72 })
      .toFile(path.join(shotsDir, `${site.slug}-mobile.webp`));
    out.mobileImage = `/screenshots/${site.slug}-mobile.webp`;
  } catch (error) {
    console.warn(`  ! ${site.slug}: mobile capture failed (${error.message})`);
    out.mobileImage = null;
  } finally {
    await mobile.close();
  }

  // Favicon (PNG via Google's favicon service, stored locally)
  try {
    const host = new URL(site.websiteUrl).hostname;
    const res = await fetch(
      `https://www.google.com/s2/favicons?domain=${host}&sz=128`,
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await sharp(buf).resize(64, 64).png().toFile(path.join(faviconDir, `${site.slug}.png`));
    out.favicon = `/favicons/${site.slug}.png`;
  } catch (error) {
    console.warn(`  ! ${site.slug}: favicon failed (${error.message})`);
    out.favicon = null;
  }

  return out;
}

let done = 0;
async function worker() {
  while (queue.length) {
    const site = queue.shift();
    const started = Date.now();
    try {
      manifest[site.slug] = await captureSite(site);
      console.log(
        `✓ ${site.slug.padEnd(22)} ${((Date.now() - started) / 1000).toFixed(1)}s  frameable=${manifest[site.slug].frameable}`,
      );
    } catch (error) {
      console.error(`✗ ${site.slug}: ${error.message}`);
    }
    done++;
    // Persist progress so an interrupted run can resume.
    await writeFile(manifestPath, JSON.stringify(sortKeys(manifest), null, 2) + "\n");
  }
}

function sortKeys(obj) {
  return Object.fromEntries(Object.entries(obj).sort(([a], [b]) => a.localeCompare(b)));
}

console.log(`Capturing ${queue.length} site(s) with concurrency ${CONCURRENCY}…`);
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
await browser.close();
console.log(`Done: ${done} processed.`);
