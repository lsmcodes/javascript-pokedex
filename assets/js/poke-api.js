import { Pokemon } from "./models/pokemon-model.js";
import { PokemonSpecies } from "./models/pokemon-species-model.js";
import { PokemonWeaknesses } from "./models/pokemon-weaknesses-model.js"
import { PokemonEvolution } from "./models/pokemon-evolution-model.js";

class PokeApi {
    convertPokemonDataToPokemon(json) {
        const pokemon = new Pokemon();

        const abilities = json.abilities.map((slot) => slot.ability.name);
        const statsNames = json.stats.map((slot) => slot.stat.name);
        const baseStats = json.stats.map((slot) => slot.base_stat);
        const types = json.types.map((slot) => slot.type.name);
        const [type] = types;
        const typesUrls = json.types.map((slot) => slot.type.url);

        pokemon.abilities = abilities;
        pokemon.id = json.id;
        pokemon.height = json.height;
        pokemon.name = json.name;
        pokemon.speciesUrl = json.species.url;
        pokemon.sprite = json.sprites.other["official-artwork"].front_default;
        pokemon.statsNames = statsNames;
        pokemon.baseStats = baseStats;
        pokemon.types = types;
        pokemon.type = type;
        pokemon.typesUrls = typesUrls;
        pokemon.weight = json.weight;

        return pokemon;
    }

    convertPokemonDataToPokemonSpecies(json) {
        const pokemonSpecies = new PokemonSpecies();

        const eggGroups = json.egg_groups.map((slot) => slot.name)

        json.flavor_text_entries.filter((slot) => {
            if (slot.language.name === 'en') {
                pokemonSpecies.flavorText = slot.flavor_text;
            }
        });

        json.genera.filter((slot) => {
            if(slot.language.name === 'en') {
                pokemonSpecies.genus = slot.genus;
            }
        });

        pokemonSpecies.eggGroups = eggGroups;
        pokemonSpecies.evolutionChain = json.evolution_chain.url;
        pokemonSpecies.id = json.id;

        return pokemonSpecies;
    }

    convertPokemonDataToPokemonWeaknesses(json) {
        const pokemonWeaknesses = new PokemonWeaknesses();

        const doubleDamageFrom = json.damage_relations.double_damage_from.map((slot) => slot.name);
        pokemonWeaknesses.doubleDamageFrom = doubleDamageFrom;

        const halfDamageFrom = json.damage_relations.half_damage_from.map((slot) => slot.name);
        pokemonWeaknesses.halfDamageFrom = halfDamageFrom;

        const noDamageFrom = json.damage_relations.no_damage_from.map((slot) => slot.name);
        pokemonWeaknesses.noDamageFrom = noDamageFrom;

        return pokemonWeaknesses;
    }

    async convertPokemonDataToPokemonEvolution(json) {
        const pokemonEvolution = new PokemonEvolution();
        const evolutionsUrl = [];

        const evolutions = [];

        evolutionsUrl.push(json.chain.species.url);

        if(json.chain.evolves_to.length !== 0) {
            json.chain.evolves_to.map((slot) => {
                evolutionsUrl.push(slot.species.url);
                evolutions.push(1);
                
                if(slot.evolves_to.length !== 0) {
                    slot.evolves_to.length === 1?evolutions.push(2): evolutions.push(0);
                    slot.evolves_to.map((slot) => {
                        evolutionsUrl.push(slot.species.url);
                    });
                }
            });
        } else {
            return new Error;
        }

        const evolution = await Promise.all(evolutionsUrl.map(async (evolutionUrl) => {
            const response = await this.getPokemonSpecies(evolutionUrl);
            const evolution = await this.getPokemon(response.id.toString());
            return evolution;
        }))

        pokemonEvolution.evolutionsNumber = evolutions;
        pokemonEvolution.evolution = evolution;
        return pokemonEvolution;
    }

    async getPokemonData(pokemon) {
        const response = await fetch(pokemon.url);
        const responseBody = await response.json();
        return this.convertPokemonDataToPokemon(responseBody);
    }

    async getAllPokemon(offset, limit) {
        const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

        const response = await fetch(url);
        const responseBody = await response.json();
        const pokemonList = responseBody.results;
        const detailRequest = await pokemonList.map((pokemon) => this.getPokemonData(pokemon));
        const pokemonData = await Promise.all(detailRequest);
        return pokemonData;
    }

    async getPokemon(pokemonSearch) {
        const url = `https://pokeapi.co/api/v2/pokemon/${pokemonSearch.toLowerCase()}`;

        try {
            if (pokemonSearch > 1010) {
                throw new error;
            }

            const response = await fetch(url);
            const pokemonData = await response.json();
            
            if(pokemonData.id > 1010) {
                throw new error;
            }

            return this.convertPokemonDataToPokemon(pokemonData);
        } catch (error) {
            return error;
        }
    }

    async getPokemonSpecies(url) {
        const response = await fetch(url);
        const pokemonData = await response.json();
        return this.convertPokemonDataToPokemonSpecies(pokemonData);
    }

    async getPokemonWeaknesses(urls) {
        const pokemonWeaknesses = new PokemonWeaknesses();
        let { doubleDamageFrom, halfDamageFrom, noDamageFrom } = pokemonWeaknesses;

        for (let i = 0; i < urls.length; i++) {
            const response = await fetch(urls[i]);
            const pokemonData = await response.json();
            const weaknesses = this.convertPokemonDataToPokemonWeaknesses(pokemonData);

            doubleDamageFrom.push(...weaknesses.doubleDamageFrom);
            halfDamageFrom.push(...weaknesses.halfDamageFrom);
            noDamageFrom.push(...weaknesses.noDamageFrom);
        }

        pokemonWeaknesses.doubleDamageFrom = doubleDamageFrom.filter((type, index, array) =>
            array.indexOf(type) === index &&
            halfDamageFrom.indexOf(type) === -1 &&
            noDamageFrom.indexOf(type) === -1);

        pokemonWeaknesses.halfDamageFrom = halfDamageFrom.filter((type, index, array) =>
            array.indexOf(type) === index &&
            doubleDamageFrom.indexOf(type) === -1 &&
            noDamageFrom.indexOf(type) === -1);

        pokemonWeaknesses.noDamageFrom = noDamageFrom.filter((type, index, array) =>
            array.indexOf(type) === index);
        
        return pokemonWeaknesses;
    }

    async getPokemonEvolution(url) {
        const response = await fetch(url);
        const responseBody = await response.json();
        return this.convertPokemonDataToPokemonEvolution(responseBody);
    }
}

const pokeApi = new PokeApi();
export { pokeApi };