import { createHTMLElement, createImgElement } from "../codigo.js";
import {
  loadSetsMenu,
  loadShopMenu,
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
    titleText.innerText = "Pokémon TCG Dealer";
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
    linkItem1.innerText = "Pokémon Collection";
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

    const listItem4 = createHTMLElement("li");
    const linkItem4 = createHTMLElement("a");
    linkItem4.innerText = "Pokémon Combats";
    linkItem4.addEventListener("click", () => {
      loadCombatsMenu();
    });
    listItem4.appendChild(linkItem4);

    list.append(listItem1, listItem2, listItem4);

    const coinsContainer = createHTMLElement("div", "coins-panel");
    this.coinsText = createHTMLElement("p", "coins-text");
    this.coinsText.innerText = "999999";
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
  updateCoinsText(newCoinsAmount) {
    this.coinsText.innerText = newCoinsAmount;
  }
  addCoinsAnim(amount) {
    this.notificationContainer = document.getElementById(
      "coins-notification-container"
    );
    if (!this.notificationContainer) {
      this.notificationContainer = createHTMLElement(
        "div",
        "coins-notification-container"
      );
      this.header.appendChild(this.notificationContainer);
    }
    this.notificationContainer.innerHTML = "";
    const amountText = createHTMLElement("p");
    amountText.innerText = "+" + amount;
    this.notificationContainer.appendChild(amountText);
  }
}
export default Nav;
