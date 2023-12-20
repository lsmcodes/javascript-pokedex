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
}

const pokemonDetails = new PokemonDetails();