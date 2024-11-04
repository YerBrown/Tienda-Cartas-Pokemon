import {
  createHTMLElement,
  createImgElement,
  loadImagesBeforRendering,
  capitalizeWords,
} from "../codigo.js";
import { dataBase, userDataBase } from "../mainPageController.js";
import Menu from "./menu.js";
import Combat from "./combat.js";
class CombatMenu extends Menu {
  constructor(parentId) {
    super(parentId);
    this.cardSlots = 6;
    this.selectedCards = [];
    this.currentIndex = 0;
    this.currentPage = 1;
    this.totalPages = 1;
    this.pageSize = 18;
    this.elementFilter = [];
    this.setFilter = [];
    this.currentCombat = new Combat(this);
    this.createCombatSubmenu();
  }
  createMenu() {
    const menu = createHTMLElement("div", "combats-menu", ["menu"]);
    this.createSelectCardsSubmenu();
    return menu;
  }
  loadMenu() {
    super.loadMenu();
    this.openSelectCardsSubmenu();
  }
  createSelectCardsSubmenu() {
    this.selectCardsSubmenu = createHTMLElement("div", "select-combat-submenu");
    const topPanel = createHTMLElement("div", "", ["top-panel"]);
    const menuTitle = createHTMLElement("h1");
    menuTitle.innerText = "Pokémon Combats";
    topPanel.appendChild(menuTitle);

    const explanationText = createHTMLElement("p");
    explanationText.innerText =
      "In Pokémon battles, each trainer chooses a team of 6 Pokémon, selecting the order in which they will fight. Once the selection is complete and the battle begins, the Pokémon automatically handle the combat without needing further commands. The owner of the winning Pokémon will take possession of the defeated Pokémon from their opponent.";
    this.cardSlotsContainer = createHTMLElement("div", "card-slots-container");

    this.startCombatButton = createHTMLElement(
      "button",
      "start-combat-button",
      ["disabled-button"]
    );
    this.startCombatButton.innerHTML = "Start Combat";
    this.startCombatButton.addEventListener("click", () => {
      if (
        this.selectedCards.filter((card) => card != null).length ==
        this.cardSlots
      ) {
        this.openCombatSubmenu();
      }
    });
    this.selectCardsSubmenu.append(
      topPanel,
      explanationText,
      this.cardSlotsContainer,
      this.startCombatButton
    );
    this.createSelectCardModal();
  }
  createCombatSubmenu() {
    this.combatSubmenu = createHTMLElement("div", "combat-submenu");
  }
  updateCardSlotsPanel() {
    // Resetear la lista de cartas de combate
    if (this.selectedCards.length < this.cardSlots) {
      this.selectedCards = [];
      for (let i = 0; i < this.cardSlots; i++) {
        this.selectedCards.push(null);
      }
    }
    this.cardSlotsContainer.innerHTML = "";
    for (let i = 0; i < this.selectedCards.length; i++) {
      const selectedCard = this.selectedCards[i];
      const newSlot = createImgElement(
        "ASSETS/images/pokemon-card-back.webp",
        "empty slot",
        "slot-" + (i + 1),
        ["combat-card-slot", "selectable"]
      );
      if (selectedCard != null) {
        newSlot.src = selectedCard.images.large;
        newSlot.alt = "card of " + selectedCard.name;
        newSlot.classList.add("selected");
      }
      newSlot.addEventListener("click", () => {
        this.openSelectCardModal(i);
      });
      this.cardSlotsContainer.appendChild(newSlot);
    }
    // comprobar si todos los huecos estan llenos
    if (
      this.selectedCards.filter((card) => card != null).length == this.cardSlots
    ) {
      this.startCombatButton.classList.remove("disabled-button");
    } else if (!this.startCombatButton.classList.contains("disabled-button")) {
      this.startCombatButton.classList.add("disabled-button");
    }
  }
  openSelectCombatSubmenu() {
    this.mainNode.innerHTML = "";
    this.mainNode.appendChild(this.selectCombatSubmenu);
    this.selectedCards = [];
  }
  openSelectCardsSubmenu() {
    this.selectedCards = [];
    this.mainNode.innerHTML = "";
    this.updateCardSlotsPanel();
    this.mainNode.appendChild(this.selectCardsSubmenu);
  }
  openCombatSubmenu() {
    this.mainNode.innerHTML = "";
    this.mainNode.appendChild(this.combatSubmenu);
    this.currentCombat.sendPlayerteam(this.selectedCards);
  }
  createSelectCardModal() {
    this.selectCardModal = createHTMLElement("div", "select-card-modal");
    const closeModalButton = createHTMLElement(
      "button",
      "select-card-modal-close-button"
    );
    closeModalButton.innerText = "Close";
    closeModalButton.addEventListener("click", () => {
      this.closeSelectCardsModal();
    });

    this.currentSelectedCard = createImgElement(
      "ASSETS/images/pokemon-card-back.webp",
      "empty slot",
      "current-selected-slot-card"
    );
    const elementFilterPanel = this.createElementFilterPanel();
    this.myCollectionContainer = this.createMyCollectionPanel();
    this.selectCardModal.append(
      closeModalButton,
      this.currentSelectedCard,
      elementFilterPanel,
      this.myCollectionContainer
    );
  }
  updateSelectedCardSlot() {
    const currentIndexCard = this.selectedCards[this.currentIndex];
    if (currentIndexCard) {
      this.currentSelectedCard.src = currentIndexCard.images.large;
      this.currentSelectedCard.alt = "card of " + currentIndexCard.name;
    } else {
      this.currentSelectedCard.src = "ASSETS/images/pokemon-card-back.webp";
      this.currentSelectedCard.alt = "empty slot";
    }
  }
  createMyCollectionPanel() {
    const myCollectionPanel = createHTMLElement("div", "my-collection-panel");

    const showCollectionPanel = createHTMLElement("div", "collection-panel");
    this.topPagePanel = this.createCollectionChangePagePanel();
    this.bottomPagePanel = this.createCollectionChangePagePanel();
    this.collectionContainer = createHTMLElement(
      "div",
      "my-collection-container"
    );

    showCollectionPanel.append(
      this.topPagePanel,
      this.collectionContainer,
      this.bottomPagePanel
    );

    myCollectionPanel.append(showCollectionPanel);
    return myCollectionPanel;
  }
  createElementFilterPanel() {
    const elementFilterPanel = createHTMLElement(
      "div",
      "element-filters-panel"
    );
    const filterTitle = createHTMLElement("h4");
    filterTitle.innerHTML = "Elements:";
    elementFilterPanel.appendChild(filterTitle);
    const allElements = dataBase.types;
    for (const element of allElements) {
      const newElementFilter = this.createInputCheckbox(
        "element",
        element.id,
        capitalizeWords(element.id)
      );
      elementFilterPanel.appendChild(newElementFilter);
    }

    return elementFilterPanel;
  }
  createInputCheckbox(inputName, inputValue, labelText) {
    const newInput = createHTMLElement("div", "", ["filter-input-container"]);
    const newLabel = createHTMLElement("label");
    newLabel.setAttribute("for", "filter-" + inputValue);
    newLabel.innerText = labelText;
    const newCheckbox = createHTMLElement("input");
    newCheckbox.id = "filter-" + inputValue;
    newCheckbox.type = "checkbox";
    newCheckbox.name = inputName;
    newCheckbox.value = inputValue;
    newInput.append(newCheckbox, newLabel);
    newCheckbox.addEventListener("change", () => {
      super.scrollToTop();
      this.currentPage = 1;
      if (inputName == "element") {
        if (this.elementFilter.includes(inputValue)) {
          this.elementFilter = this.elementFilter.filter(
            (productType) => productType != inputValue
          );
        } else {
          this.elementFilter.push(inputValue);
        }
      }
      this.updateMyCollectionPanel();
    });
    return newInput;
  }
  async updateMyCollectionPanel() {
    const myCollection = userDataBase.getCollectionCardsByFilter(
      this.elementFilter,
      this.currentPage,
      this.pageSize
    );
    this.totalPages = myCollection.totalPages;
    super.addLoadingModal();
    // Cargar las imagenes antes de cargar
    const imagesUrl = [];
    for (const card of myCollection.results) {
      imagesUrl.push(card.images.large);
    }
    await loadImagesBeforRendering(imagesUrl);
    this.collectionContainer.innerHTML = "";
    for (const card of myCollection.results) {
      const newCard = this.createCollectionCard(card);
      this.collectionContainer.appendChild(newCard);
    }
    super.removeLoadingModal();
    this.updateCollectionPageButtons(this.topPagePanel);
    this.updateCollectionPageButtons(this.bottomPagePanel);
  }
  createCollectionCard(cardInfo = null) {
    const newCard = createHTMLElement("div", "", [
      "pokemon-card",
      "selectable",
    ]);
    if (
      this.selectedCards[this.currentIndex] &&
      this.selectedCards[this.currentIndex].id == cardInfo.id
    ) {
      newCard.classList.add("selected");
    } else if (this.isAlreadySelected(cardInfo.id)) {
      newCard.classList.add("selected-in-other-slot");
    }
    const cardImg = createImgElement(
      "./ASSETS/images/pokemon-card-back.webp",
      "default card"
    );
    newCard.appendChild(cardImg);
    if (cardInfo == null) {
      return newCard;
    }

    if (userDataBase.isCardInCollection(cardInfo.id)) {
      cardImg.src = cardInfo.images.large;
      newCard.addEventListener("click", () => {
        // TODO: cambiar la carta selecionada por esta
        if (
          !this.isAlreadySelected(cardInfo.id) &&
          !(
            this.selectedCards[this.currentIndex] &&
            this.selectedCards[this.currentIndex].id == cardInfo.id
          )
        ) {
          this.selectedCards[this.currentIndex] = cardInfo;
          this.updateCardSlotsPanel();
          this.updateSelectedCardSlot();
          this.updateMyCollectionPanel();
        }
      });
    } else {
      cardImg.src = "./ASSETS/images/pokemon-card-back.webp";
    }
    return newCard;
  }
  createCollectionChangePagePanel() {
    const changePagePanel = createHTMLElement("div", "change-page-buttons");
    // Crear prev button
    const prevButton = createHTMLElement("button", "prev-page-button");
    prevButton.innerText = "Prev Page";
    prevButton.addEventListener("click", () => {
      if (this.currentPage > 1) {
        --this.currentPage;
        this.updateMyCollectionPanel();
      }
    });
    // Crear next button
    const nextButton = createHTMLElement("button", "next-page-button");
    nextButton.innerText = "Next Page";
    nextButton.addEventListener("click", () => {
      if (this.currentPage < this.totalPages) {
        ++this.currentPage;
        this.updateMyCollectionPanel();
      }
    });
    // Crear pagina uno de ejemplo
    const pageNumberButton = createHTMLElement("a", "", ["page-number-button"]);
    pageNumberButton.innerText = 1;
    changePagePanel.append(prevButton, pageNumberButton, nextButton);

    return changePagePanel;
  }
  updateCollectionPageButtons(changePagePanel) {
    const prevButton = changePagePanel.querySelector("#prev-page-button");
    const nextButton = changePagePanel.querySelector("#next-page-button");
    changePagePanel.innerHTML = "";
    if (this.currentPage == 1) {
      prevButton.classList.add("disabled-button");
    } else {
      prevButton.classList.remove("disabled-button");
    }
    changePagePanel.appendChild(prevButton);
    for (let i = 0; i < this.totalPages; i++) {
      const pageNumberButton = createHTMLElement("a", "", [
        "page-number-button",
      ]);
      pageNumberButton.innerText = i + 1;
      pageNumberButton.id = i + 1 == this.currentPage ? "current-page" : "";
      pageNumberButton.addEventListener("click", () => {
        if (i + 1 != this.currentPage) {
          this.currentPage = i + 1;
          this.updateMyCollectionPanel();
        }
      });
      changePagePanel.appendChild(pageNumberButton);
    }
    if (this.currentPage == this.totalPages) {
      nextButton.classList.add("disabled-button");
    } else {
      nextButton.classList.remove("disabled-button");
    }
    changePagePanel.appendChild(nextButton);
  }
  openSelectCardModal(index) {
    this.currentIndex = index;
    this.updateSelectedCardSlot();
    this.updateMyCollectionPanel();
    this.mainNode.appendChild(this.selectCardModal);
  }
  closeSelectCardsModal() {
    this.mainNode.removeChild(this.selectCardModal);
  }
  isAlreadySelected(cardId) {
    const selectedCardsId = [];
    for (const card of this.selectedCards) {
      let id = "";
      if (card && this.selectedCards.indexOf(card) != this.currentIndex) {
        id = card.id;
      }
      selectedCardsId.push(id);
    }
    return selectedCardsId.includes(cardId);
  }
}
export default CombatMenu;
