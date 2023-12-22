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

        this.backButton.addEventListener('click', () => {
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

        this.createPokemonDetailsHeader(pokemon);
        this.createPokemonDetailsAbout(pokemon, pokemonSpecies);
        this.createPokemonDetailsStats(pokemon);
        this.createPokemonDetailsEvolution(pokemonEvolutions);
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
            this.evolution.innerHTML += `This Pokémon doesn't evolve.`;
        } else {
            let i = -1;
            this.evolution.innerHTML += pokemonEvolutions.evolution.map((evolution) => {
                i++;
                return `
                    <a href="pokemon-details.html?pokemonName=${evolution.name}&theme=${this.body.classList.contains('light')?'light':'dark'}">
                        <h3>${evolution.name}</h3>
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evolution.id}.png">
                        <div class="evolution-info">
                            <span class="pokemon-type ${evolution.type}">${evolution.type}</span>
                            <span>N°${evolution.id}</span>
                        </div>
                        ${pokemonEvolutions.evolutionsNumber[i] === i + 1?`<span class="material-symbols-outlined">arrow_downward</span>`:``}
                    </a>
                `
            }).join('');
        }
    }
}

const pokemonDetails = new PokemonDetails();