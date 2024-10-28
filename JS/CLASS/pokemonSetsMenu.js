import Menu from "./menu.js";
import { createHTMLElement } from "../codigo.js";
class PokemonSetsMenu extends Menu {
  constructor(parentId) {
    super(parentId);
  }
  createMenu() {
    const menu = createHTMLElement("div", "pokemon-sets-menu", ["menu"]);

    // Crear submenu de seleccionar set
    this.selectSet = createHTMLElement("div", "select-set-submenu", []);

    const selectSetTitle = createHTMLElement('h3', '', '');
    selectSetTitle.innerText = 'Pokémon Sets';

    this.selectSetGrid = createHTMLElement('div', 'sets-grid', []);


    // Añadir submenus al menu principal
    this.menu.append(this.selectSet);


    return menu;
  }
}
