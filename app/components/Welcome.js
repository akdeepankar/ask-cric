'use client';

import dynamic from 'next/dynamic';
const PlayerChart = dynamic(() => import('./Playerchart'), { ssr: false });

export default function Welcome() {
  return (
    <div className="flex-1 flex flex-col items-center justify-start min-h-screen p-6 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white">
      <div className="w-full max-w-6xl">
        <header className="text-3xl font-bold mb-8 text-center tracking-wider uppercase font-[Orbitron] border-b border-white/10 pb-4">
          Ask Cricket
        </header>
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-xl p-6">
          <PlayerChart />
        </div>
      </div>
    </div>
  );
}
