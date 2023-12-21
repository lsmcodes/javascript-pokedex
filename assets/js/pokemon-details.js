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
        const pokemonSpecies = await pokeApi.getPokemonSpecies(pokemonName);

        this.createPokemonDetailsHeader(pokemon);
        this.createPokemonDetailsAbout(pokemon, pokemonSpecies);
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

    createPokemonDetailsAbout(pokemon, pokemonSpecies) {
        this.about.innerHTML += `
            <div class="pokedex-entry">
                <h2>Pokédex entry</h2>
                <p class="pokemon-flavor-text">${pokemonSpecies.flavorText}</p>
            </div>

            <div class="pokemon-height">
                <h2>Height</h2>
                <span class="height">${(pokemon.height * 0.1).toFixed(1)}m</span>
            </div>

            <div class="pokemon-weight">
                <h2>Weight</h2>
                <span class="weight">${(pokemon.weight * 0.1).toFixed(1)}kg</span>
            </div>

            <div class="pokemon-abilities">
                <h2>Abilities</h2>
                ${pokemon.abilities.map((ability) => `<span class="ability">${ability}</span>`).join(' ')}
            </div>
        `
    }
}

const pokemonDetails = new PokemonDetails();