import "server-only";

import { cacheLife } from "next/cache";

export interface EmbedCheckResult {
  /** true: headers allow framing; false: blocked; null: could not determine. */
  frameable: boolean | null;
  reason: "allowed" | "x-frame-options" | "csp-frame-ancestors" | "unreachable";
  checkedAt: string;
}

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36";

/**
 * Reads the response headers a browser would use to decide whether a page may
 * be shown in an iframe on another origin. This only detects restrictions so
 * the UI can fall back to a screenshot; it never works around them.
 */
export async function checkEmbeddable(url: string): Promise<EmbedCheckResult> {
  "use cache";
  cacheLife("hours");

  const checkedAt = new Date().toISOString();
  try {
    const response = await fetch(url, {
      redirect: "follow",
      headers: { "user-agent": USER_AGENT, accept: "text/html,application/xhtml+xml" },
      signal: AbortSignal.timeout(6000),
    });
    // Only headers matter; don't download the document.
    await response.body?.cancel().catch(() => {});

    const xfo = response.headers.get("x-frame-options");
    if (xfo && /deny|sameorigin|allow-from/i.test(xfo)) {
      return { frameable: false, reason: "x-frame-options", checkedAt };
    }

    const csp = response.headers.get("content-security-policy");
    const ancestors = csp?.match(/frame-ancestors([^;]*)/i)?.[1]?.trim();
    if (ancestors !== undefined && !/(^|\s)\*(\s|$)/.test(ancestors)) {
      return { frameable: false, reason: "csp-frame-ancestors", checkedAt };
    }

    return { frameable: true, reason: "allowed", checkedAt };
  } catch {
    return { frameable: null, reason: "unreachable", checkedAt };
  }
}
