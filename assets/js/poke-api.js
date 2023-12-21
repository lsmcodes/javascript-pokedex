import { Pokemon } from "./models/pokemon-model.js";
import { PokemonSpecies } from "./models/pokemon-species-model.js";
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

        const flavorTextEntries = json.flavor_text_entries.filter((slot) => {
            if (slot.language.name === 'en') {
                return slot.flavor_text;
            }
        });

        pokemonSpecies.baseHappiness = json.base_happiness;
        pokemonSpecies.captureRate = json.capture_rate;
        pokemonSpecies.eggGroups = eggGroups;

        pokemonSpecies.evolutionChain = json.evolution_chain.url;

        pokemonSpecies.flavorText = flavorTextEntries[0].flavor_text.replace('POKéMON', 'Pokémon');

        pokemonSpecies.genus = json.genera[7].genus;
        pokemonSpecies.growthRate = json.growth_rate.name;
        pokemonSpecies.id = json.id;

        return pokemonSpecies;
    }

    async convertPokemonDataToPokemonEvolution(json) {
        const pokemonEvolution = new PokemonEvolution();
        const evolutionsUrl = []

        evolutionsUrl.push(json.chain.species.url);

        if(json.chain.evolves_to.length !== 0) {
            json.chain.evolves_to.map((slot) => {
                evolutionsUrl.push(slot.species.url);
                if(slot.evolves_to.length !== 0) {
                    slot.evolves_to.map((slot) => {
                        evolutionsUrl.push(slot.species.url);
                    })
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
            if (pokemonSearch > 905) {
                throw new error;
            }

            const response = await fetch(url);
            const pokemonData = await response.json();
            
            if(pokemonData.id > 905) {
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

    async getPokemonEvolution(url) {
        const response = await fetch(url);
        const responseBody = await response.json();
        return this.convertPokemonDataToPokemonEvolution(responseBody);
    }
}

const pokeApi = new PokeApi();
export { pokeApi };