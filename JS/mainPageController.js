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
  // Test my packs
  userDataBase.addPacks("sm11-pack1", "sm11", 1);
  userDataBase.addPacks("sm11-pack2", "sm11", 1);
  userDataBase.addPacks("sm11-pack3", "sm11", 1);
  userDataBase.addPacks("swsh7-pack1", "swsh7", 1);
  userDataBase.addPacks("swsh7-pack2", "swsh7", 1);
  userDataBase.addPacks("swsh5-pack1", "swsh5", 1);
  userDataBase.addPacks("swsh5-pack2", "swsh5", 1);
  userDataBase.addPacks("sv5-pack1", "sv5", 1);
  userDataBase.addPacks("sv5-pack2", "sv5", 1);
  userDataBase.addPacks("sv6-pack1", "sv6", 1);
  userDataBase.addPacks("sv6-pack2", "sv6", 1);
  userDataBase.addPacks("sv3pt5-pack1", "sv3pt5", 1);
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
