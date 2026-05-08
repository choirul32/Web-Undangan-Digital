import "../styles.css";

export const metadata = {
  title: "NusaInvite - Undangan Digital",
  description: "Landing page, dashboard, dan undangan digital Nusantara.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
