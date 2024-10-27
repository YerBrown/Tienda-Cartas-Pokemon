import { searchCards, getAllSets } from "./apiCallController.js";
import CardsDataBase from "./CLASS/cardsDataBaseClass.js";
const cardsDataBase = new CardsDataBase();
let currentPage = 0;
const pageSize = 20;
const mainParent = document.getElementById("parent");
async function initialiceWebPage() {
  const loadModal = createHTMLElement("div", "load-modal", []);
  const loadText = createHTMLElement("h3", "loading-text", []);
  loadText.innerText = "Loading Pokemon Store ...";
  loadModal.appendChild(loadText);
  //mainParent.appendChild(loadModal);
  await cardsDataBase.loadDataBase();
  const loadingText = document.getElementById("loading-text");
  loadModal.remove();
  loadAllSets();
}

async function showSearchedCards(pokemonName) {
  // ++currentPage;
  const cardsData = await searchCards(
    "name:" + pokemonName,
    currentPage,
    pageSize,
    "number",
    ""
  );
  for (const card of cardsData.data) {
    createCard("img", card.name, ["pokemon-card"], card.images.large);
  }
}

function createCard(tag, addedId, addedClasses, imgUrl) {
  const card = document.createElement(tag);
  card.id = addedId;
  for (const newClass of addedClasses) {
    card.classList.add(newClass);
  }
  card.src = imgUrl;
  const parent = document.querySelector("main");
  parent.appendChild(card);
}

export function createHTMLElement(tag, addedId, addedClasses) {
  const htmlElement = document.createElement(tag);
  htmlElement.id = addedId;
  for (const newClass of addedClasses) {
    htmlElement.classList.add(newClass);
  }
  return htmlElement;
}

function loadAllSets() {
  const setsGrid = document.getElementById("sets-grid");
  for (const set of cardsDataBase.sets) {
    const setTitle = createHTMLElement("div", set.id, ["set-title"]);
    const setLogo = createHTMLElement("img", "", []);
    setLogo.src = set.images.logo;
    setLogo.alt = "logo of " + set.name + " set";
    setTitle.appendChild(setLogo);
    setsGrid.appendChild(setTitle);
  }
}
// initialiceWebPage();
