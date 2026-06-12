import InvitationRenderer from "../../../templates/InvitationRenderer";
import { getInvitationBySlug } from "../../../lib/invitations";

export default async function PublicInvitationPage({ params }) {
  const invitation = await getInvitationBySlug(params.slug);

  if (!invitation) {
    return (
      <main className="min-h-screen bg-[var(--color-bg)] px-6 py-20 text-center text-[var(--color-primary)]">
        <h1 className="text-4xl font-black">Undangan tidak ditemukan</h1>
        <p className="mt-4 text-lg font-semibold text-[var(--color-text)]">
          Periksa kembali link undangan yang dibagikan.
        </p>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#e8edf2] lg:px-8">
      <div className="mx-auto min-h-screen w-full overflow-hidden bg-[var(--color-bg)] lg:min-h-[915px] lg:max-w-[412px] lg:border-x lg:border-black/10 lg:shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
        <InvitationRenderer data={invitation} framedPreview />
      </div>
    </div>
  );
}
