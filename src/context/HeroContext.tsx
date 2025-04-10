"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import { Hero } from '@/services/dotaApi';

interface HeroContextType {
    allyHeroes: (Hero | null)[];
    enemyHeroes: (Hero | null)[];
    setAllyHero: (index: number, hero: Hero | null) => void;
    setEnemyHero: (index: number, hero: Hero | null) => void;
}

const HeroContext = createContext<HeroContextType | undefined>(undefined);

export function HeroProvider({ children }: { children: ReactNode }) {
    const [allyHeroes, setAllyHeroes] = useState<(Hero | null)[]>(Array(5).fill(null));
    const [enemyHeroes, setEnemyHeroes] = useState<(Hero | null)[]>(Array(5).fill(null));

    const setAllyHero = (index: number, hero: Hero | null) => {
        const newAllyHeroes = [...allyHeroes];
        newAllyHeroes[index] = hero;
        setAllyHeroes(newAllyHeroes);
    };

    const setEnemyHero = (index: number, hero: Hero | null) => {
        const newEnemyHeroes = [...enemyHeroes];
        newEnemyHeroes[index] = hero;
        setEnemyHeroes(newEnemyHeroes);
    };

    return (
        <HeroContext.Provider value={{ allyHeroes, enemyHeroes, setAllyHero, setEnemyHero }}>
            {children}
        </HeroContext.Provider>
    );
}

export function useHeroContext() {
    const context = useContext(HeroContext);
    if (context === undefined) {
        throw new Error('useHeroContext must be used within a HeroProvider');
    }
    return context;
} 