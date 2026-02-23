import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RichNotes — Notas enriquecidas",
  description: "Plataforma de notas con Server Actions de Next.js 14",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className="bg-[#0a0912] antialiased">{children}</body>
    </html>
  );
}
