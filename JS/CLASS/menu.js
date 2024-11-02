import {
  createHTMLElement,
  createImgElement,
  loadImagesBeforRendering,
} from "../codigo.js";
class Menu {
  constructor(parentId) {
    this.parentId = parentId;
    this.createLoadingModal();
    this.mainNode = this.createMenu();
  }
  loadMenu() {
    const parent = document.getElementById(this.parentId);
    parent.innerHTML = "";
    parent.appendChild(this.mainNode);
  }
  createMenu() {
    const menu = document.createElement("div");
    return menu;
  }
  createLoadingModal() {
    this.loadingModal = createHTMLElement("div", "", ["loading-modal"]);
    this.loadingText = createHTMLElement("p");
    this.loadingText.innerText = "Loading ...";
    const loadingIcon = createImgElement("./ASSETS/images/cargando.png");

    this.loadingModal.append(this.loadingText, loadingIcon);
  }
  addLoadingModal(loadingStr = "") {
    const parent = document.getElementsByTagName("body")[0];
    if (parent != null) {
      parent.appendChild(this.loadingModal);
    }
    if (loadingStr != "") {
      this.loadingText.innerText = loadingStr;
    } else {
      this.loadingText.innerText = "Loading ...";
    }
  }
  removeLoadingModal() {
    if (this.loadingModal.parentNode) {
      this.loadingModal.parentNode.removeChild(this.loadingModal);
    }
  }
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
}

export default Menu;
