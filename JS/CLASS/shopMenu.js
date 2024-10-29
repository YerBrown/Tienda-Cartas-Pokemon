import Menu from "./menu.js";
import { createHTMLElement, createImgElement } from "../codigo.js";
class ShopMenu extends Menu {
    constructor(parentId){
        super(parentId);
        
    }
    createMenu(){
        const menu = createHTMLElement("div", "shop-menu", ["menu"]);
    }
    loadMenu(){
        super.loadMenu();
    }
    createShopSubmenu(){
        this.createTopPanel();
        this.createBottomPanel();
    }
    createTopPanel(){
        const topPanel = createHTMLElement('div', 'shop-top-panel')

        const shopTitle = createHTMLElement('h1', 'shop-title')
        
    }
    createBottomPanel(){
        this.createFilterBar();
        this.createProductsViewPanel();
    }
    createFilterBar(){

    }
    createProductsViewPanel(){

    }
}
export default ShopMenu;