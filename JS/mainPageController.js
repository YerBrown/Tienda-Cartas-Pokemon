import PokemonSetsMenu from "./CLASS/pokemonSetsMenu.js";
import Nav from "./CLASS/nav.js";
import { createHTMLElement } from "./codigo.js";
import ShopMenu from "./CLASS/shopMenu.js";
import CombatMenu from "./CLASS/combatsMenu.js";
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
function loadFooter() {
  const footer = createHTMLElement("footer");
  const pageText = createHTMLElement("p");
  pageText.innerText =
    "Disclaimer: This page is not an official website of Nintendo. It is independently created and is not affiliated with, authorized, or endorsed by Nintendo in any way.";
    footer.appendChild(pageText);
  document.body.appendChild(footer);
}
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
  loadSetsMenu();
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
