import Dashboard from "../../components/Dashboard";
import { redirect } from "next/navigation";
import { getAdminSession } from "../../lib/auth";

export default async function DashboardPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/login");
  }

  return <Dashboard session={session} activePage="overview" />;
}


