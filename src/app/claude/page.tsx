import { QueueView } from "@/components/QueueView";
import { CLAUDE_SOURCES } from "@/lib/topics";

export const dynamic = "force-dynamic";

export default async function ClaudePage() {
  return (
    <QueueView
      title="Claude"
      subtitle="Anthropic + Claude updates only — pulled from Anthropic news, Simon Willison, and AI News digests."
      sourceFilter={CLAUDE_SOURCES}
      emptyHint="No Claude-specific drafts yet. Run Fetch news → Generate drafts. New Anthropic announcements show up here as they happen."
    />
  );
}
