import CustomerGuestManagerPage from "./page-client";

export const metadata = {
  title: "Guest Manager Pelanggan - NusaInvite",
};

export default function GuestManagerCustomerRoute({ params }) {
  return <CustomerGuestManagerPage invitationSlug={params.slug} />;
}
