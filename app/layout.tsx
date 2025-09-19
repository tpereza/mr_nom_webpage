
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MR+NØM — Landing",
  description: "Hero section replica",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
