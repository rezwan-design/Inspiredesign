import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** "product-shots" -> "Product shots" */
export function formatTag(tag: string) {
  const text = tag.replace(/-/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
export function formatCount(value: number) {
  return compact.format(value);
}

const dateFormat = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
export function formatDate(isoDate: string) {
  return dateFormat.format(new Date(`${isoDate}T00:00:00Z`));
}

/** "https://www.linear.app/foo" -> "linear.app/foo" */
export function displayUrl(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
}

/** Adds a ref parameter so outbound visits can be attributed later. */
export function outboundUrl(url: string) {
  try {
    const u = new URL(url);
    u.searchParams.set("ref", "vitrine");
    return u.toString();
  } catch {
    return url;
  }
}
