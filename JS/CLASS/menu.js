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
    return menu;
  }
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
}

export default Menu;
