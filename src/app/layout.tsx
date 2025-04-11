import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dota 2 Hero Analysis",
  description: "Analyze Dota 2 heroes and their statistics",
  icons: []
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <Sidebar />
        <main className="pl-16">
          {children}
        </main>
      </body>
    </html>
  );
}
