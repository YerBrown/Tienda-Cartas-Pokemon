class Menu{
    constructor(parentId){
        this.parentId = parentId;
        this.parent = document.getElementById(parentId);
        this.mainNode = this.createMenu;
        
    }
    loadMenu(){
        this.parent.innerHTML = '';
        this.parent.appendChild(this.mainNode);
    }
    createMenu(){
        const menu = document.createElement('div');
        return menu;
    }
}

export default Menu;