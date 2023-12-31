import { pokeApi } from './poke-api.js';

class PokemonDetails {
    constructor() {
        this.title = document.querySelector('title');
        this.body = document.querySelector('body');
        this.loadingContainer = document.querySelector('.loading-container');
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
        const pokemonWeaknesses = await pokeApi.getPokemonWeaknesses(pokemon.typesUrls);
        const pokemonEvolutions = await pokeApi.getPokemonEvolution(pokemonSpecies.evolutionChain);

        this.createPokemonDetailsHeader(pokemon, pokemonSpecies);
        this.createPokemonDetailsAbout(pokemon, pokemonSpecies, pokemonWeaknesses);
        this.createPokemonDetailsStats(pokemon);
        this.createPokemonDetailsEvolution(pokemonEvolutions);
        
        this.loadingContainer.style.display = 'none';
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

    createPokemonDetailsAbout(pokemon, pokemonSpecies, pokemonWeaknesses) {
        this.about.innerHTML += `
            <div class="pokedex-entry">
                <h2>Pokédex entry</h2>
                <p class="pokemon-flavor-text">${pokemonSpecies.flavorText}</p>
            </div>

            <div class="pokemon-height">
                <h2>Height</h2>
                <span class="height badge">${(pokemon.height * 0.1).toFixed(1)}m</span>
            </div>

            <div class="pokemon-weight">
                <h2>Weight</h2>
                <span class="weight badge">${(pokemon.weight * 0.1).toFixed(1)}kg</span>
            </div>

            <div class="pokemon-abilities">
                <h2>Abilities</h2>
                ${pokemon.abilities.map((ability) => `<span class="ability badge">${ability}</span>`).join(' ')}
            </div>

            <div class="pokemon-egg-groups">
                <h2>Egg groups</h2>
                ${pokemonSpecies.eggGroups.map((eggGroup) => `<span class="eggGroup badge">${eggGroup}</span>`).join(' ')}
            </div>

            <div class="pokemon-types">
                <h2>Types</h2>
                ${pokemon.types.map((type) => `<span class="pokemon-type ${type}">${type}</span>`).join(' ')}
            </div>

            <div class="pokemon-weaknesses">
                <h2>Weaknesses</h2>
                ${pokemonWeaknesses.doubleDamageFrom.map((type) => `<span class="pokemon-type ${type}">${type}</span>`).join(' ')}
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
            let middle;
            if(pokemonEvolutions.evolves.length > 1) {
                middle = document.createElement('div');
                middle.setAttribute('class', 'middle')
                this.first.after(middle);
            }

            let i = 0;
            pokemonEvolutions.evolutions.map((evolution) => {
                i++;

                if(pokemonEvolutions.evolves.length === 1 && pokemonEvolutions.evolutions.length > 3) {
                    this.last.classList.add('wrap');
                }

                if(!(evolution instanceof Error)) {
                    if(i === 1) {
                        this.first.innerHTML = this.returnEvolution(pokemonEvolutions, evolution);
                    } else if(pokemonEvolutions.evolves.includes(evolution)) {
                        middle.innerHTML += this.returnEvolution(pokemonEvolutions, evolution);
                    } else {
                        this.last.innerHTML += this.returnEvolution(pokemonEvolutions, evolution);
                    }
                }

            }).join('');
        }
    }

    returnEvolution(pokemonEvolutions, evolution) {
        return `
                <a href="pokemon-details.html?pokemonName=${evolution.name}&theme=${this.body.classList.contains('light')?'light':'dark'}">
                    <div class="evolution-info">
                        <h3>${evolution.name}</h3>
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evolution.id}.png">
                        <span class="pokemon-type ${evolution.type}">${evolution.type}</span>
                        <span>N°${evolution.id}</span>
                    </div>
                    ${pokemonEvolutions.evolves.includes(evolution)?
                        `<div>
                            <span class="material-symbols-outlined arrow">arrow_downward</span>
                        </div>`
                        :``}
                </a>
            `
    }

    init() {
        this.loadingContainer.style.display = 'flex';

        const pokemon = this.queryString()[1];
        this.title.innerHTML = pokemon.substring(0,1).toUpperCase() + pokemon.substring(1,pokemon.length);
        this.getPokemonData(pokemon);
        this.configureTheme();
    }
}

const pokemonDetails = new PokemonDetails();
pokemonDetails.init();