import { pokeApi } from "./poke-api.js";

class PokedexConfig {
    offset = 0;
    limit = 5;
}
const pokedexConfig = new PokedexConfig();

class Main {
    constructor() {
        this.pokemonList = document.querySelector(".pokemon-list");
        this.loadMoreButton = document.querySelector(".load-more-button");
    }

    convertPokemonToLi(offset, limit) {
        pokeApi.getAllPokemon(offset, limit).then((allPokemon) => allPokemon.forEach((pokemon) => {
            const newPokemon = document.createElement('li');
            newPokemon.classList.add('pokemon');

            newPokemon.innerHTML = `
            <div class="pokemon-info">
                <span class="pokemon-number">${pokemon.id}</span>
                <span class="pokemon-name">${pokemon.name}</span>
                <div class="pokemon-types">
                    ${pokemon.types.map((type) => `<span class="pokemon-type ${type}">${type}</span>`).join(' ')}
                </div>
            </div>
            <div class="pokemon-image">
                <img src="${pokemon.sprite}" alt="${pokemon.name}">
            </div>`;

            this.pokemonList.appendChild(newPokemon);
        }));
    }

    init() {
        this.convertPokemonToLi(pokedexConfig.offset, pokedexConfig.limit);
    }
}
const main = new Main();
main.init();