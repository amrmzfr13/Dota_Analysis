"use client";

import { useState } from 'react';
import { useHeroContext } from '@/context/HeroContext';
import { Hero, getHeroMatchupDetails, calculateWinRate, getHeroImageUrl, API_BASE_URL } from '@/services/dotaApi';
import Image from 'next/image';

export default function SynergySection() {
    const { allyHeroes } = useHeroContext();
    const [synergies, setSynergies] = useState<{ hero: Hero; winRate: number }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const analyzeSynergies = async () => {
        if (allyHeroes.length === 0) {
            setError('Please select at least one ally hero');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const validAllyHeroes = allyHeroes.filter((hero): hero is Hero => hero !== null && hero.id !== undefined);

            if (validAllyHeroes.length === 0) {
                setError('Please select valid ally heroes');
                return;
            }

            // First, get all heroes to use for synergy data
            const heroesResponse = await fetch(`${API_BASE_URL}/heroes`);
            if (!heroesResponse.ok) {
                throw new Error('Failed to fetch heroes list');
            }
            const allHeroes = await heroesResponse.json();

            const allMatchups = await Promise.all(
                validAllyHeroes.map(hero => getHeroMatchupDetails(hero.id))
            );

            // Find heroes that have high win rates when playing with our heroes
            const synergyMap = new Map<number, { hero: Hero; totalWinRate: number; count: number }>();

            allMatchups.forEach(matchupData => {
                if (!matchupData?.matchups) return;

                matchupData.matchups.forEach(matchup => {
                    if (matchup.games_played < 100) return; // Only consider matchups with enough games

                    const winRate = calculateWinRate(matchup);
                    if (winRate > 55) { // Only consider strong synergies
                        const existing = synergyMap.get(matchup.hero_id);
                        if (existing) {
                            existing.totalWinRate += winRate;
                            existing.count += 1;
                        } else {
                            // Find the synergy hero in our allHeroes list
                            const synergyHero = allHeroes.find((h: Hero) => h.id === matchup.hero_id);
                            if (synergyHero) {
                                synergyMap.set(matchup.hero_id, {
                                    hero: synergyHero,
                                    totalWinRate: winRate,
                                    count: 1
                                });
                            }
                        }
                    }
                });
            });

            // Convert to array and sort by average win rate
            const sortedSynergies = Array.from(synergyMap.values())
                .map(({ hero, totalWinRate, count }) => ({
                    hero,
                    winRate: totalWinRate / count
                }))
                .sort((a, b) => b.winRate - a.winRate)
                .slice(0, 5); // Show top 5 synergies

            setSynergies(sortedSynergies);
        } catch (error) {
            console.error('Error fetching synergies:', error);
            setError('Failed to fetch synergy data. Please try again later.');
            setSynergies([]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="md:col-span-3 bg-gray-800 p-5 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-4 border-b border-gray-600 pb-2">🤝 Recommended Synergies</h2>

            {!isLoading && !error && synergies.length === 0 && (
                <div className="flex flex-col items-center gap-4">
                    <p className="text-gray-400 text-center">Select your heroes and click analyze to see recommended synergies</p>
                    <button
                        onClick={analyzeSynergies}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        disabled={allyHeroes.length === 0}
                    >
                        Analyze Synergies
                    </button>
                </div>
            )}

            {isLoading && (
                <div className="text-center text-gray-400">Analyzing synergies...</div>
            )}

            {error && (
                <div className="text-center text-gray-400">{error}</div>
            )}

            {synergies.length > 0 && (
                <>
                    <button
                        onClick={analyzeSynergies}
                        className="mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                        Refresh Analysis
                    </button>
                    <ul className="space-y-3">
                        {synergies.map(({ hero, winRate }) => (
                            <li key={`synergy-${hero.id}-${winRate}`} className="flex items-center gap-3">
                                <Image
                                    src={getHeroImageUrl(hero.name)}
                                    alt={hero.localized_name}
                                    width={32}
                                    height={32}
                                    className="rounded"
                                />
                                <div>
                                    <span className="font-semibold">{hero.localized_name}</span>
                                    <span className="text-sm text-gray-400 ml-2">
                                        ({winRate.toFixed(1)}% win rate with your team)
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </section>
    );
} 