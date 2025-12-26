import { Outfit } from "next/font/google";
import "./globals.css";
import React from "react";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "Tryliate Platform",
  description: "The connection orchestrator for the AI age.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={outfit.className}>{children}</body>
    </html>
  );
}
