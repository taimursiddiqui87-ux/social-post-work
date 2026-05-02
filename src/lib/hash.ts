import { createHash } from "node:crypto";

// Canonicalize URL: lowercase host, drop tracking params + fragment.
export function canonicalUrl(raw: string): string {
  try {
    const u = new URL(raw);
    u.hash = "";
    const drop = ["utm_source","utm_medium","utm_campaign","utm_term","utm_content","ref","ref_src","fbclid","gclid"];
    drop.forEach((p) => u.searchParams.delete(p));
    u.hostname = u.hostname.toLowerCase().replace(/^www\./, "");
    return u.toString();
  } catch {
    return raw.trim();
  }
}

export const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");
export const urlHash = (raw: string) => sha256(canonicalUrl(raw));
