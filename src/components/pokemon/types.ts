// Types for Pokemon data based on PokeAPI response structure

// API Configuration
export const POKEMON_API_BASE_URL = 'https://pokeapi.co/api/v2';

export interface PokemonType {
    slot: number;
    type: {
        name: string;
        url: string;
    };
}

export interface PokemonAbility {
    ability: {
        name: string;
        url: string;
    };
    is_hidden: boolean;
    slot: number;
}

export interface PokemonStat {
    base_stat: number;
    effort: number;
    stat: {
        name: string;
        url: string;
    };
}

export interface PokemonSprites {
    front_default: string | null;
    front_shiny: string | null;
    back_default: string | null;
    back_shiny: string | null;
    other?: {
        'official-artwork'?: {
            front_default: string | null;
            front_shiny: string | null;
        };
    };
}

export interface Pokemon {
    id: number;
    name: string;
    height: number;
    weight: number;
    types: PokemonType[];
    abilities: PokemonAbility[];
    stats: PokemonStat[];
    sprites: PokemonSprites;
}

// Simplified Pokemon for comparison
export interface PokemonForComparison {
    id: number;
    name: string;
    height: number;
    weight: number;
    types: string[];
    abilities: string[];
    stats: {
        hp: number;
        attack: number;
        defense: number;
        specialAttack: number;
        specialDefense: number;
        speed: number;
    };
    sprite: string | null;
}

// Stat name mapping
export const STAT_NAME_MAP: Record<string, keyof PokemonForComparison['stats']> = {
    'hp': 'hp',
    'attack': 'attack',
    'defense': 'defense',
    'special-attack': 'specialAttack',
    'special-defense': 'specialDefense',
    'speed': 'speed',
};

export const STAT_DISPLAY_NAMES: Record<keyof PokemonForComparison['stats'], string> = {
    hp: 'HP',
    attack: 'Attaque',
    defense: 'Défense',
    specialAttack: 'Attaque Spé.',
    specialDefense: 'Défense Spé.',
    speed: 'Vitesse',
};

// Type colors for Pokemon types
export const TYPE_COLORS: Record<string, string> = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
};

// Transform API response to simplified format
export function transformPokemon(pokemon: Pokemon): PokemonForComparison {
    const stats: PokemonForComparison['stats'] = {
        hp: 0,
        attack: 0,
        defense: 0,
        specialAttack: 0,
        specialDefense: 0,
        speed: 0,
    };

    pokemon.stats.forEach((stat) => {
        const statKey = STAT_NAME_MAP[stat.stat.name];
        if (statKey) {
            stats[statKey] = stat.base_stat;
        }
    });

    return {
        id: pokemon.id,
        name: pokemon.name,
        height: pokemon.height,
        weight: pokemon.weight,
        types: pokemon.types.map((t) => t.type.name),
        abilities: pokemon.abilities.map((a) => a.ability.name),
        stats,
        sprite: pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default,
    };
}
