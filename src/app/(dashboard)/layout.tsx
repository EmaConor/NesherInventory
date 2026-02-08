import type { Metadata } from "next";
import "./globals.css";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: {
    template: "%s - WEB",
    default: "Home - WEB",
  },
  description: "Ema",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/auth");
  }

  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`antialiased bg-background`}>{children}</body>
    </html>
  );
}
