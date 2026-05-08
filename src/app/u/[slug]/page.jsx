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

  return <InvitationRenderer data={invitation} />;
}
