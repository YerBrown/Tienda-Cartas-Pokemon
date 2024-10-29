import PokemonSetsMenu from "./CLASS/pokemonSetsMenu.js";
import Nav from "./CLASS/nav.js";
import { createHTMLElement } from "./codigo.js";
import ShopMenu from "./CLASS/shopMenu.js";

// Declarar los distintos menus
const parentId = "parent";
const navBar = new Nav();
const pokemonSetsMenu = new PokemonSetsMenu(parentId);
const shopMenu = new ShopMenu(parentId);

function loadNavBar() {
  navBar.loadNavBar();
}
function loadMain() {
  const main = createHTMLElement("main", "parent");
  document.body.appendChild(main);
}
function loadFooter() {}
function initialice() {
  document.body.innerHTML = "";
  // Añadir estructura base
  loadNavBar();
  loadMain();
  loadFooter();
  //Cargar menu
  loadSetsMenu();
}
// Prueba cargar menus
export function loadSetsMenu() {
  pokemonSetsMenu.loadMenu();
}

export function loadShopMenu() {
  shopMenu.loadMenu();
}
export function loadMyCollectionMenu() {}
export function loadCombatsMenu() {}

// initialice();
