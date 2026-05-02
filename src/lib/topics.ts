// Source-name whitelists for filtering the queue by topic.
// These are matched against the `sources.name` column.

export const CLAUDE_SOURCES = [
  "Claude / Anthropic", // Google News feed targeting Anthropic + Claude
  "Simon Willison",     // Heaviest indie Claude coverage; tracks Anthropic releases in detail
  "AI News (smol)",     // Daily roundup that consistently covers Claude
] as const;
