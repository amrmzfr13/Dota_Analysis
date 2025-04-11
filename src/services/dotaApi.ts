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

// Hero ID to name mapping
export const heroIdToName: Record<number, string> = {
  1: 'Anti-Mage',
  2: 'Axe',
  3: 'Bane',
  4: 'Bloodseeker',
  5: 'Crystal Maiden',
  6: 'Drow Ranger',
  7: 'Earthshaker',
  8: 'Juggernaut',
  9: 'Mirana',
  10: 'Morphling',
  11: 'Shadow Fiend',
  12: 'Phantom Lancer',
  13: 'Puck',
  14: 'Pudge',
  15: 'Razor',
  16: 'Sand King',
  17: 'Storm Spirit',
  18: 'Sven',
  19: 'Tiny',
  20: 'Vengeful Spirit',
  21: 'Windranger',
  22: 'Zeus',
  23: 'Kunkka',
  25: 'Lina',
  26: 'Lion',
  27: 'Shadow Shaman',
  28: 'Slardar',
  29: 'Tidehunter',
  30: 'Witch Doctor',
  31: 'Lich',
  32: 'Riki',
  33: 'Enigma',
  34: 'Tinker',
  35: 'Sniper',
  36: 'Necrophos',
  37: 'Warlock',
  38: 'Beastmaster',
  39: 'Queen of Pain',
  40: 'Venomancer',
  41: 'Faceless Void',
  42: 'Wraith King',
  43: 'Death Prophet',
  44: 'Phantom Assassin',
  45: 'Pugna',
  46: 'Templar Assassin',
  47: 'Viper',
  48: 'Luna',
  49: 'Dragon Knight',
  50: 'Dazzle',
  51: 'Clockwerk',
  52: 'Leshrac',
  53: "Nature's Prophet",
  54: 'Lifestealer',
  55: 'Dark Seer',
  56: 'Clinkz',
  57: 'Omniknight',
  58: 'Enchantress',
  59: 'Huskar',
  60: 'Night Stalker',
  61: 'Broodmother',
  62: 'Bounty Hunter',
  63: 'Weaver',
  64: 'Jakiro',
  65: 'Batrider',
  66: 'Chen',
  67: 'Spectre',
  68: 'Ancient Apparition',
  69: 'Doom',
  70: 'Ursa',
  71: 'Spirit Breaker',
  72: 'Gyrocopter',
  73: 'Alchemist',
  74: 'Invoker',
  75: 'Silencer',
  76: 'Outworld Destroyer',
  77: 'Lycan',
  78: 'Brewmaster',
  79: 'Shadow Demon',
  80: 'Lone Druid',
  81: 'Chaos Knight',
  82: 'Meepo',
  83: 'Treant Protector',
  84: 'Ogre Magi',
  85: 'Undying',
  86: 'Rubick',
  87: 'Disruptor',
  88: 'Nyx Assassin',
  89: 'Naga Siren',
  90: 'Keeper of the Light',
  91: 'Io',
  92: 'Visage',
  93: 'Slark',
  94: 'Medusa',
  95: 'Troll Warlord',
  96: 'Centaur Warrunner',
  97: 'Magnus',
  98: 'Timbersaw',
  99: 'Bristleback',
  100: 'Tusk',
  101: 'Skywrath Mage',
  102: 'Abaddon',
  103: 'Elder Titan',
  104: 'Legion Commander',
  105: 'Techies',
  106: 'Ember Spirit',
  107: 'Earth Spirit',
  108: 'Underlord',
  109: 'Terrorblade',
  110: 'Phoenix',
  111: 'Oracle',
  112: 'Winter Wyvern',
  113: 'Arc Warden',
  114: 'Monkey King',
  119: 'Dark Willow',
  120: 'Pangolier',
  121: 'Grimstroke',
  123: 'Hoodwink',
  126: 'Void Spirit',
  128: 'Snapfire',
  129: 'Mars',
  135: 'Dawnbreaker',
  136: 'Marci',
  137: 'Primal Beast',
  138: 'Muerta',
};

export function getHeroNameById(id: number): string {
    return heroIdToName[id] || `unknown_hero_${id}`;
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

export const getHeroImageUrl = (heroName: string): string => {
  if (!heroName) {
    return '/images/hero-placeholder.png';
  }
  
  // Remove npc_dota_hero_ prefix if it exists
  heroName = heroName.replace('npc_dota_hero_', '');
  
  // Special cases for hero names that don't match the standard format
  const nameMap: { [key: string]: string } = {
    'furion': 'furion',  // Nature's Prophet's internal name
    'zuus': 'zuus',  // Zeus's internal name
    'obsidian_destroyer': 'obsidian_destroyer',  // Outworld Destroyer's internal name
    'shredder': 'shredder',  // Timbersaw's internal name
    'magnataur': 'magnataur',  // Magnus's internal name
    'nevermore': 'nevermore',  // Shadow Fiend's internal name
    'windrunner': 'windrunner',  // Keep original name
    'necrolyte': 'necrolyte',  // Keep original name
    'skeleton_king': 'skeleton_king',  // Keep original name
    'rattletrap': 'rattletrap',  // Keep original name
    'wisp': 'wisp',  // Keep original name
    'life_stealer': 'life_stealer',  // Keep original name
    'doom_bringer': 'doom_bringer',  // Keep original name
    'queenofpain': 'queenofpain',  // Keep original name
    'treant': 'treant',  // Keep original name
    'centaur': 'centaur',  // Keep original name
    'skywrath_mage': 'skywrath_mage',  // Keep original name
    'abyssal_underlord': 'abyssal_underlord',  // Keep original name
    'legion_commander': 'legion_commander',  // Keep original name
    'techies': 'techies',  // Keep original name
    'ember_spirit': 'ember_spirit',  // Keep original name
    'earth_spirit': 'earth_spirit',  // Keep original name
    'terrorblade': 'terrorblade',  // Keep original name
    'phoenix': 'phoenix',  // Keep original name
    'oracle': 'oracle',  // Keep original name
    'winter_wyvern': 'winter_wyvern',  // Keep original name
    'arc_warden': 'arc_warden',  // Keep original name
    'monkey_king': 'monkey_king',  // Keep original name
    'dark_willow': 'dark_willow',  // Keep original name
    'pangolier': 'pangolier',  // Keep original name
    'grimstroke': 'grimstroke',  // Keep original name
    'hoodwink': 'hoodwink',  // Keep original name
    'void_spirit': 'void_spirit',  // Keep original name
    'snapfire': 'snapfire',  // Keep original name
    'mars': 'mars',  // Keep original name
    'dawnbreaker': 'dawnbreaker',  // Keep original name
    'primal_beast': 'primal_beast',  // Keep original name
    'marci': 'marci',  // Keep original name
    'muerta': 'muerta',  // Keep original name
    // Additional mappings for heroes that were failing
    'vengefulspirit': 'vengefulspirit',  // Keep the original name
    'natures_prophet': 'furion',  // Map display name to internal name
    'shadow_fiend': 'nevermore',  // Map display name to internal name
    'wraith_king': 'skeleton_king',  // Map display name to internal name
    'windranger': 'windrunner',  // Map display name to internal name
    'necrophos': 'necrolyte',  // Map display name to internal name
    'clockwerk': 'rattletrap',  // Map display name to internal name
    'lifestealer': 'life_stealer',  // Map display name to internal name
    'outworld_destroyer': 'obsidian_destroyer',  // Map display name to internal name
    'doom': 'doom_bringer',  // Map display name to internal name
    'treant_protector': 'treant',  // Map display name to internal name
    'centaur_warrunner': 'centaur',  // Map display name to internal name
    'skywrath': 'skywrath_mage',  // Map display name to internal name
    'timbersaw': 'shredder',  // Map display name to internal name
    'legion': 'legion_commander',  // Map display name to internal name
    'ember': 'ember_spirit',  // Map display name to internal name
    'underlord': 'abyssal_underlord',  // Map display name to internal name
    'io': 'wisp',  // Map display name to internal name
    'zeus': 'zuus',  // Map display name to internal name
    'magnus': 'magnataur'  // Map display name to internal name
  };

  // Map special hero names
  if (nameMap[heroName]) {
    heroName = nameMap[heroName];
  }

  // Ensure the hero name is in the correct format
  heroName = heroName.toLowerCase().replace(/\s+/g, '_');

  return `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/heroes/${heroName}_lg.png`;
};

export function calculateWinRate(matchup: Matchup): number {
  // Validate the data
  if (!matchup || typeof matchup.wins !== 'number' || typeof matchup.games_played !== 'number') {
    return 0;
  }

  // Ensure we don't divide by zero
  if (matchup.games_played === 0) {
    return 0;
  }

  // Ensure wins can't be greater than games played
  if (matchup.wins > matchup.games_played) {
    return 100;
  }

  // Calculate win rate and round to 2 decimal places
  // Note: This win rate represents how often the hero wins against the opponent
  // A high win rate means the hero is good against the opponent
  // A low win rate means the hero is bad against the opponent
  const winRate = (matchup.wins / matchup.games_played) * 100;
  return Math.round(winRate * 100) / 100;
}

// Helper function to determine if a hero is good against another hero
export function isGoodAgainst(matchup: Matchup, threshold: number = 50): boolean {
  const winRate = calculateWinRate(matchup);
  return winRate > threshold;
}

// Helper function to determine if a hero is bad against another hero
export function isBadAgainst(matchup: Matchup, threshold: number = 50): boolean {
  const winRate = calculateWinRate(matchup);
  return winRate < threshold;
} 