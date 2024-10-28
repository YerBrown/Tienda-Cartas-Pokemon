import Menu from "./menu.js";
import { createHTMLElement, createImgElement } from "../codigo.js";
import CardList from "./cardList.js";
import { getSetById, getCardsBySet } from "../apiCallController.js";

class PokemonSetsMenu extends Menu {
  constructor(parentId) {
    super(parentId);
    this.currentSet;
    this.currentPage = 1;
    this.currentPageSize = 20;
    this.totalPages;
    this.currentSortBy = "number";
    this.currentSortByDirection = "";
    this.currentCardList = new CardList();
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

    const selectSetTitle = createHTMLElement("h3", "", "");
    selectSetTitle.innerText = "Pokémon Sets";

    this.selectSetGrid = createHTMLElement("div", "sets-grid");
    this.selectSet.append(selectSetTitle, this.selectSetGrid);

    this.createCardModal();
  }
  createCardModal() {
    this.cardModal = createHTMLElement("div", "card-modal-parent");
    this.cardModal.style.displa = "none";

    const closeButton = createHTMLElement("button", "card-modal-close-button");
    closeButton.innerText = "Close";
    closeButton.addEventListener("click", () => {
      this.closeCardModal();
    });

    this.cardModalImg = createImgElement(
      "././ASSETS/images/pokemon-card-back.webp"
    );
    this.cardModal.append(closeButton, this.cardModalImg);
  }
  createSetInfoSubmenu() {
    this.setInfo = createHTMLElement("div", "pokemon-set-info");

    const setInfoPanel = this.createSelectedSetInfoPanel();
    const setCollectionPanel = this.createSetCollectionPanel();
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
  createSetCollectionPanel() {
    // Coleccion de cartas del set
    const collection = createHTMLElement("div", "collection");

    const filterPanel = this.createCollectionFilterPanel();
    this.collectionGrid = this.createCollectionGridPanel();
    this.changePagePanel = this.createCollectionChangePagePanel();

    collection.append(filterPanel, this.collectionGrid, this.changePagePanel);
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
      collectionGridPanel.appendChild(collectionGridPanel);
    }
    return collectionGridPanel;
  }
  createCollectionChangePagePanel() {
    const changePagePanel = createHTMLElement("div", "change-page-buttons");
    // Crear prev button
    this.prevButton = createHTMLElement("button", "prev-page-button");
    this.prevButton.innerText = "Prev Page";
    this.prevButton.addEventListener("click", () => {
      if (this.currentPage > 1) {
        --this.currentPage;
        this.updateCollectionPanel();
      }
    });
    // Crear next button
    this.nextButton = createHTMLElement("button", "next-page-button");
    this.nextButton.innerText = "Next Page";
    this.nextButton.addEventListener("click", () => {
      if (this.currentPage < this.totalPages) {
        ++this.currentPage;
        this.updateCollectionPanel();
      }
    });
    // Crear pagina uno de ejemplo
    const pageNumberButton = createHTMLElement("a", "", ["page-number-button"]);
    pageNumberButton.innerText = 1;
    changePagePanel.append(this.prevButton, pageNumberButton, this.nextButton);

    return changePagePanel;
  }
  createLoadingModal() {
    this.loadingModal = createHTMLElement("div", "", ["loading-modal"]);
    const loadingText = createHTMLElement("p");
    loadingText.innerText = "Loading data...";
    const loadingIcon = createImgElement("./ASSETS/images/cargando.png");

    this.loadingModal.append(loadingText, loadingIcon);
  }
  openSetSelectionPanel() {
    this.mainNode.innerHTML = "";
    this.mainNode.appendChild(this.selectSet);
    this.loadAllSet();
  }
  async loadAllSet() {
    const setsId = [
      "base1",
      "neo1",
      "ex1",
      "dp1",
      "bw1",
      "xy1",
      "sm1",
      "swsh1",
      "sv1",
    ];
    const promesas = setsId.map((id) => getSetById(id));
    this.allSetsData = [];
    const resultados = await Promise.all(promesas);
    for (const setData of resultados) {
      this.allSetsData.push(setData.data[0]);
    }
    console.log(this.allSetsData);
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
    this.updateCollectionPanel();
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
    newSetLogo.appendChild(newLogoImg);

    newSetLogo.addEventListener("click", () => {
      this.openSetInfoPanel(setData);
    });
    return newSetLogo;
  }
  async updateCollectionPanel() {
    this.addLoadingModal();
    const pageCards = await getCardsBySet(
      this.currentSet.id,
      this.currentPage,
      this.currentPageSize,
      this.currentSortByDirection + this.currentSortBy
    );
    this.removeLoadingModal();
    this.currentCardList = new CardList(pageCards.data);
    if (this.currentPage == pageCards.page) {
      this.totalPages = Math.ceil(pageCards.totalCount / this.currentPageSize);
      
      this.collectionGrid.innerHTML = "";
      for (const card of pageCards.data) {
        this.collectionGrid.appendChild(this.createCollectionCard(card));
      }
      this.updateCollectionPageButtons();
    }
  }
  updateCollectionPageButtons() {
    this.changePagePanel.innerHTML = "";
    if (this.currentPage == 1) {
      this.prevButton.classList.add("disabled-button");
    } else {
      this.prevButton.classList.remove("disabled-button");
    }
    this.changePagePanel.appendChild(this.prevButton);
    for (let i = 0; i < this.totalPages; i++) {
      const pageNumberButton = createHTMLElement("a", "", [
        "page-number-button",
      ]);
      pageNumberButton.innerText = i + 1;
      pageNumberButton.id = i + 1 == this.currentPage ? "current-page" : "";
      pageNumberButton.addEventListener("click", () => {
        this.currentPage = i + 1;
        this.updateCollectionPanel();
      });
      this.changePagePanel.appendChild(pageNumberButton);
    }
    if (this.currentPage == this.totalPages) {
      this.nextButton.classList.add("disabled-button");
    } else {
      this.nextButton.classList.remove("disabled-button");
    }
    this.changePagePanel.appendChild(this.nextButton);
  }
  createCollectionCard(cardInfo = null) {
    const newCard = createImgElement(
      "./ASSETS/images/pokemon-card-back.webp",
      "default card",
      "",
      ["pokemon-card", "selectable"]
    );

    if (cardInfo == null) {
      return newCard;
    }

    const randomNumber = Math.floor(Math.random() * 101);
    if (randomNumber < 70) {
      newCard.src = cardInfo.images.large;
      newCard.addEventListener("click", () => {
        this.openCardModal(cardInfo.id);
      });
    } else {
      newCard.src = "./ASSETS/images/pokemon-card-back.webp";
    }
    return newCard;
  }
  openCardModal(id) {
    const findedCard = this.currentCardList.getCardById(id);
    if (findedCard != null) {
      this.cardModalImg.src = findedCard.images.large;
    }
    this.mainNode.appendChild(this.cardModal);
  }
  closeCardModal() {
    this.cardModal.parentNode.removeChild(this.cardModal);
  }
  addLoadingModal() {
    const parent = document.getElementById('pokemon-set-info')
    parent.append(this.loadingModal);
  }
  removeLoadingModal() {
    this.loadingModal.parentNode.removeChild(this.loadingModal);
  }
}
export default PokemonSetsMenu;
