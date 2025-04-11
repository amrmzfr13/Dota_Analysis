"use client";

import React from 'react';
import Image from 'next/image';
import { heroes } from '@/services/heroData';

const HeroesPage = () => {
    const strengthHeroes = heroes.filter(hero => hero.attribute === 'strength');
    const agilityHeroes = heroes.filter(hero => hero.attribute === 'agility');
    const intelligenceHeroes = heroes.filter(hero => hero.attribute === 'intelligence');
    const universalHeroes = heroes.filter(hero => hero.attribute === 'universal');

    const HeroGrid = ({ heroes, title }: { heroes: typeof strengthHeroes, title: string }) => (
        <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                {title}
            </h2>
            <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-12 lg:grid-cols-16 xl:grid-cols-20 gap-1">
                {heroes.map((hero) => (
                    <div
                        key={hero.id}
                        className="relative group cursor-pointer"
                    >
                        <div className="aspect-[4/3] relative overflow-hidden">
                            <Image
                                src={hero.imageUrl}
                                alt={hero.name}
                                fill
                                sizes="(max-width: 640px) 25vw, (max-width: 768px) 12.5vw, (max-width: 1024px) 8.33vw, 5vw"
                                className="object-cover object-center transform transition-transform duration-300 group-hover:scale-110"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="absolute bottom-2 left-2 right-2 text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {hero.name}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-900 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">Dota 2 Heroes</h1>
                <HeroGrid heroes={strengthHeroes} title="Strength" />
                <HeroGrid heroes={agilityHeroes} title="Agility" />
                <HeroGrid heroes={intelligenceHeroes} title="Intelligence" />
                <HeroGrid heroes={universalHeroes} title="Universal" />
            </div>
        </div>
    );
};

export default HeroesPage; 