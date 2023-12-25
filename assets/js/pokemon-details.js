import { pokeApi } from './poke-api.js';

class PokemonDetails {
    constructor() {
        this.body = document.querySelector('body');
        this.main = document.querySelector('main');

        this.closeButton = document.querySelector('.close-button')

        this.detailsHeader = document.querySelector('.details-header');

        this.about = document.querySelector('.details-about');

        this.stats = document.querySelector('.details-stats');
        this.baseStats = document.querySelector('.base-stats');

        this.evolution = document.querySelector('.evolution');
        this.first = document.querySelector('.first');
        this.last = document.querySelector('.last');

        this.closeButton.addEventListener('click', () => {
            window.history.back();
        })
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
        const pokemonSpecies = await pokeApi.getPokemonSpecies(pokemon.speciesUrl);
        const pokemonEvolutions = await pokeApi.getPokemonEvolution(pokemonSpecies.evolutionChain);

        this.createPokemonDetailsHeader(pokemon, pokemonSpecies);
        this.createPokemonDetailsAbout(pokemon, pokemonSpecies);
        this.createPokemonDetailsStats(pokemon);
        this.createPokemonDetailsEvolution(pokemonEvolutions);
    }

    createPokemonDetailsHeader(pokemon, pokemonSpecies) {
        this.detailsHeader.classList.add(pokemon.type);
        this.detailsHeader.innerHTML += `
            <div class="pokemon-info">
                <h1 class="pokemon-name">${pokemon.name}</h1>
                <span class="pokemon-number">N°${pokemon.id}</span>
            </div>
            <div class="pokemon-genus">
                <span>${pokemonSpecies.genus}</span>
            </div>
            <div class="pokemon-image">
                <img class="image" src="${pokemon.sprite}" alt="">
            </div>
        `;
    }

    createPokemonDetailsAbout(pokemon, pokemonSpecies) {
        this.about.innerHTML += `
            <div class="pokedex-entry">
                <h2>Pokédex entry</h2>
                <p class="pokemon-flavor-text">${pokemonSpecies.flavorText}</p>
            </div>

            <div class="pokemon-measures">
                <div class="pokemon-height">
                    <h2>Height</h2>
                    <span class="height">${(pokemon.height * 0.1).toFixed(1)}m</span>
                </div>
                <div class="pokemon-weight">
                    <h2>Weight</h2>
                    <span class="weight">${(pokemon.weight * 0.1).toFixed(1)}kg</span>
                </div>
            </div>

            <div class="pokemon-abilities">
                <h2>Abilities</h2>
                ${pokemon.abilities.map((ability) => `<span class="ability">${ability}</span>`).join(' ')}
            </div>

            <div class="pokemon-types">
                <h2>Types</h2>
                ${pokemon.types.map((type) => `<span class="pokemon-type ${type}">${type}</span>`).join(' ')}
            </div>
        `
    }

    createPokemonDetailsStats(pokemon) {
        const bar = document.querySelectorAll('.bar');
        for(let i = 0; i < 6; i++) {
            const progress = document.createElement('div');
            progress.setAttribute('class', 'progress');
            progress.style.width = `${pokemon.baseStats[i]}px`;
            progress.innerHTML = pokemon.baseStats[i];
            progress.classList.add(`${pokemon.type}`);

            bar[i].appendChild(progress);
        }
    }

    createPokemonDetailsEvolution(pokemonEvolutions) {
        if(pokemonEvolutions instanceof Error) {
            this.first.innerHTML += `This Pokémon doesn't evolve.`;
        } else {
            let i = -1;
            pokemonEvolutions.evolution.map((evolution) => {
                i++;
                if(i > 2) {
                    this.last.classList.add('wrap');
                }
                if(i === 0) {
                    this.first.innerHTML = this.returnEvolution(pokemonEvolutions, evolution, i);
                } else {
                    this.last.innerHTML += this.returnEvolution(pokemonEvolutions, evolution, i);
                }
            }).join('');
        }
    }

    returnEvolution(pokemonEvolutions, evolution, i) {
        return `
                <a href="pokemon-details.html?pokemonName=${evolution.name}&theme=${this.body.classList.contains('light')?'light':'dark'}">
                    <h3>${evolution.name}</h3>
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evolution.id}.png">
                    <div class="evolution-info">
                        <span class="pokemon-type ${evolution.type}">${evolution.type}</span>
                        <span>N°${evolution.id}</span>
                    </div>
                </a>
                ${pokemonEvolutions.evolutionsNumber[i] === i + 1?`<span class="material-symbols-outlined arrow">arrow_downward</span>`:``}
            `
    }
}

const pokemonDetails = new PokemonDetails();