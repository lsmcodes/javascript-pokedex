import { pokeApi } from "./poke-api.js";

class PokedexConfig {
    offset = 0;
    limit = 5;
}

class Main {
    constructor() {
        this.pokemonList = document.querySelector(".pokemon-list");
        this.loadMoreButton = document.querySelector(".load-more-button");
    }
}