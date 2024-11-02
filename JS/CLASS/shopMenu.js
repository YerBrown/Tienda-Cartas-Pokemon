import Menu from "./menu.js";
import {
  createHTMLElement,
  createImgElement,
  loadImagesBeforRendering,
} from "../codigo.js";
import {
  getProductsSets,
  addAllProducts,
  getProductsByFilter,
  getProductById,
} from "../completeProductList.js";
import { dataBase, userDataBase } from "../mainPageController.js";
import OpenPacksModal from "./openPacksModal.js";
class ShopMenu extends Menu {
  constructor(parentId) {
    addAllProducts();
    super(parentId);
    this.currentFilters = { productType: [], set: [] };
    this.currentPage = 1;
    this.currentPageSize = 9;
    this.currentTotalPages = 0;
  }
  createMenu() {
    const menu = createHTMLElement("div", "shop-menu", ["menu"]);
    super.createLoadingModal();

    this.createBuyProductsSubMenu();
    this.createOpenPacksSubmenu();

    return menu;
  }
  loadMenu() {
    super.loadMenu();
    this.openBuyProductsSubmenu();
  }
  openBuyProductsSubmenu() {
    this.mainNode.innerHTML = "";
    this.mainNode.appendChild(this.buyProductsSubmenu);
    if (this.notificationContainer) {
      this.notificationContainer.innerHTML='';
    }
    this.updateProductsViewPanel();
  }
  openOpenPacksSubmenu() {
    this.mainNode.innerHTML = "";
    this.mainNode.appendChild(this.openPacksSubmenu);
    this.openPacksSubmenu.innerHTML = "";
    this.openPacksSubmenu.append(this.myPacksPanel, this.closeMyPacksButton);
    this.updateMyPackPanel();
  }
  //Comprar productos submenu
  createBuyProductsSubMenu() {
    this.buyProductsSubmenu = createHTMLElement("div", "buy-products-submenu");
    const topPanel = this.createTopPanel();
    const bottomPanel = this.createBottomPanel();
    const openMyPacksButton = this.createOpenMyPacksButton();
    this.buyProductsSubmenu.append(topPanel, bottomPanel, openMyPacksButton);
  }
  createTopPanel() {
    this.topPanelArtwork = createHTMLElement("div", "shop-top-panel", [
      "top-panel",
    ]);

    const shopTitle = createHTMLElement("h1", "shop-title");
    shopTitle.innerText = "Pokémon Card Shop";

    this.topPanelArtwork.appendChild(shopTitle);
    const cardExample1 = createImgElement(
      "/ASSETS/images/card-1.png",
      "example card1",
      "example-card-1"
    );
    const cardExample2 = createImgElement(
      "/ASSETS/images/card-2.png",
      "example card2",
      "example-card-2"
    );
    const cardExample3 = createImgElement(
      "/ASSETS/images/card-3.png",
      "example card3",
      "example-card-3"
    );

    const cardExample4 = createImgElement(
      "/ASSETS/images/shop-items/sv6/pack_3.png",
      "example card4",
      "example-card-4"
    );
    const cardExample5 = createImgElement(
      "/ASSETS/images/shop-items/sv7/pack_4.png",
      "example card5",
      "example-card-5"
    );

    this.topPanelArtwork.append(
      cardExample1,
      cardExample2,
      cardExample3,
      cardExample4,
      cardExample5
    );
    return this.topPanelArtwork;
  }
  createBottomPanel() {
    const bottomPanel = createHTMLElement("div", "shop-bottom-panel");
    const filterPanel = this.createFilterBar();
    this.productsViewPanel = this.createProductsViewPanel();

    bottomPanel.append(filterPanel, this.productsViewPanel);
    return bottomPanel;
  }
  createOpenMyPacksButton() {
    const myPacksButton = createHTMLElement("button", "open-my-packs-button");
    myPacksButton.innerText = "My Packs";
    myPacksButton.addEventListener("click", () => {
      this.openOpenPacksSubmenu();
    });
    return myPacksButton;
  }
  createFilterBar() {
    const filterPanel = createHTMLElement("div", "shop-filter-panel");

    // Crear el filtro por tipo de producto
    const productFilter = createHTMLElement("div", "product-filter");
    const productFilterTitle = createHTMLElement("p");
    productFilterTitle.innerText = "Product type:";
    const pack = this.createInputCheckbox("product", "pack", "Pack");
    const bundle = this.createInputCheckbox("product", "bundle", "Bundle");
    const eliteTrainerBox = this.createInputCheckbox(
      "product",
      "elite_trainer_box",
      "Elite Trainer Box"
    );
    const specialCollectionBox = this.createInputCheckbox(
      "product",
      "special_collection_box",
      "Special Collection Box"
    );
    const megaBox = this.createInputCheckbox("product", "mega_box", "Mega Box");

    productFilter.append(
      productFilterTitle,
      pack,
      bundle,
      eliteTrainerBox,
      specialCollectionBox,
      megaBox
    );

    // Crear el filtro por set
    const setFilter = createHTMLElement("div", "set-filter");
    const setFilterTitle = createHTMLElement("p");
    setFilterTitle.innerText = "Set:";
    setFilter.appendChild(setFilterTitle);
    const allSets = getProductsSets();
    for (const set of allSets) {
      const setData = dataBase.getSetById(set);
      const newInput = this.createInputCheckbox("set", set, setData.name);
      setFilter.appendChild(newInput);
    }

    // Añadir todos los distintos campos de filtro
    filterPanel.append(productFilter, setFilter);
    return filterPanel;
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
      if (inputName == "product") {
        if (this.currentFilters.productType.includes(inputValue)) {
          this.currentFilters.productType =
            this.currentFilters.productType.filter(
              (productType) => productType != inputValue
            );
        } else {
          this.currentFilters.productType.push(inputValue);
        }
      } else if (inputName == "set") {
        if (this.currentFilters.set.includes(inputValue)) {
          this.currentFilters.set = this.currentFilters.set.filter(
            (set) => set != inputValue
          );
        } else {
          this.currentFilters.set.push(inputValue);
        }
      }
      this.updateProductsViewPanel();
    });
    return newInput;
  }
  createProductsViewPanel() {
    const productsPanel = createHTMLElement("div", "products-panel");
    this.pageButtonsTop = this.createCollectionChangePagePanel();
    this.pageButtonsBottom = this.createCollectionChangePagePanel();
    this.productsGrid = createHTMLElement("div", "products-view-grid");

    productsPanel.append(
      this.pageButtonsTop,
      this.productsGrid,
      this.pageButtonsBottom
    );

    return productsPanel;
  }
  createProductBox(productData) {
    const productContainer = createHTMLElement("div", "", [
      "product-box",
      "selectable",
    ]);
    const productImg = createImgElement(
      productData.imageUrl,
      "product " + productData.name
    );
    const productName = createHTMLElement("p");
    productName.classList.add("product-name");
    productName.innerText = productData.name;
    const priceParent = createHTMLElement("div", "", ["price-container"]);
    const productPrice = createHTMLElement("p");

    productPrice.innerText = productData.price;
    const coinImg = createImgElement("ASSETS/images/moneda-de-dolar.png");
    const buyButton = createHTMLElement("button", "", ["buy-button"]);

    buyButton.innerText = "Buy";
    buyButton.addEventListener("click", () => {
      this.buyPorduct(productData);
    });
    const moreInfoButton = createHTMLElement("button", "", [
      "more-info-button",
    ]);
    moreInfoButton.innerText = "i";
    const moreInfoText = createHTMLElement("p", "", [
      "product-description",
      "disabled",
    ]);
    // Enseñar la descripcion si pone el raton encima
    moreInfoButton.addEventListener("mouseenter", () => {
      if (moreInfoText.classList.contains("disabled")) {
        moreInfoText.classList.remove("disabled");
      }
    });
    moreInfoButton.addEventListener("mouseleave", () => {
      if (!moreInfoText.classList.contains("disabled")) {
        moreInfoText.classList.add("disabled");
      }
    });
    moreInfoButton.addEventListener("touchstart", () => {
      if (moreInfoText.classList.contains("disabled")) {
        moreInfoText.classList.remove("disabled");
      }
    });
    moreInfoButton.addEventListener("touchend", () => {
      if (!moreInfoText.classList.contains("disabled")) {
        moreInfoText.classList.add("disabled");
      }
    });
    const setData = dataBase.getSetById(productData.set);
    const moreInfoString =
      productData.name +
      "\ncontains " +
      productData.packsAmount +
      " booster pack of set " +
      setData.name;

    moreInfoText.innerText = moreInfoString;
    priceParent.append(productPrice, coinImg, buyButton);

    productContainer.append(
      moreInfoButton,
      productImg,
      productName,
      priceParent,
      moreInfoText
    );
    // Si el valor es mayor al dinero
    if (productData.price > userDataBase.coins) {
      productPrice.classList.add("overpriced");
      buyButton.classList.add("overpriced");
    }
    return productContainer;
  }
  async updateProductsViewPanel() {
    super.addLoadingModal("shop-bottom-panel");
    const filteredProducts = getProductsByFilter(
      this.currentFilters.productType,
      this.currentFilters.set,
      this.currentPage,
      this.currentPageSize
    );
    this.currentTotalPages = filteredProducts.totalPages;
    const imagesUrl = [];
    for (const product of filteredProducts.results) {
      imagesUrl.push(product.imageUrl);
    }
    await loadImagesBeforRendering(imagesUrl);
    this.productsGrid.innerHTML = "";
    for (const product of filteredProducts.results) {
      const newProduct = this.createProductBox(product);
      this.productsGrid.appendChild(newProduct);
    }
    this.updateCollectionPageButtons(this.pageButtonsTop);
    this.updateCollectionPageButtons(this.pageButtonsBottom);
    super.removeLoadingModal();
  }
  updateProductPrices() {
    if (document.getElementById("buy-products-submenu")) {
      for (const productBox of this.productsGrid.children) {
        const priceText = productBox.querySelector(".price-container p");
        const buyButton = productBox.querySelector(
          ".price-container .buy-button"
        );
        const price = parseInt(priceText.innerText);
        if (price > userDataBase.coins) {
          priceText.classList.add("overpriced");
          buyButton.classList.add("overpriced");
        } else {
          priceText.classList.remove("overpriced");
          buyButton.classList.remove("overpriced");
        }
      }
    }
  }
  createCollectionChangePagePanel() {
    const changePagePanel = createHTMLElement("div", "change-page-buttons");
    // Crear prev button
    const prevButton = createHTMLElement("button", "prev-page-button");
    prevButton.innerText = "Prev Page";
    prevButton.addEventListener("click", () => {
      if (this.currentPage > 1) {
        --this.currentPage;
        this.updateProductsViewPanel();
      }
    });
    // Crear next button
    const nextButton = createHTMLElement("button", "next-page-button");
    nextButton.innerText = "Next Page";
    nextButton.addEventListener("click", () => {
      if (this.currentPage < this.currentTotalPages) {
        ++this.currentPage;
        this.updateProductsViewPanel();
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
    for (let i = 0; i < this.currentTotalPages; i++) {
      const pageNumberButton = createHTMLElement("a", "", [
        "page-number-button",
      ]);
      pageNumberButton.innerText = i + 1;
      pageNumberButton.id = i + 1 == this.currentPage ? "current-page" : "";
      pageNumberButton.addEventListener("click", () => {
        if (i + 1 != this.currentPage) {
          this.currentPage = i + 1;
          this.updateProductsViewPanel();
        }
      });
      changePagePanel.appendChild(pageNumberButton);
    }
    if (this.currentPage == this.currentTotalPages) {
      nextButton.classList.add("disabled-button");
    } else {
      nextButton.classList.remove("disabled-button");
    }
    changePagePanel.appendChild(nextButton);
  }

  // Abrir sobres submenu
  createOpenPacksSubmenu() {
    this.openPacksSubmenu = createHTMLElement("div", "open-packs-submenu");
    this.myPacksPanel = this.createMyPacksPanel();
    this.openPackModal = new OpenPacksModal(this);
    this.closeMyPacksButton = this.createCloseMyPacksButton();
  }
  createMyPacksPanel() {
    const myPacksPanel = createHTMLElement("div", "my-packs-panel");

    const submenuTitle = createHTMLElement("h2", "my-packs-title", ['top-panel']);
    submenuTitle.innerText = "My Pokémon Packs";
    this.myPacksGrid = createHTMLElement("div", "my-packs-grid");
    myPacksPanel.append(submenuTitle, this.myPacksGrid);
    return myPacksPanel;
  }
  updateMyPackPanel() {
    super.addLoadingModal("my-packs-panel");
    this.myPacksGrid.innerHTML = "";
    const myPacks = userDataBase.packs;
    for (const pack of myPacks) {
      const newPack = this.createPack(pack);
      this.myPacksGrid.appendChild(newPack);
    }
    super.removeLoadingModal();
  }
  createPack(pack) {
    const product = getProductById(pack.packid);
    const currentPack = createHTMLElement("div", "", ["pack", "selectable"]);
    const currentImg = createImgElement(
      product.imageUrl,
      "pack " + product.name
    );
    const amountText = createHTMLElement("p");
    amountText.innerText = pack.amount;
    currentPack.append(currentImg, amountText);
    currentPack.addEventListener("click", () => {
      this.openPackModal.openOpenPackModal(pack);
    });
    return currentPack;
  }
  createCloseMyPacksButton() {
    const goBackButton = createHTMLElement("button", "close-my-packs-button");
    goBackButton.innerText = "Go Back";
    goBackButton.addEventListener("click", () => {
      this.openBuyProductsSubmenu();
    });
    return goBackButton;
  }
  buyPorduct(product) {
    if (userDataBase.coins >= product.price) {
      let packsAmount = product.packsAmount;
      let packId = product.set + "-pack1";
      if (product.productType == "pack") {
        packId = product.id;
      }
      userDataBase.addPacks(packId, product.set, packsAmount);
      userDataBase.removeCoins(product.price);
      this.updateProductPrices();
      this.createBuyNotification(packId, product.set, packsAmount);
    }
  }
  createBuyNotification(packid, set, amount) {
    this.notificationContainer = document.getElementById(
      "buy-notification-container"
    );
    if (!this.notificationContainer) {
      this.notificationContainer = createHTMLElement(
        "div",
        "buy-notification-container"
      );
      this.buyProductsSubmenu.appendChild(this.notificationContainer);
    }
    this.notificationContainer.innerHTML = "";
    const notificationParent = createHTMLElement("div", "", [
      "buy-notification",
    ]);
    const packImage = getProductById(packid).imageUrl;
    const packImg = createImgElement(packImage, "pack of set " + set);
    const amountText = createHTMLElement("p");
    amountText.innerText = "x" + amount;
    notificationParent.append(packImg, amountText);
    this.notificationContainer.appendChild(notificationParent);
  }
}
export default ShopMenu;
