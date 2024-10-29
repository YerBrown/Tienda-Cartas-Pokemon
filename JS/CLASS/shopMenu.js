import Menu from "./menu.js";
import {
  createHTMLElement,
  createImgElement,
  capitalizeWords,
} from "../codigo.js";
import ShopProduct from "./shopProducts.js";
import { allProducts, getProductsSets } from "../completeProductList.js";
import { dataBase } from "../mainPageController.js";
class ShopMenu extends Menu {
  constructor(parentId) {
    super(parentId);
    this.currentFilters = { productType: [], set: [] };
    this.products = allProducts;
  }
  createMenu() {
    const menu = createHTMLElement("div", "shop-menu", ["menu"]);
    super.createLoadingModal();
    const topPanel = this.createTopPanel();
    const bottomPanel = this.createBottomPanel();

    menu.append(topPanel, bottomPanel);

    return menu;
  }
  loadMenu() {
    super.loadMenu();
    this.updateProductsViewPanel();
  }

  createTopPanel() {
    this.topPanelArtwork = createHTMLElement("div", "shop-top-panel");

    const shopTitle = createHTMLElement("h1", "shop-title");
    shopTitle.innerText = "Pokemon Card Shop";

    this.topPanelArtwork.appendChild(shopTitle);
    return this.topPanelArtwork;
  }
  createBottomPanel() {
    const bottomPanel = createHTMLElement("div", "shop-bottom-panel");
    const filterPanel = this.createFilterBar();
    this.productsViewPanel = this.createProductsViewPanel();

    bottomPanel.append(filterPanel, this.productsViewPanel);
    return bottomPanel;
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
      "elite-trainer-box",
      "Elite Trainer Box"
    );
    const specialCollectionBox = this.createInputCheckbox(
      "product",
      "special-collection-box",
      "Special Collection Box"
    );
    const megaBox = this.createInputCheckbox("product", "mega-box", "Mega Box");

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
    const productsViewPanel = createHTMLElement("div", "products-view-grid");
    return productsViewPanel;
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
    productName.innerText = productData.name;
    const priceParent = createHTMLElement("div", "", ["price-container"]);
    const productPrice = createHTMLElement("p");
    productPrice.innerText = productData.price;
    const coinImg = createImgElement("ASSETS/images/moneda-de-dolar.png");
    priceParent.append(productPrice, coinImg);

    productContainer.append(productImg, productName, priceParent);

    return productContainer;
  }
  async updateProductsViewPanel(newFilters = null) {
    if (newFilters != null) {
      this.currentFilters = newFilters;
    }
    super.addLoadingModal("shop-bottom-panel");
    this.productsViewPanel.innerHTML = "";
    const imagesUrl = [];
    for (const product of this.products) {
      imagesUrl.push(product.imageUrl);
    }
    await super.loadImagesBeforRendering(imagesUrl);
    for (const product of this.products) {
      if (this.isProductMeetFilters(product)) {
        const newProduct = this.createProductBox(product);
        this.productsViewPanel.appendChild(newProduct);
      }
    }
    super.removeLoadingModal();
  }
  isProductMeetFilters(productInfo) {
    const setFilter =
      this.currentFilters.set == "" ||
      this.currentFilters.set.includes(productInfo.set);
    const productFilter =
      this.currentFilters.productType == "" ||
      this.currentFilters.productType.includes(productInfo.productType);
    return setFilter && productFilter;
  }
}
export default ShopMenu;
