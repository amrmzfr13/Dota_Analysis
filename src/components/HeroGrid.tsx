"use client";

import React, { useState, useEffect } from 'react';
import { getAllHeroes, getHeroMatchups, getHeroImageUrl, Hero } from '../services/dotaApi';
import CountersSection from './CountersSection';
import Image from 'next/image';

interface Counter {
    hero_id: number;
    games_played: number;
    wins: number;
}

const HeroGrid: React.FC = () => {
    const [heroes, setHeroes] = useState<Hero[]>([]);
    const [enemyHeroes, setEnemyHeroes] = useState<(Hero | null)[]>(Array(5).fill(null));
    const [counters, setCounters] = useState<Record<number, Counter[]>>({});
    const [loading, setLoading] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    useEffect(() => {
        const fetchHeroes = async () => {
            try {
                const data = await getAllHeroes();
                setHeroes(data);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch heroes:', err);
                setLoading(false);
            }
        };

        fetchHeroes();
    }, []);

    const handleHeroSelect = (hero: Hero) => {
        if (selectedIndex !== null) {
            const newEnemyHeroes = [...enemyHeroes];
            newEnemyHeroes[selectedIndex] = hero;
            setEnemyHeroes(newEnemyHeroes);
            setSelectedIndex(null);
        }
    };

    const handleSlotClick = (index: number) => {
        setSelectedIndex(index);
    };

    const updateCounters = async () => {
        const selectedEnemyHeroes = enemyHeroes.filter((hero): hero is Hero => hero !== null);

        try {
            const countersPromises = selectedEnemyHeroes.map(hero => getHeroMatchups(hero.id));
            const countersData = await Promise.all(countersPromises);

            const newCounters: Record<number, Counter[]> = {};
            selectedEnemyHeroes.forEach((hero, index) => {
                newCounters[hero.id] = countersData[index];
            });

            setCounters(newCounters);
        } catch (err) {
            console.error('Failed to fetch counter data:', err);
        }
    };

    useEffect(() => {
        updateCounters();
    }, [enemyHeroes]);

    if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

    return (
        <div className="min-h-screen bg-[#0D1117] p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Enemy Team */}
                <div className="space-y-4">
                    <h2 className="text-red-500 font-bold text-xl tracking-wider px-2 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">ENEMY TEAM</h2>
                    <div className="grid grid-cols-5 gap-4">
                        {enemyHeroes.map((hero, index) => (
                            <div
                                key={`enemy-${index}`}
                                className="relative group cursor-pointer"
                                onClick={() => handleSlotClick(index)}
                            >
                                {hero ? (
                                    <div className="w-full aspect-square relative">
                                        <Image
                                            src={getHeroImageUrl(hero.name)}
                                            alt={hero.localized_name}
                                            fill
                                            className="object-cover rounded"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                                            <p className="text-white text-sm">{hero.localized_name}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full aspect-square bg-[#2C333D]/30 rounded flex items-center justify-center">
                                        <p className="text-gray-400">Select Hero</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Hero Selection Modal */}
                {selectedIndex !== null && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
                        <div className="bg-[#1A1F2C] p-6 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
                            <h2 className="text-xl font-bold text-gray-200 mb-4">Select an Enemy Hero</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {heroes.map((hero) => (
                                    <div
                                        key={hero.id}
                                        className="relative group cursor-pointer"
                                        onClick={() => handleHeroSelect(hero)}
                                    >
                                        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                                            <Image
                                                src={getHeroImageUrl(hero.name)}
                                                alt={hero.localized_name}
                                                width={200}
                                                height={200}
                                                className="object-cover object-center group-hover:opacity-75"
                                            />
                                        </div>
                                        <div className="mt-2 text-center">
                                            <h3 className="text-sm font-medium text-gray-200">{hero.localized_name}</h3>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Enemy Counters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {enemyHeroes.map((hero, index) => {
                        if (!hero) return null;
                        return (
                            <div key={`counter-${index}`} className="bg-[#1A1F2C] p-6 rounded-lg shadow">
                                <div className="flex items-center space-x-4 mb-4">
                                    <Image
                                        src={getHeroImageUrl(hero.name)}
                                        alt={hero.localized_name}
                                        width={48}
                                        height={48}
                                        className="rounded"
                                    />
                                    <h2 className="text-xl font-bold text-gray-200">{hero.localized_name}</h2>
                                </div>
                                {counters[hero.id] && <CountersSection counters={counters[hero.id]} />}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default HeroGrid; 