"use client";

import { useState, useEffect } from 'react';
import { Hero, getAllHeroes, getHeroImageUrl } from '@/services/dotaApi';
import Image from 'next/image';

interface HeroSelectionProps {
    onSelect: (hero: Hero) => void;
    onClose: () => void;
}

export default function HeroSelection({ onSelect, onClose }: HeroSelectionProps) {
    const [heroes, setHeroes] = useState<Hero[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHeroes = async () => {
            try {
                const data = await getAllHeroes();
                setHeroes(data);
            } catch (error) {
                console.error('Error fetching heroes:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHeroes();
    }, []);

    if (isLoading) {
        return <div className="text-center text-gray-400">Loading heroes...</div>;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-800 p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-white">Select Hero</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white"
                    >
                        ✕
                    </button>
                </div>
                <div className="grid grid-cols-5 gap-4">
                    {heroes.map((hero) => (
                        <div
                            key={hero.id}
                            className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-gray-700 cursor-pointer"
                            onClick={() => onSelect(hero)}
                        >
                            <Image
                                src={getHeroImageUrl(hero.name)}
                                alt={hero.localized_name}
                                width={64}
                                height={64}
                                className="rounded-lg"
                            />
                            <span className="text-sm text-gray-300 text-center">
                                {hero.localized_name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 