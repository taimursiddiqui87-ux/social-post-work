import { QueueView } from "@/components/QueueView";

export const dynamic = "force-dynamic";

export default async function QueuePage() {
  return (
    <QueueView
      title="Queue"
      subtitle="Review AI-generated drafts. Copy and post when ready."
    />
  );
}
