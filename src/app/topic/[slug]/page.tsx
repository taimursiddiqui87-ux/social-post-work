import { notFound } from "next/navigation";
import { QueueView } from "@/components/QueueView";
import { topicBySlug, TOPICS } from "@/lib/topics";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return TOPICS.map((t) => ({ slug: t.slug }));
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = topicBySlug(slug);
  if (!topic) notFound();
  return (
    <QueueView
      title={topic.label}
      subtitle={topic.description}
      sourceFilter={topic.sources}
      emptyHint={`No drafts from ${topic.label} sources yet. Run Fetch news → Generate drafts.`}
    />
  );
}
