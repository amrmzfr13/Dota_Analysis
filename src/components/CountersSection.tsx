"use client";

import { useState } from 'react';
import { useHeroContext } from '@/context/HeroContext';
import { Hero, getHeroMatchupDetails, calculateWinRate, getHeroImageUrl, API_BASE_URL } from '@/services/dotaApi';
import Image from 'next/image';

export default function CountersSection() {
    const { enemyHeroes } = useHeroContext();
    const [counters, setCounters] = useState<{ hero: Hero; winRate: number }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const analyzeCounters = async () => {
        if (enemyHeroes.length === 0) {
            setError('Please select at least one enemy hero');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const validEnemyHeroes = enemyHeroes.filter((hero): hero is Hero => hero !== null && hero.id !== undefined);

            if (validEnemyHeroes.length === 0) {
                setError('Please select valid enemy heroes');
                return;
            }

            // First, get all heroes to use for counter data
            const heroesResponse = await fetch(`${API_BASE_URL}/heroes`);
            if (!heroesResponse.ok) {
                throw new Error('Failed to fetch heroes list');
            }
            const allHeroes = await heroesResponse.json();

            const allMatchups = await Promise.all(
                validEnemyHeroes.map(hero => getHeroMatchupDetails(hero.id))
            );

            // Find heroes that have high win rates against the enemy heroes
            const counterMap = new Map<number, { hero: Hero; totalWinRate: number; count: number }>();

            allMatchups.forEach(matchupData => {
                if (!matchupData?.matchups) return;

                matchupData.matchups.forEach(matchup => {
                    if (matchup.games_played < 100) return; // Only consider matchups with enough games

                    const winRate = calculateWinRate(matchup);
                    if (winRate > 55) { // Only consider strong counters
                        const existing = counterMap.get(matchup.hero_id);
                        if (existing) {
                            existing.totalWinRate += winRate;
                            existing.count += 1;
                        } else {
                            // Find the counter hero in our allHeroes list
                            const counterHero = allHeroes.find((h: Hero) => h.id === matchup.hero_id);
                            if (counterHero) {
                                counterMap.set(matchup.hero_id, {
                                    hero: counterHero,
                                    totalWinRate: winRate,
                                    count: 1
                                });
                            }
                        }
                    }
                });
            });

            // Convert to array and sort by average win rate
            const sortedCounters = Array.from(counterMap.values())
                .map(({ hero, totalWinRate, count }) => ({
                    hero,
                    winRate: totalWinRate / count
                }))
                .sort((a, b) => b.winRate - a.winRate)
                .slice(0, 5); // Show top 5 counters

            setCounters(sortedCounters);
        } catch (error) {
            console.error('Error fetching counters:', error);
            setError('Failed to fetch counter data. Please try again later.');
            setCounters([]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="md:col-span-3 bg-gray-800 p-5 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-4 border-b border-gray-600 pb-2">✅ Recommended Counters</h2>

            {!isLoading && !error && counters.length === 0 && (
                <div className="flex flex-col items-center gap-4">
                    <p className="text-gray-400 text-center">Select enemy heroes and click analyze to see recommended counters</p>
                    <button
                        onClick={analyzeCounters}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        disabled={enemyHeroes.length === 0}
                    >
                        Analyze Counters
                    </button>
                </div>
            )}

            {isLoading && (
                <div className="text-center text-gray-400">Analyzing matchups...</div>
            )}

            {error && (
                <div className="text-center text-gray-400">{error}</div>
            )}

            {counters.length > 0 && (
                <>
                    <button
                        onClick={analyzeCounters}
                        className="mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                        Refresh Analysis
                    </button>
                    <ul className="space-y-3">
                        {counters.map(({ hero, winRate }) => (
                            <li key={`counter-${hero.id}-${winRate}`} className="flex items-center gap-3">
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
                                        ({winRate.toFixed(1)}% win rate against enemy team)
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