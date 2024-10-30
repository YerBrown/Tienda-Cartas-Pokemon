import { createHTMLElement, createImgElement } from "../codigo.js";
import {
  loadSetsMenu,
  loadShopMenu,
  loadMyCollectionMenu,
  loadCombatsMenu,
} from "../mainPageController.js";
class Nav {
  constructor() {
    this.createNavBar();
  }
  createNavBar() {
    this.header = createHTMLElement("header");
    const pageTitle = createHTMLElement("div", "page-title");
    const titleText = createHTMLElement("h3");
    titleText.innerText = "Pokémon Card Store";
    const titleIcon = createImgElement(
      "../ASSETS/images/pokeball.png",
      "page icon"
    );

    pageTitle.append(titleIcon, titleText);

    const nav = createHTMLElement("nav");
    const list = createHTMLElement("ul");

    nav.appendChild(list);

    const listItem1 = createHTMLElement("li");
    const linkItem1 = createHTMLElement("a");
    linkItem1.innerText = "Pokémon Sets";
    linkItem1.addEventListener("click", () => {
      loadSetsMenu();
    });
    listItem1.appendChild(linkItem1);

    const listItem2 = createHTMLElement("li");
    const linkItem2 = createHTMLElement("a");
    linkItem2.innerText = "Pokémon Shop";
    linkItem2.addEventListener("click", () => {
      loadShopMenu();
    });
    listItem2.appendChild(linkItem2);

    const listItem3 = createHTMLElement("li");
    const linkItem3 = createHTMLElement("a");
    linkItem3.innerText = "My Collection";
    linkItem3.addEventListener("click", () => {
      loadMyCollectionMenu();
    });
    listItem3.appendChild(linkItem3);

    const listItem4 = createHTMLElement("li");
    const linkItem4 = createHTMLElement("a");
    linkItem4.innerText = "Pokémon Combats";
    linkItem4.addEventListener("click", () => {
      loadCombatsMenu();
    });
    listItem4.appendChild(linkItem4);

    list.append(listItem1, listItem2, listItem3, listItem4);

    const coinsContainer = createHTMLElement("div", "coins-panel");
    this.coinsText = createHTMLElement("p", "coins-text");
    this.coinsText.innerText = '999999'
    const coinsIcon = createImgElement(
      "../ASSETS/images/moneda-de-dolar.png",
      "coins icon"
    );
    coinsContainer.append(this.coinsText, coinsIcon);

    this.header.append(pageTitle, nav, coinsContainer);
  }
  loadNavBar() {
    const currentNav = document.querySelector("header");
    if (currentNav != null) {
      return;
    }
    document.body.appendChild(this.header);
  }
  updateCoinsText(newCoinsAmount){
    this.coinsText.innerText = newCoinsAmount
  }
}
export default Nav;
