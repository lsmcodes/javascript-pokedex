import { Pokemon } from "./models/pokemon-model.js";

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
        pokemon.sprite = json.sprites.other.home.front_default;
        pokemon.statsNames = statsNames;
        pokemon.baseStats = baseStats;
        pokemon.types = types;
        pokemon.type = type;
        pokemon.typesUrls = typesUrls;
        pokemon.weight = json.weight;

        return pokemon;
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
            if (pokemonSearch > 649) {
                throw new error;
            }
            const response = await fetch(url);
            const pokemonData = await response.json();
            return this.convertPokemonDataToPokemon(pokemonData);
        } catch (error) {
            return error;
        }
    }
}