export const API_BASE_URL = 'https://api.opendota.com/api';

export interface Hero {
  id: number;
  name: string;
  localized_name: string;
  primary_attr: string;
  attack_type: string;
  roles: string[];
  img: string;
  icon: string;
}

export interface Matchup {
  hero_id: number;
  games_played: number;
  wins: number;
  win_rate: number;
}

export interface HeroMatchup {
  hero: Hero;
  matchups: Matchup[];
}

export async function getAllHeroes(): Promise<Hero[]> {
  const response = await fetch(`${API_BASE_URL}/heroes`);
  if (!response.ok) {
    throw new Error('Failed to fetch heroes');
  }
  return response.json();
}

export async function getHeroMatchups(heroId: number): Promise<Matchup[]> {
  const response = await fetch(`${API_BASE_URL}/heroes/${heroId}/matchups`);
  if (!response.ok) {
    throw new Error('Failed to fetch hero matchups');
  }
  return response.json();
}

export async function getHeroMatchupDetails(heroId: number): Promise<HeroMatchup> {
  try {
    const matchupsResponse = await fetch(`${API_BASE_URL}/heroes/${heroId}/matchups`);

    if (!matchupsResponse.ok) {
      throw new Error(`Failed to fetch matchups: ${matchupsResponse.statusText}`);
    }

    const matchups = await matchupsResponse.json();

    // Get hero data from the heroes list instead of making another API call
    const heroesResponse = await fetch(`${API_BASE_URL}/heroes`);
    if (!heroesResponse.ok) {
      throw new Error('Failed to fetch heroes list');
    }
    const heroes = await heroesResponse.json();
    const hero = heroes.find((h: Hero) => h.id === heroId);

    if (!hero) {
      throw new Error('Hero not found in heroes list');
    }

    return {
      hero,
      matchups
    };
  } catch (error) {
    console.error('Error in getHeroMatchupDetails:', error);
    throw error;
  }
}

export function getHeroImageUrl(heroName: string | undefined): string {
  if (!heroName) {
    return '/images/hero-placeholder.png';
  }
  const cleanName = heroName.replace('npc_dota_hero_', '');
  return `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${cleanName}_vert.jpg`;
}

export function calculateWinRate(matchup: Matchup): number {
  return (matchup.wins / matchup.games_played) * 100;
} 