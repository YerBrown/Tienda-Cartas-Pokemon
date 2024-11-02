import PokemonSetsMenu from "./CLASS/pokemonSetsMenu.js";
import Nav from "./CLASS/nav.js";
import { createHTMLElement } from "./codigo.js";
import ShopMenu from "./CLASS/shopMenu.js";
import CombatMenu from "./CLASS/combats.js";
import CardsDataBase from "./CLASS/cardsDataBaseClass.js";
import UserDataBase from "./CLASS/userDataBase.js";

// Declarar los distintos menus
const parentId = "parent";
export let pokemonSetsMenu;
export let shopMenu;
export let combatsMenu;
export const navBar = new Nav();
export const dataBase = new CardsDataBase();
export const userDataBase = new UserDataBase();

function loadNavBar() {
  navBar.loadNavBar();
}
function loadMain() {
  const main = createHTMLElement("main", "parent");
  document.body.appendChild(main);
}
function loadFooter() {}
async function initialice() {
  document.body.innerHTML = "";
  // Añadir estructura base
  loadNavBar();
  loadMain();
  loadFooter();

  await dataBase.loadDataBase();
  pokemonSetsMenu = new PokemonSetsMenu(parentId);
  shopMenu = new ShopMenu(parentId);
  combatsMenu = new CombatMenu(parentId);
  //Cargar menu
  loadCombatsMenu();
}
// Prueba cargar menus
export function loadSetsMenu() {
  pokemonSetsMenu.loadMenu();
}

export function loadShopMenu() {
  shopMenu.loadMenu();
}
export function loadCombatsMenu() {
  combatsMenu.loadMenu();
}

initialice();
