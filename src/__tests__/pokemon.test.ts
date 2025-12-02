import { describe, it, expect } from 'vitest';
import { 
    transformPokemon, 
    STAT_NAME_MAP, 
    STAT_DISPLAY_NAMES,
    TYPE_COLORS,
    POKEMON_API_BASE_URL
} from '@/components/pokemon/types';
import type { Pokemon } from '@/components/pokemon/types';

describe('Pokemon Types', () => {
    describe('POKEMON_API_BASE_URL', () => {
        it('should have the correct API URL', () => {
            expect(POKEMON_API_BASE_URL).toBe('https://pokeapi.co/api/v2');
        });
    });

    describe('STAT_NAME_MAP', () => {
        it('should map all stat names correctly', () => {
            expect(STAT_NAME_MAP['hp']).toBe('hp');
            expect(STAT_NAME_MAP['attack']).toBe('attack');
            expect(STAT_NAME_MAP['defense']).toBe('defense');
            expect(STAT_NAME_MAP['special-attack']).toBe('specialAttack');
            expect(STAT_NAME_MAP['special-defense']).toBe('specialDefense');
            expect(STAT_NAME_MAP['speed']).toBe('speed');
        });
    });

    describe('STAT_DISPLAY_NAMES', () => {
        it('should have French display names for all stats', () => {
            expect(STAT_DISPLAY_NAMES.hp).toBe('HP');
            expect(STAT_DISPLAY_NAMES.attack).toBe('Attaque');
            expect(STAT_DISPLAY_NAMES.defense).toBe('Défense');
            expect(STAT_DISPLAY_NAMES.specialAttack).toBe('Attaque Spé.');
            expect(STAT_DISPLAY_NAMES.specialDefense).toBe('Défense Spé.');
            expect(STAT_DISPLAY_NAMES.speed).toBe('Vitesse');
        });
    });

    describe('TYPE_COLORS', () => {
        it('should have colors defined for common Pokemon types', () => {
            expect(TYPE_COLORS['fire']).toBeDefined();
            expect(TYPE_COLORS['water']).toBeDefined();
            expect(TYPE_COLORS['grass']).toBeDefined();
            expect(TYPE_COLORS['electric']).toBeDefined();
            expect(TYPE_COLORS['psychic']).toBeDefined();
        });
    });

    describe('transformPokemon', () => {
        it('should transform API response to simplified format', () => {
            const mockPokemon: Pokemon = {
                id: 25,
                name: 'pikachu',
                height: 4,
                weight: 60,
                types: [
                    { slot: 1, type: { name: 'electric', url: 'https://pokeapi.co/api/v2/type/13/' } }
                ],
                abilities: [
                    { ability: { name: 'static', url: 'https://pokeapi.co/api/v2/ability/9/' }, is_hidden: false, slot: 1 },
                    { ability: { name: 'lightning-rod', url: 'https://pokeapi.co/api/v2/ability/31/' }, is_hidden: true, slot: 3 }
                ],
                stats: [
                    { base_stat: 35, effort: 0, stat: { name: 'hp', url: 'https://pokeapi.co/api/v2/stat/1/' } },
                    { base_stat: 55, effort: 0, stat: { name: 'attack', url: 'https://pokeapi.co/api/v2/stat/2/' } },
                    { base_stat: 40, effort: 0, stat: { name: 'defense', url: 'https://pokeapi.co/api/v2/stat/3/' } },
                    { base_stat: 50, effort: 0, stat: { name: 'special-attack', url: 'https://pokeapi.co/api/v2/stat/4/' } },
                    { base_stat: 50, effort: 0, stat: { name: 'special-defense', url: 'https://pokeapi.co/api/v2/stat/5/' } },
                    { base_stat: 90, effort: 2, stat: { name: 'speed', url: 'https://pokeapi.co/api/v2/stat/6/' } }
                ],
                sprites: {
                    front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
                    front_shiny: null,
                    back_default: null,
                    back_shiny: null,
                    other: {
                        'official-artwork': {
                            front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
                            front_shiny: null
                        }
                    }
                }
            };

            const result = transformPokemon(mockPokemon);

            expect(result.id).toBe(25);
            expect(result.name).toBe('pikachu');
            expect(result.height).toBe(4);
            expect(result.weight).toBe(60);
            expect(result.types).toEqual(['electric']);
            expect(result.abilities).toEqual(['static', 'lightning-rod']);
            expect(result.stats).toEqual({
                hp: 35,
                attack: 55,
                defense: 40,
                specialAttack: 50,
                specialDefense: 50,
                speed: 90
            });
            expect(result.sprite).toBe('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png');
        });

        it('should use front_default sprite when official-artwork is not available', () => {
            const mockPokemon: Pokemon = {
                id: 1,
                name: 'bulbasaur',
                height: 7,
                weight: 69,
                types: [
                    { slot: 1, type: { name: 'grass', url: '' } },
                    { slot: 2, type: { name: 'poison', url: '' } }
                ],
                abilities: [
                    { ability: { name: 'overgrow', url: '' }, is_hidden: false, slot: 1 }
                ],
                stats: [
                    { base_stat: 45, effort: 0, stat: { name: 'hp', url: '' } },
                    { base_stat: 49, effort: 0, stat: { name: 'attack', url: '' } },
                    { base_stat: 49, effort: 0, stat: { name: 'defense', url: '' } },
                    { base_stat: 65, effort: 1, stat: { name: 'special-attack', url: '' } },
                    { base_stat: 65, effort: 0, stat: { name: 'special-defense', url: '' } },
                    { base_stat: 45, effort: 0, stat: { name: 'speed', url: '' } }
                ],
                sprites: {
                    front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
                    front_shiny: null,
                    back_default: null,
                    back_shiny: null
                }
            };

            const result = transformPokemon(mockPokemon);

            expect(result.types).toEqual(['grass', 'poison']);
            expect(result.sprite).toBe('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png');
        });
    });
});
