import { pokedexConfig, main } from './main.js'

class Menu {
    constructor() {
        this.body = document.querySelector('body');
        this.closeButton = document.querySelector('.close-button');
        this.generations = document.querySelectorAll('.generation');
        this.generationImages = document.querySelectorAll('.generation-images')
        this.menu = document.querySelector('.menu');
        this.menuButton = document.querySelector('.menu-button');
        this.pokedex = document.querySelector('.pokedex');
    }

    configureGenerationSpan(generation) {
        this.disableAllGeneration();
        switch (generation) {
            case '2':
                pokedexConfig.offset = pokedexConfig.offsetGeneration = 151;
                pokedexConfig.maxRecords = 251;
                break;
            case '3':
                pokedexConfig.offset  = pokedexConfig.offsetGeneration = 251;
                pokedexConfig.maxRecords = 386;
                break;
            case '4':
                pokedexConfig.offset = pokedexConfig.offsetGeneration = 386;
                pokedexConfig.maxRecords = 493;
                break;
            case '5':
                pokedexConfig.offset = pokedexConfig.offsetGeneration = 493;
                pokedexConfig.maxRecords = 649;
                break;
            case '6':
                pokedexConfig.offset = pokedexConfig.offsetGeneration = 649;
                pokedexConfig.maxRecords = 721;
                break;
            case '7':
                pokedexConfig.offset = pokedexConfig.offsetGeneration = 721;
                pokedexConfig.maxRecords = 809;
                break;
            case '8':
                pokedexConfig.offset = pokedexConfig.offsetGeneration = 809;
                pokedexConfig.maxRecords = 905;
                break;
            case '9':
                pokedexConfig.offset = pokedexConfig.offsetGeneration = 905;
                pokedexConfig.maxRecords = 1010;
                break;
            default:
                pokedexConfig.offset = pokedexConfig.offsetGeneration = 0;
                pokedexConfig.maxRecords = 151;
                break;
        }
        main.pokemonList.innerHTML = null;
        main.convertPokemonToLi(pokedexConfig.offset, pokedexConfig.limit);
    }

    disableAllGeneration() {
        this.generations.forEach((generation) => {
            generation.classList.add('disabled');
            generation.classList.remove('grass');
        })
    }

    toggleMenu() {
        this.menu.classList.toggle('open');
        this.body.classList.toggle('opened-menu-body');
        this.pokedex.classList.toggle('opened-menu-pokedex');
        this.pokedex.classList.toggle('closed-menu-pokedex'), !this.menu.classList.contains('open');
    }

    addListener() {
        this.menuButton.addEventListener('click', () => {
            this.toggleMenu();
        });
        
        this.generations.forEach((generation) => generation.addEventListener('click', () => {
            const generationNumber = generation.dataset.generationNumber;
            this.configureGenerationSpan(generationNumber.toString());
            
            generation.classList.remove('disabled');
            generation.classList.add('grass');
            this.toggleMenu();
        }))
        
        this.closeButton.addEventListener('click', () => {
            this.toggleMenu();
        })
    }

    init() {
        let i = 0;
        this.generationImages.forEach((generation) => {
            this.generations[0].classList.remove('disabled');
            this.generations[0].classList.add('grass');

            const genFirstPokemon = [1, 152, 252, 387, 494, 650, 722, 810, 906];
            generation.innerHTML += `
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${genFirstPokemon[i]}.png" alt="generation ${i + 1} pokemon" class="image">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${genFirstPokemon[i] + 3}.png" alt="generation ${i + 1} pokemon" class="image">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${genFirstPokemon[i] + 6}.png" alt="generation ${i + 1} pokemon" class="image">
            `;
            i++;
        });

        this.addListener();
    }
}

const menu = new Menu();
menu.init();