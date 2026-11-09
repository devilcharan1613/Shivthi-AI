import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shivthi AI | Global Intelligence",
  description: "A unified workspace for AI, research, open source, industries, and markets.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
