"use client";

import { useState } from 'react';
import { useHeroContext } from '@/context/HeroContext';
import { getHeroImageUrl, Hero } from '@/services/dotaApi';
import Image from 'next/image';
import HeroSelection from './HeroSelection';

export default function HeroGrid() {
    const { allyHeroes, enemyHeroes, setAllyHero, setEnemyHero } = useHeroContext();
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [isAlly, setIsAlly] = useState<boolean>(true);

    const handleHeroSelect = (hero: Hero) => {
        if (selectedIndex !== null) {
            if (isAlly) {
                setAllyHero(selectedIndex, hero);
            } else {
                setEnemyHero(selectedIndex, hero);
            }
        }
        setSelectedIndex(null);
    };

    const renderHeroSlot = (hero: Hero | null, index: number, isAllyTeam: boolean) => {
        const roles = ['Soft Support', 'Hard Support', 'Offlane', 'Midlane', 'Safelane'];
        const role = roles[index];

        return (
            <div
                key={`${isAllyTeam ? 'ally' : 'enemy'}-${index}`}
                className="relative group cursor-pointer"
                onClick={() => {
                    setSelectedIndex(index);
                    setIsAlly(isAllyTeam);
                }}
            >
                <div className={`w-[200px] h-[280px] relative
                    ${hero ? 'bg-[#1c1c1c]' : 'bg-gray-900'} 
                    border-2 border-[#916c36] rounded-sm
                    shadow-[inset_0_0_10px_rgba(0,0,0,0.6)]
                    overflow-hidden`}
                >
                    {hero ? (
                        <>
                            {/* Hero Image */}
                            <div className="absolute inset-0">
                                <Image
                                    src={getHeroImageUrl(hero.name)}
                                    alt={hero.localized_name}
                                    width={200}
                                    height={280}
                                    className="object-cover w-full h-full"
                                    priority
                                />
                            </div>

                            {/* Dark gradient overlays */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/50"></div>

                            {/* Role label */}
                            <div className="absolute top-2 left-2">
                                <span className="text-xs text-gray-300 font-semibold bg-black/60 px-2 py-1 rounded">
                                    {role}
                                </span>
                            </div>

                            {/* Hero name */}
                            <div className="absolute top-2 left-0 right-0 text-center">
                                <span className="text-sm text-gray-200 font-semibold uppercase tracking-wider">
                                    {hero.localized_name}
                                </span>
                            </div>

                            {/* Ability icons */}
                            <div className="absolute bottom-2 left-2 right-2 flex justify-center gap-1">
                                {[...Array(4)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-10 h-10 bg-black/60 rounded-sm border border-[#916c36]/30"
                                    ></div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full">
                            <span className="text-gray-500 text-sm">Empty</span>
                            <span className="text-gray-600 text-xs mt-1">{role}</span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="w-full flex flex-col items-center gap-4">
            <div className="w-full max-w-[1200px] flex flex-col gap-4">
                {/* Dire Team (Enemy) */}
                <div className="flex flex-col gap-2">
                    <h2 className="text-red-500 font-bold text-xl tracking-wider px-2">ENEMY TEAM</h2>
                    <div className="bg-[#1c1c1c]/80 p-4 rounded">
                        <div className="flex gap-4 justify-center">
                            {enemyHeroes.map((hero, index) => renderHeroSlot(hero, index, false))}
                        </div>
                    </div>
                </div>

                {/* Radiant Team (Ally) */}
                <div className="flex flex-col gap-2">
                    <h2 className="text-green-500 font-bold text-xl tracking-wider px-2">ALLY TEAM</h2>
                    <div className="bg-[#1c1c1c]/80 p-4 rounded">
                        <div className="flex gap-4 justify-center">
                            {allyHeroes.map((hero, index) => renderHeroSlot(hero, index, true))}
                        </div>
                    </div>
                </div>
            </div>

            {selectedIndex !== null && (
                <HeroSelection
                    onSelect={handleHeroSelect}
                    onClose={() => setSelectedIndex(null)}
                />
            )}
        </div>
    );
} 