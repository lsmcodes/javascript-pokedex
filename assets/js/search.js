import { pokeApi } from "./poke-api.js";
import { pokedexConfig, main } from "./main.js";

class Search {
    constructor() {
        this.body = document.querySelector('body');
        this.searchBar = document.querySelector('.search-bar');
    }

    searchPokemon() {
        const pokemonSearch = this.searchBar.value;
        pokeApi.getPokemon(pokemonSearch).then((response) => {
            if (response instanceof Error) {
                main.pokemonList.innerHTML = 'Not found.';
            } else {
                const pokemon = response;

                const newPokemon = document.createElement('li');
                newPokemon.classList.add('pokemon', `${pokemon.type}`);

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

                newPokemon.addEventListener('click', () => {
                    window.location.href = `pokemon-details.html?pokemonName=${pokemon.name}&theme=${this.body.classList.contains('light')?'light':'dark'}`;
                });

                main.pokemonList.innerHTML = null;
                main.pokemonList.appendChild(newPokemon);
            }
        }
        );
        main.loadMoreButton.style.display = 'none';
    }

    init() {
        window.addEventListener('load', () => {
            this.searchBar.value = null;
        });
        
        this.searchBar.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                this.searchPokemon();
            }
        });
        
        this.searchBar.addEventListener('input', () => {
            const regex = /%| /;
            if (regex.test(this.searchBar.value)) {
                setInterval(() => {
                    const index = this.searchBar.value.search(regex);
                    this.searchBar.value = this.searchBar.value.substring(0, index) + this.searchBar.value.substring(index + 1);
                }, 500);
            }
            if (this.searchBar.value === '') {
                main.pokemonList.innerHTML = null;
                main.convertPokemonToLi(pokedexConfig.offsetGeneration, 4);
                main.loadMoreButton.style.display = 'block';
            }
        });
    }
}

const search = new Search();
search.init();