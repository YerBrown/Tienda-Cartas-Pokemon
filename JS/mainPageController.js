import PokemonSetsMenu from "./CLASS/pokemonSetsMenu.js";

// Declarar los distintos menus
const parentId = 'parent';
const pokemonSetsMenu = new PokemonSetsMenu(parentId);

// Prueba cargar menus
function loadSetsMenu(){
    pokemonSetsMenu.loadMenu();
}

loadSetsMenu();