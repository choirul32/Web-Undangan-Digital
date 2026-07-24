import InvitationRenderer from "../../../templates/InvitationRenderer";
import { InvitationErrorState } from "../../../components/InvitationLoadingState";
import { getInvitationBySlug } from "../../../lib/invitations";
import ViewTracker from "../../../components/ViewTracker";

// Always read the latest data: an invitation can be published/updated at any
// time, so this page must never serve a stale (e.g. pre-publish) cached result.
export const dynamic = "force-dynamic";

function guestNameFromQuery(value = "") {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const normalizedValue = String(rawValue || "").replace(/\+/g, " ");

  try {
    return decodeURIComponent(normalizedValue).replace(/\s+/g, " ").trim();
  } catch {
    return normalizedValue.replace(/\s+/g, " ").trim();
  }
}

export default async function PublicInvitationPage({ params, searchParams }) {
  const invitation = await getInvitationBySlug(params.slug);

  if (!invitation) {
    return <InvitationErrorState />;
  }

  const guestName = guestNameFromQuery(searchParams?.to || "");

  return (
    <div className="min-h-screen bg-[#e8edf2] lg:px-8">
      <ViewTracker slug={params.slug} />
      <div className="mx-auto min-h-screen w-full overflow-hidden bg-[var(--color-bg)] lg:min-h-[915px] lg:max-w-[412px] lg:border-x lg:border-black/10 lg:shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
        <InvitationRenderer
          data={invitation}
          guestName={guestName || undefined}
          framedPreview
        />
      </div>
    </div>
  );
}
