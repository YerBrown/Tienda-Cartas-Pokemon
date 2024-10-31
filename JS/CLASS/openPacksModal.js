import {
  createHTMLElement,
  createImgElement,
  loadImagesBeforRendering,
} from "../codigo.js";
import { dataBase, userDataBase } from "../mainPageController.js";
import { getProductById } from "../completeProductList.js";
class OpenPacksModal {
  constructor(shopMenu) {
    this.shopMenu = shopMenu;
    this.mainNode = this.createModal();
    this.numberCardsInPack = 10;
    this.currentObtainedCards = [];
    this.currentCardIndex = 0;
    this.createShowCardsObtainedPanel();
  }
  createModal() {
    const modalParent = createHTMLElement("div", "open-pack-modal");
    this.openPackPanel = createHTMLElement("div", "open-pack-panel");
    this.modalPackImg = createImgElement(
      "/ASSETS/images/pokemon-card-back.webp",
      "current pack",
      "",
      ["selectable"]
    );
    this.packsAmount = createHTMLElement("p", "pack-amount");
    const openButton = createHTMLElement("button", "open-pack-button");
    openButton.addEventListener("click", () => {
      // TODO: Open pack logic, convertirlo en una funcion
      for (let i = 0; i < this.numberCardsInPack; i++) {
        const newCard = dataBase.getRandomCardOfSet(
          this.shopMenu.currentPack.set
        );
        this.currentObtainedCards.push(newCard);
      }
      console.log(this.currentObtainedCards);
      userDataBase.addCardsToCollection(this.currentObtainedCards);
      userDataBase.removePacks(this.shopMenu.currentPack.packid, 1);
      // this.closeOpenPackModal();
      this.showObtainedCards();
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
    this.openPackPanel.append(
      this.packsAmount,
      this.modalPackImg,
      openButton,
      closeButton
    );
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
  createAllCardsObtainedPanel() {
    this.allCardsObtainedPanel = createHTMLElement(
      "div",
      "all-cards-obtained-panel"
    );
    for (let i = 0; i < this.numberCardsInPack; i++) {
      const newCard = createImgElement(
        this.currentObtainedCards[i].images.large,
        "card of " + this.currentObtainedCards[i].name,
        "obtained-card-" + (i + 1),
        ["obtained-card", "selectable"]
      );
      this.allCardsObtainedPanel.appendChild(newCard);
    }
    const closePanelButton = createHTMLElement(
      "button",
      "close-obtained-button"
    );
    closePanelButton.innerText = "Open Other Pack";
    closePanelButton.addEventListener("click", () => {
      this.openOpenPackModal();
    });
    this.allCardsObtainedPanel.appendChild(closePanelButton);
  }
  showAllCardsObtained() {
    this.mainNode.innerHTML = "";
    this.createAllCardsObtainedPanel();
    this.mainNode.appendChild(this.allCardsObtainedPanel);
  }
  createShowCardsObtainedPanel() {
    this.showCardsPanel = createHTMLElement("div", "show-cards-panel");
    const nextCardButton = createHTMLElement("button", "next-card-button");
    nextCardButton.innerHTML = "Next Card";
    nextCardButton.addEventListener("click", () => this.passToNextCard());
    const closeButton = createHTMLElement(
      "button",
      "close-open-pack-modal-button"
    );
    closeButton.innerText = "Close";
    closeButton.addEventListener("click", () => {
      this.closeOpenPackModal();
    });
    this.cardContainer = createHTMLElement("div", "obtained-cards-container");
    this.showCardsPanel.append(nextCardButton, closeButton, this.cardContainer);
  }
  createObtainedCard(cardInfo) {
    const newCard = createImgElement(
      cardInfo.images.large,
      "card of " + cardInfo.name,
      "",
      ["obtained-card", "selectable"]
    );
    const position = this.currentObtainedCards.indexOf(cardInfo);
    newCard.style.zIndex = this.currentObtainedCards.length - position;
    newCard.addEventListener("click", () => {
      if (!newCard.classList.contains("obtained-card-pass")) {
        // Prevenir clickar dos veces
        this.passToNextCard();
      }
    });
    return newCard;
  }
  async showObtainedCards() {
    this.mainNode.innerHTML = "";
    this.cardContainer.innerHTML = "";
    // Cargar todas las imagenes de las cartas para que cargue a la vez
    const imagesUrl = [];
    for (const card of this.currentObtainedCards) {
      imagesUrl.push(card.images.large);
    }
    await loadImagesBeforRendering(imagesUrl);
    for (const card of this.currentObtainedCards) {
      const newCard = this.createObtainedCard(card);
      this.cardContainer.appendChild(newCard);
    }
    this.mainNode.appendChild(this.showCardsPanel);
  }
  passToNextCard() {
    const currentCard = this.cardContainer.children[this.currentCardIndex];
    currentCard.classList.add("obtained-card-pass");
    this.currentCardIndex++;
    if (this.currentCardIndex == this.numberCardsInPack) {
      this.showAllCardsObtained();
    }
  }
  async openOpenPackModal(pack = null) {
    if (pack) {
      this.shopMenu.currentPack = pack;
    }
    const modalParent = document.getElementById("shop-menu");
    modalParent.appendChild(this.mainNode);
    this.currentObtainedCards = [];
    this.currentCardIndex = 0;
    this.mainNode.innerHTML = "";
    this.mainNode.appendChild(this.openPackPanel);
    this.shopMenu.addLoadingModal("open-pack-modal");
    this.modalPackImg.src = getProductById(
      this.shopMenu.currentPack.packid
    ).imageUrl;
    this.packsAmount.innerText = "x " + this.shopMenu.currentPack.amount;
    await dataBase.getCardsOfSetById(this.shopMenu.currentPack.set);
    this.shopMenu.removeLoadingModal();
  }
  closeOpenPackModal() {
    this.mainNode.parentNode.removeChild(this.mainNode);
  }
}
export default OpenPacksModal;
