import InvitationRenderer from "../../templates/InvitationRenderer";
import { InvitationErrorState } from "../../components/InvitationLoadingState";
import { getInvitationBySlug } from "../../lib/invitations";
import ViewTracker from "../../components/ViewTracker";

export const dynamic = "force-dynamic";

export default async function ShortPublicInvitationPage({ params }) {
  const invitation = await getInvitationBySlug(params.slug);

  if (!invitation) {
    return <InvitationErrorState />;
  }

  return (
    <div className="min-h-screen bg-[#e8edf2] lg:px-8">
      <ViewTracker slug={params.slug} />
      <div className="mx-auto min-h-screen w-full overflow-hidden bg-[var(--color-bg)] lg:min-h-[915px] lg:max-w-[412px] lg:border-x lg:border-black/10 lg:shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
        <InvitationRenderer data={invitation} framedPreview />
      </div>
    </div>
  );
}
