import { pokeApi } from "./poke-api.js";

class PokedexConfig {
    offset = 0;
    limit = 4;
    maxRecords = 151;
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
            <div class="pokemon-image ${pokemon.type}">
                <img src="${pokemon.sprite}" alt="${pokemon.name}">
            </div>
            <div class="pokemon-info">
                <span class="pokemon-number">${pokemon.id}</span>
                <span class="pokemon-name">${pokemon.name}</span>
                <div class="pokemon-types">
                    ${pokemon.types.map((type) => `<span class="pokemon-type ${type}">${type}</span>`).join(' ')}
                </div>
            </div>`;

            this.pokemonList.appendChild(newPokemon);
        }));
    }

    loadMorePokemons() {
        const currentRecords = pokedexConfig.offset + pokedexConfig.limit;
        pokedexConfig.offset = currentRecords;
        const nextPageRecords = currentRecords + pokedexConfig.limit;
    
        if (nextPageRecords >= pokedexConfig.maxRecords) {
            const newLimit = pokedexConfig.maxRecords - currentRecords;
            this.convertPokemonToLi(pokedexConfig.offset, newLimit);
            this.loadMoreButton.style.display = 'none';
        } else {
            this.convertPokemonToLi(pokedexConfig.offset, pokedexConfig.limit);
        }
    }

    init() {
        this.convertPokemonToLi(pokedexConfig.offset, pokedexConfig.limit);

        if(this.loadMoreButton) {
            this.loadMoreButton.addEventListener('click', () => {
                this.loadMorePokemons();
            });
        }
    }
}
const main = new Main();
main.init();