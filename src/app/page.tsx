import HeroGrid from "@/components/HeroGrid";
import CountersSection from "@/components/CountersSection";
import SynergySection from "@/components/SynergySection";
import { HeroProvider } from "@/context/HeroContext";

export default function Home() {
  return (
    <HeroProvider>
      <main className="min-h-screen bg-gray-950 text-white">
        {/* Top Bar */}
        <header className="bg-gray-900 p-4 text-xl font-bold text-center border-b border-gray-700 shadow">
          🛡️ Dota 2 Hero Picks Assistant
        </header>

        {/* Content Grid */}
        <div className="max-w-[1800px] mx-auto p-6">
          <div className="grid grid-cols-1 gap-8">
            <HeroGrid />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <CountersSection />
              <SynergySection />
            </div>
          </div>
        </div>
      </main>
    </HeroProvider>
  );
}
