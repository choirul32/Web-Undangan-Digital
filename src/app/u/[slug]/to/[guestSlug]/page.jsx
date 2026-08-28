import InvitationRenderer from "../../../../../templates/InvitationRenderer";
import { InvitationErrorState } from "../../../../../components/InvitationLoadingState";
import { getInvitationAndGuest } from "../../../../../lib/invitations";
import ViewTracker from "../../../../../components/ViewTracker";
import { fallbackGuestFromSlug } from "../../../../../lib/guestLinks";
import { redirect } from "next/navigation";

// Always read the latest data so newly published/updated invitations show up.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { invitation, guest } = await getInvitationAndGuest(
    params.slug,
    params.guestSlug,
  );

  if (!invitation) {
    return {
      title: "Undangan tidak ditemukan",
    };
  }

  const resolvedGuest = guest || fallbackGuestFromSlug(params.guestSlug);
  const coupleName = `${invitation.couple?.groomNickname || "Mempelai"} & ${
    invitation.couple?.brideNickname || "Mempelai"
  }`;

  return {
    title: resolvedGuest?.name ? `${coupleName} untuk ${resolvedGuest.name}` : coupleName,
    description: resolvedGuest?.name
      ? `Undangan digital personal untuk ${resolvedGuest.name}.`
      : "Undangan digital personal.",
  };
}

export default async function PublicGuestInvitationPage({ params }) {
  const { invitation, guest } = await getInvitationAndGuest(
    params.slug,
    params.guestSlug,
  );

  if (!invitation) {
    return <InvitationErrorState />;
  }
  const resolvedGuest = guest || fallbackGuestFromSlug(params.guestSlug);

  if (!guest && resolvedGuest?.name) {
    redirect(`/u/${encodeURIComponent(params.slug)}?to=${encodeURIComponent(resolvedGuest.name)}`);
  }

  return (
    <div className="min-h-screen bg-[#e8edf2] lg:px-8">
      <ViewTracker slug={params.slug} guestSlug={params.guestSlug} />
      <div className="mx-auto min-h-screen w-full overflow-hidden bg-[var(--color-bg)] lg:min-h-[915px] lg:max-w-[412px] lg:border-x lg:border-black/10 lg:shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
        <InvitationRenderer
          data={invitation}
          guestName={resolvedGuest?.name}
          guestSlug={resolvedGuest?.slug}
          framedPreview
        />
      </div>
    </div>
  );
}
