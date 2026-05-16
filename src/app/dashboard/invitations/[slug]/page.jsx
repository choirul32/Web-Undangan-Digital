import { redirect } from "next/navigation";
import Dashboard from "../../../../components/Dashboard";
import { getAdminSession } from "../../../../lib/auth";

export default async function DashboardInvitationDetailPage({ params }) {
  const session = await getAdminSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <Dashboard
      session={session}
      activePage="invitation-detail"
      activeInvitationSlug={params.slug}
    />
  );
}
