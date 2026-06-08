import "../styles.css";

export const metadata = {
  title: "NusaInvite - Undangan Digital",
  description: "Landing page, dashboard, dan undangan digital Nusantara.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cinzel:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,700&family=DM+Sans:wght@400;500;700&family=Dancing+Script:wght@400;700&family=Great+Vibes&family=Inter:wght@400;500;600;700;900&family=Josefin+Sans:wght@400;600;700&family=Lora:ital,wght@0,400;0,600;0,700;1,400;1,700&family=Nunito:wght@400;600;700;800&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Poppins:wght@400;500;600;700;800;900&family=Source+Serif+4:ital,wght@0,400;0,600;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
