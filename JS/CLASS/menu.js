import { createHTMLElement, createImgElement, loadImagesBeforRendering } from "../codigo.js";
class Menu {
  constructor(parentId) {
    this.parentId = parentId;
    this.mainNode = this.createMenu();
  }
  loadMenu() {
    const parent = document.getElementById(this.parentId);
    parent.innerHTML = "";
    parent.appendChild(this.mainNode);
  }
  createMenu() {
    const menu = document.createElement("div");
    this.createLoadingModal();
    return menu;
  }
  createLoadingModal() {
    this.loadingModal = createHTMLElement("div", "", ["loading-modal"]);
    const loadingText = createHTMLElement("p");
    loadingText.innerText = "Loading data...";
    const loadingIcon = createImgElement("./ASSETS/images/cargando.png");

    this.loadingModal.append(loadingText, loadingIcon);
  }
  addLoadingModal(parentId) {
    const parent = document.getElementById(parentId);
    if (parent!=null) {
      parent.appendChild(this.loadingModal);
    }
  }
  removeLoadingModal() {
    this.loadingModal.parentNode.removeChild(this.loadingModal);
  }
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
}

export default Menu;
