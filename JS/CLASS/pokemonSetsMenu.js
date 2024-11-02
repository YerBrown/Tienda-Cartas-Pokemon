import Menu from "./menu.js";
import {
  createHTMLElement,
  createImgElement,
  loadImagesBeforRendering,
} from "../codigo.js";
import CardList from "./cardList.js";
import { getSetById, getCardsBySet } from "../apiCallController.js";
import { allProducts, getProductsSets } from "../completeProductList.js";
import { userDataBase } from "../mainPageController.js";
class PokemonSetsMenu extends Menu {
  constructor(parentId) {
    super(parentId);
    this.currentSet;
    this.currentPage = 1;
    this.currentPageSize = 20;
    this.totalPages;
    this.currentSortBy = "number";
    this.currentSortByDirection = "";
    this.allSetsData = null;
    this.currentCardList = null;
  }
  createMenu() {
    const menu = createHTMLElement("div", "pokemon-sets-menu", ["menu"]);

    // Crear submenu de seleccionar set
    this.createSetSelectorSubmenu();

    // Crear submenu de set collection info
    this.createSetInfoSubmenu();

    return menu;
  }
  loadMenu() {
    super.loadMenu();
    this.openSetSelectionPanel();
  }
  createSetSelectorSubmenu() {
    this.selectSet = createHTMLElement("div", "select-set-submenu");

    const selectSetTitle = this.createTopPanel();

    this.selectSetGrid = createHTMLElement("div", "sets-grid");
    this.selectSet.append(selectSetTitle, this.selectSetGrid);

    this.createCardModal();
  }
  createCardModal() {
    this.cardModal = createHTMLElement("div", "card-modal-parent");

    const closeButton = createHTMLElement("button", "card-modal-close-button");
    closeButton.innerText = "Close";
    closeButton.addEventListener("click", () => {
      this.closeCardModal();
    });

    this.cardModalImg = createImgElement(
      "././ASSETS/images/pokemon-card-back.webp",
      "Default card"
    );
    this.cardModal.append(closeButton, this.cardModalImg);
  }
  createSetInfoSubmenu() {
    this.setInfo = createHTMLElement("div", "pokemon-set-info");

    const setInfoPanel = this.createSelectedSetInfoPanel();
    const setCollectionPanel = this.createSetCollectionPanel();
    this.createGoBackButton();
    this.createLoadingModal();

    this.setInfo.append(setInfoPanel, setCollectionPanel);
  }
  createSelectedSetInfoPanel() {
    // Informacion y imagenes del set
    const setInfoContainer = createHTMLElement("div", "info");

    // Logo del set
    this.setInfoLogo = createImgElement("", "", "set-logo");
    const rightInfoContainer = createHTMLElement("div", "right-panel-info");
    // Informacion del set
    this.setName = createHTMLElement("h3", "set-name");
    this.setTotalCards = createHTMLElement("h4", "set-totalCards");
    this.setReleaseDate = createHTMLElement("h4", "set-releaseDate");
    this.setSymbol = createImgElement("", "", "set-symbol");
    rightInfoContainer.append(
      this.setName,
      this.setTotalCards,
      this.setReleaseDate,
      this.setSymbol
    );

    setInfoContainer.append(this.setInfoLogo, rightInfoContainer);
    return setInfoContainer;
  }
  createTopPanel() {
    const topPanel = createHTMLElement("div", "set-top-panel", ["top-panel"]);

    const shopTitle = createHTMLElement("h1", "set-menu-title");
    shopTitle.innerText = "Pokémon Sets Collection";

    topPanel.appendChild(shopTitle);
    return topPanel;
  }
  createSetCollectionPanel() {
    // Coleccion de cartas del set
    const collection = createHTMLElement("div", "collection");

    const filterPanel = this.createCollectionFilterPanel();
    this.collectionGrid = this.createCollectionGridPanel();
    this.changePagePanelTop = this.createCollectionChangePagePanel();
    this.changePagePanelBottom = this.createCollectionChangePagePanel();

    collection.append(
      filterPanel,
      this.changePagePanelTop,
      this.collectionGrid,
      this.changePagePanelBottom
    );
    return collection;
  }
  createCollectionFilterPanel() {
    const filterPanel = createHTMLElement("div", "filter");
    const filterText = createHTMLElement("p");
    filterText.innerText = "Sorted by";

    // Crear selector de orden
    const sortBySelector = createHTMLElement(
      "select",
      "collection-sortby-select"
    );
    const sortByNumber = createHTMLElement("option");
    sortByNumber.value = "number";
    sortByNumber.innerText = "Number";
    const sortByName = createHTMLElement("option");
    sortByName.value = "name";
    sortByName.innerText = "Name";
    const sortByRarity = createHTMLElement("option");
    sortByRarity.value = "rarity";
    sortByRarity.innerText = "Rarity";
    sortBySelector.append(sortByNumber, sortByName, sortByRarity);
    sortBySelector.addEventListener("change", () => {
      if (this.currentSortBy != sortBySelector.value) {
        this.currentSortBy = sortBySelector.value;
        this.updateCollectionPanel();
      }
    });

    // Crear selector de direccion de orden (ascendente o descendente)
    const sortByDirectionSelector = createHTMLElement(
      "select",
      "collection-order-select"
    );
    const sortByAsc = createHTMLElement("option");
    sortByAsc.value = "";
    sortByAsc.innerText = "Asc";
    const sortByDesc = createHTMLElement("option");
    sortByDesc.value = "-";
    sortByDesc.innerText = "Desc";

    sortByDirectionSelector.append(sortByAsc, sortByDesc);
    sortByDirectionSelector.addEventListener("change", () => {
      if (this.currentSortByDirection != sortByDirectionSelector.value) {
        this.currentSortByDirection = sortByDirectionSelector.value;
        this.updateCollectionPanel();
      }
    });
    // Añadir los selectores al panel
    filterPanel.append(filterText, sortBySelector, sortByDirectionSelector);
    return filterPanel;
  }
  createCollectionGridPanel() {
    const collectionGridPanel = createHTMLElement("div", "collection-grid");
    for (let i = 0; i < this.currentPageSize; i++) {
      const newCard = this.createCollectionCard();
      collectionGridPanel.appendChild(newCard);
    }
    return collectionGridPanel;
  }
  createCollectionChangePagePanel() {
    const changePagePanel = createHTMLElement("div", "change-page-buttons");
    // Crear prev button
    const prevButton = createHTMLElement("button", "prev-page-button");
    prevButton.innerText = "Prev Page";
    prevButton.addEventListener("click", () => {
      if (this.currentPage > 1) {
        --this.currentPage;
        this.updateCollectionPanel();
      }
    });
    // Crear next button
    const nextButton = createHTMLElement("button", "next-page-button");
    nextButton.innerText = "Next Page";
    nextButton.addEventListener("click", () => {
      if (this.currentPage < this.totalPages) {
        ++this.currentPage;
        this.updateCollectionPanel();
      }
    });
    // Crear pagina uno de ejemplo
    const pageNumberButton = createHTMLElement("a", "", ["page-number-button"]);
    pageNumberButton.innerText = 1;
    changePagePanel.append(prevButton, pageNumberButton, nextButton);

    return changePagePanel;
  }
  createGoBackButton() {
    this.backButton = createHTMLElement("button", "go-back-button");
    this.backButton.innerText = "Go Back";
    this.backButton.addEventListener("click", () => {
      this.openSetSelectionPanel();
      super.scrollToTop();
    });
    this.setInfo.appendChild(this.backButton);
  }
  async openSetSelectionPanel() {
    this.mainNode.innerHTML = "";
    this.mainNode.appendChild(this.selectSet);
    if (this.allSetsData == null) {
      super.addLoadingModal(this.selectSet.id);
      await this.loadAllSet();
      super.removeLoadingModal();
    }
  }
  async loadAllSet() {
    const setsId = getProductsSets();
    const promesas = setsId.map((id) => getSetById(id));
    this.allSetsData = [];
    const resultados = await Promise.all(promesas);
    for (const setData of resultados) {
      this.allSetsData.push(setData.data[0]);
    }
    console.log(this.allSetsData);
    // Cargar las imagenes antes de cargar
    const imagesUrl = [];
    for (const set of this.allSetsData) {
      imagesUrl.push(set.images.logo);
    }
    await loadImagesBeforRendering(imagesUrl);

    this.addAllSetsLogos(this.allSetsData);
  }
  addAllSetsLogos(allSets) {
    for (const setData of allSets) {
      const newSetLogo = this.createSetLogo(setData);
      this.selectSetGrid.append(newSetLogo);
    }
  }
  openSetInfoPanel(setData) {
    this.mainNode.innerHTML = "";
    this.mainNode.appendChild(this.setInfo);

    // Añadir los datos del set y resetear los valores generales
    this.currentSet = setData;
    this.currentPage = 1;
    this.currentSortBy = "number";
    this.currentSortByDirection = "";

    this.updateSetInfoPanel();
    this.resetCollectionGrid();
    this.updateCollectionPanel();
  }
  resetCollectionGrid() {
    this.collectionGrid.innerHTML = "";
    for (let i = 0; i < this.currentPageSize; i++) {
      const newCard = this.createCollectionCard();
      this.collectionGrid.appendChild(newCard);
    }
    console.log("Collection reset");
  }
  updateSetInfoPanel() {
    this.setInfoLogo.src = this.currentSet.images.logo;
    this.setName.innerText = "Set Name: " + this.currentSet.name;
    this.setTotalCards.innerText = "Total Cards: " + this.currentSet.total;
    this.setReleaseDate.innerText =
      "Release Date: " + this.currentSet.releaseDate;
    this.setSymbol.src = this.currentSet.images.symbol;
  }
  createSetLogo(setData) {
    const newSetLogo = createHTMLElement("div", "", [
      "set-title",
      "selectable",
    ]);
    const newLogoImg = createImgElement(setData.images.logo);
    const currentCardsText = createHTMLElement("p", "", ["set-cards"]);
    currentCardsText.innerText =
      userDataBase.getAmountOfCardBySet(setData.id) +
      " / " +
      setData.total;
    newSetLogo.append(newLogoImg, currentCardsText);
    newSetLogo.href = "#pokemon-set-info";
    newSetLogo.addEventListener("click", () => {
      this.openSetInfoPanel(setData);
      super.scrollToTop();
    });
    return newSetLogo;
  }
  async updateCollectionPanel() {
    super.addLoadingModal("collection");
    // super.scrollToTop();
    const pageCards = await getCardsBySet(
      this.currentSet.id,
      this.currentPage,
      this.currentPageSize,
      this.currentSortByDirection + this.currentSortBy
    );

    this.currentCardList = new CardList(pageCards.data);
    if (this.currentPage == pageCards.page) {
      this.totalPages = Math.ceil(pageCards.totalCount / this.currentPageSize);
      const imagesUrl = [];
      for (const card of this.currentCardList.allCards) {
        imagesUrl.push(card.images.large);
      }
      await loadImagesBeforRendering(imagesUrl);
      this.collectionGrid.innerHTML = "";
      for (const card of this.currentCardList.allCards) {
        this.collectionGrid.appendChild(this.createCollectionCard(card));
      }
      this.updateCollectionPageButtons(this.changePagePanelTop);
      this.updateCollectionPageButtons(this.changePagePanelBottom);
    }
    super.removeLoadingModal();
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
          this.updateCollectionPanel();
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
  createCollectionCard(cardInfo = null) {
    const newCard = createHTMLElement("div", "", [
      "pokemon-card",
      "selectable",
    ]);
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
        this.openCardModal(cardInfo.id);
      });
    } else {
      cardImg.src = "./ASSETS/images/pokemon-card-back.webp";
      const cardNumber = createHTMLElement("p", "", ["card-number-text"]);
      cardNumber.innerText = cardInfo.number + " / " + this.currentSet.total;
      newCard.appendChild(cardNumber);
    }
    return newCard;
  }
  openCardModal(id) {
    const findedCard = this.currentCardList.getCardById(id);
    if (findedCard != null) {
      this.cardModalImg.src = findedCard.images.large;
      this.cardModalImg.alt = "Card of " + findedCard.name;
    }
    this.mainNode.appendChild(this.cardModal);
  }
  closeCardModal() {
    this.cardModal.parentNode.removeChild(this.cardModal);
  }
}
export default PokemonSetsMenu;
