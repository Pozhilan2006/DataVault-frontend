import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Data Vault",
  description:
    "Upload images, generate share links, and visualize propagation graphs.",
  keywords: ["image sharing", "data vault", "propagation graph"],
  openGraph: {
    title: "Data Vault",
    description: "Upload and share images with propagation tracking.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="mx-auto min-h-[calc(100vh-73px)] max-w-7xl px-6 py-10">
          {children}
        </main>
      </body>
    </html>
  );
}
