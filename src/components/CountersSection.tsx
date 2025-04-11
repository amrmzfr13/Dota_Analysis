"use client";

import React from 'react';
import Image from 'next/image';
import { getHeroImageUrl, heroIdToName } from '../services/dotaApi';

interface Counter {
    hero_id: number;
    games_played: number;
    wins: number;
}

interface CountersSectionProps {
    counters: Counter[];
}

const CountersSection: React.FC<CountersSectionProps> = ({ counters }) => {
    if (!counters || counters.length === 0) return null;

    // Sort counters by win rate in descending order
    const sortedCounters = [...counters].sort((a, b) => {
        const winRateA = (a.wins / a.games_played) * 100;
        const winRateB = (b.wins / b.games_played) * 100;
        return winRateB - winRateA;
    });

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-200">Heroes that counter this hero</h3>
            <div className="grid grid-cols-1 gap-4 max-h-[500px] overflow-y-auto pr-2">
                {sortedCounters.map((counter) => {
                    const heroName = heroIdToName[counter.hero_id];
                    if (!heroName) return null;

                    const winRate = (counter.wins / counter.games_played) * 100;
                    // Convert the display name to the internal name format
                    const internalName = `npc_dota_hero_${heroName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

                    return (
                        <div key={counter.hero_id} className="flex items-center space-x-4 bg-[#2C333D]/30 p-4 rounded">
                            <div className="relative w-12 h-12">
                                <Image
                                    src={getHeroImageUrl(internalName)}
                                    alt={heroName}
                                    fill
                                    className="object-cover rounded"
                                />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-gray-200 font-medium">{heroName}</span>
                                    <span className="text-green-400 font-semibold">{winRate.toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                    <div
                                        className="bg-green-500 h-2 rounded-full"
                                        style={{ width: `${winRate}%` }}
                                    />
                                </div>
                                <p className="text-sm text-gray-400 mt-1">
                                    {counter.wins}/{counter.games_played} games
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CountersSection; 