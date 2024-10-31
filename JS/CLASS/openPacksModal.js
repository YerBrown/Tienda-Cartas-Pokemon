import { createHTMLElement, createImgElement } from "../codigo.js";
import { dataBase, userDataBase } from "../mainPageController.js";
import { getProductById } from "../completeProductList.js";
class OpenPacksModal {
  constructor(shopMenu) {
    this.shopMenu = shopMenu;
    this.mainNode = this.createModal();
  }
  createModal() {
    const modalParent = createHTMLElement("div", "open-pack-modal");
    this.modalPackImg = createImgElement(
      "/ASSETS/images/pokemon-card-back.webp"
    );
    const openButton = createHTMLElement("button", "open-pack-button");
    openButton.addEventListener("click", () => {
      // TODO: Open pack logic, convertirlo en una funcion
      const obtainedCards = [];
      for (let i = 0; i < 10; i++) {
        const newCard = dataBase.getRandomCardOfSet(
          this.shopMenu.currentPack.set
        );
        obtainedCards.push(newCard);
      }
      console.log(obtainedCards);
      userDataBase.addCardsToCollection(obtainedCards);
      userDataBase.removePacks(this.shopMenu.currentPack.packid, 1);
      this.closeOpenPackModal();
      this.shopMenu.updateMyPackPanel();
    });
    openButton.innerText = "Open Pack";
    const closeButton = createHTMLElement(
      "button",
      "close-open-pack-modal-button"
    );
    closeButton.innerText = "Close";
    closeButton.addEventListener("click", () => {
      this.closeOpenPackModal();
    });
    modalParent.append(this.modalPackImg, openButton, closeButton);
    return modalParent;
  }
  createCloseMyPacksButton() {
    const goBackButton = createHTMLElement("button", "close-my-packs-button");
    goBackButton.innerText = "Go Back";
    goBackButton.addEventListener("click", () => {
      this.shopMenu.openBuyProductsSubmenu();
    });
    return goBackButton;
  }
  async openOpenPackModal(pack) {
    this.shopMenu.currentPack = pack;
    const modalParent = document.getElementById("shop-menu");
    modalParent.appendChild(this.mainNode);
    this.shopMenu.addLoadingModal("open-pack-modal");
    this.modalPackImg.src = getProductById(
      this.shopMenu.currentPack.packid
    ).imageUrl;
    await dataBase.getCardsOfSetById(this.shopMenu.currentPack.set);
    this.shopMenu.removeLoadingModal();
  }
  closeOpenPackModal() {
    this.mainNode.parentNode.removeChild(this.mainNode);
  }
}
export default OpenPacksModal;
