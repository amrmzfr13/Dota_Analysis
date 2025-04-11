"use client";

import HeroGrid from "@/components/HeroGrid";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-[#0D1117]">
      <Sidebar />
      <main className="flex-1 ml-16 p-8">
        <HeroGrid />
      </main>
    </div>
  );
}
