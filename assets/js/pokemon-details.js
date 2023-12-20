import { pokeApi } from './poke-api.js';

class PokemonDetails {
    constructor() {
        this.body = document.querySelector('body');
        this.main = document.querySelector('main');

        this.backButton = document.querySelector('.back-button')

        this.detailsHeader = document.querySelector('.details-header');

        this.about = document.querySelector('.about');

        this.stats = document.querySelector('.stats');
        this.baseStats = document.querySelector('.base-stats');

        this.evolution = document.querySelector('.evolution');
    }

    configureTheme() {
        const theme = this.queryString()[3];

        if(theme === 'light') {
            this.body.classList.add(theme);
        }
    }

    queryString() {
        const loc = location.search;
        const query = loc.split(/[&=]/);
        return query;
    }

    async getPokemonData(pokemonName) {
        const pokemon = await pokeApi.getPokemon(pokemonName);

        this.createPokemonDetailsHeader(pokemon);
    }

    createPokemonDetailsHeader(pokemon) {
        this.detailsHeader.innerHTML += `
            <div class="pokemon-image ${pokemon.type}">
                <img class="image" src="${pokemon.sprite}" alt="">
            </div>
            <span class="pokemon-number">${pokemon.id}</span>
            <h1 class="pokemon-name">${pokemon.name}</h1>
            <div class="pokemon-types">
                ${pokemon.types.map((type) => `<span class="pokemon-type ${type}">${type}</span>`).join(' ')}
            </div>
        `;
    }
}

const pokemonDetails = new PokemonDetails();