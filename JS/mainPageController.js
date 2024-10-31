import PokemonSetsMenu from "./CLASS/pokemonSetsMenu.js";
import Nav from "./CLASS/nav.js";
import { createHTMLElement } from "./codigo.js";
import ShopMenu from "./CLASS/shopMenu.js";
import CardsDataBase from "./CLASS/cardsDataBaseClass.js";
import UserDataBase from "./CLASS/userDataBase.js";

// Declarar los distintos menus
const parentId = "parent";
export const navBar = new Nav();
export const dataBase = new CardsDataBase();
export const userDataBase = new UserDataBase();

let pokemonSetsMenu;
let shopMenu;

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
  //Cargar menu
  loadShopMenu();
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

initialice();
