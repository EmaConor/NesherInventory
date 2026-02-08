import type { Metadata } from "next";
import "./(dashboard)/globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s - WEB",
    default: "Home - WEB",
  },
  description: "Ema",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`antialiased bg-background`}
      >
        {children}
      </body>
    </html>
  );
}
