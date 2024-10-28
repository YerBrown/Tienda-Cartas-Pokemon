import { getCardsBySet, getSetById } from "./apiCallController.js";
import { createHTMLElement } from "./codigo.js";
import CardList from "./CLASS/cardList.js";

// Variables locales
let currentSet = "sv4";
let currentPage = 1;
let currentPageSize = 20;
let totalPages = 0;
let currentSortBy = "number";
let currentSortByOrder = "";
let currentCardList = new CardList();

// Cargar las cartas en base al resultado de la api
async function loadCardsOfSet() {
  const pageCards = await getCardsBySet(
    currentSet,
    currentPage,
    currentPageSize,
    currentSortByOrder + currentSortBy
  );
  if (currentPage == pageCards.page) {
    totalPages = Math.ceil(pageCards.totalCount / currentPageSize);
    currentCardList = new CardList(pageCards.data); // guardar la lista actual de cartas
    addCardsToGrid(currentCardList.allCards); // añadir las cartas al grid
    setPageButtons(); // actualizar la seccion de navegacion de paginas
  }
}

// Cambiar de pagina y cargar las cartas de esa pagina
function changePage(addition) {
  let newPage = currentPage + addition;
  if (newPage < 1) {
    newPage = 1;
  }
  if (newPage > totalPages) {
    newPage = totalPages;
  }

  if (newPage != currentPage) {
    currentPage = newPage;
    loadCardsOfSet();
  }
}

// Cambiar el filtro de ordenar las cartas
function changeSortBy(newSortBy) {
  if (currentSortBy != newSortBy) {
    currentSortBy = newSortBy;
    loadCardsOfSet();
  }
}

// Cambiar el orden del filtro ascendente o descendente
function changeSortByOrder(order) {
  if (currentSortByOrder != order) {
    currentSortByOrder = order;
    loadCardsOfSet();
  }
}

// Crear las cartas y añadirlas al grid container
function addCardsToGrid(pageCards) {
  const grid = document.getElementById("cards");
  grid.innerHTML = "";
  for (const card of pageCards) {
    const newCard = createCard(card);
    grid.appendChild(newCard);
  }
}

// Crear los elementos de navegacion por paginas
function setPageButtons() {
  const buttonsParent = document.getElementById("change-page-buttons");
  buttonsParent.innerHTML = "";
  // Crear prev button
  const prevButton = createHTMLElement("button", "prev-page-button", []);
  prevButton.innerText = "Prev Page";
  if (currentPage == 1) {
    prevButton.classList.add("disabled-button");
  }
  prevButton.addEventListener("click", () => {
    changePage(-1);
  });
  // Crear next button
  const nextButton = createHTMLElement("button", "next-page-button", []);
  nextButton.innerText = "Next Page";
  if (currentPage == totalPages) {
    nextButton.classList.add("disabled-button");
  }
  nextButton.addEventListener("click", () => {
    changePage(1);
  });

  // Agregar los botones al contenedor
  buttonsParent.appendChild(prevButton);

  // Agregar todas los botones por cada pagina
  for (let i = 0; i < totalPages; i++) {
    const pageNumberButton = createHTMLElement("a", "", ["page-number-button"]);
    pageNumberButton.innerText = i + 1;
    pageNumberButton.id = i + 1 == currentPage ? "current-page" : "";
    pageNumberButton.addEventListener("click", () => {
      currentPage = i + 1;
      loadCardsOfSet();
    });
    buttonsParent.appendChild(pageNumberButton);
  }

  buttonsParent.appendChild(nextButton);
}

// Crear tarjeta con los datos de la carta
function createCard(cardInfo) {
  const newCard = createHTMLElement("div", "", ["pokemon-card", "selectable"]);
  const cardImg = document.createElement("img");
  newCard.appendChild(cardImg);

  const cardBlock = createHTMLElement("div", "", ["block"]);

  cardImg.alt = "card image of " + cardInfo.name;
  const randomNumber = Math.floor(Math.random() * 101);
  if (randomNumber < 70) {
    cardImg.src = cardInfo.images.large;
    newCard.addEventListener("click", () => {
      openCardModal(cardInfo.id);
    });
  } else {
    cardImg.src = "./ASSETS/images/pokemon-card-back.webp";
    newCard.appendChild(cardBlock);
  }
  return newCard;
}

// Actualizar la informacion del
async function updateSetInfo() {
  // Buscar los elementos de infromacion del set
  const setLogo = document.getElementById("set-logo");
  const setTitle = document.getElementById("set-title");
  const setTotalCards = document.getElementById("set-totalCards");
  const setReleaseDate = document.getElementById("set-releaseDate");
  const setSymbol = document.getElementById("set-symbol");

  // Conseguir la informacion del set con la api y actualizar la informacion con esos datos
  const currentSetData = await getSetById(currentSet);
  setLogo.src = currentSetData.data[0].images.logo;
  setSymbol.src = currentSetData.data[0].images.symbol;
  setTitle.innerText = "Set Name: " + currentSetData.data[0].name;
  setTotalCards.innerText = "Total Cars: " + currentSetData.data[0].total;
  setReleaseDate.innerText =
    "Release Date: " + currentSetData.data[0].releaseDate;
}
// Añadir funcionalidad a los selectores de ordenar
function setUpOrderBySelectors() {
  const sortBySelector = document.getElementById("collection-sortby-select");
  sortBySelector.addEventListener("change", () => {
    changeSortBy(sortBySelector.value);
  });
  const orderSelector = document.getElementById("collection-order-select");
  orderSelector.addEventListener("change", () => {
    changeSortByOrder(orderSelector.value);
  });
}

// Inicializar el menu de la coleccion del set
async function initialiceCollectionMenu() {
  // Cargar la informacion del set y sus cartas
  await Promise.all([loadCardsOfSet(), updateSetInfo()]);
  console.log("Full Set Load Complete!");

  setUpOrderBySelectors();
}
// Abrir un modal con la carta en grande
function openCardModal(cardId) {
  // Eliminar el modal si ya esta activo
  const currentModal = document.getElementById("card-modal-parent");
  if (currentModal != null) {
    currentModal.remove();
  }
  // Crear el modal , el boton de cerrar y la imagen de la carta dentro
  const modalParent = createHTMLElement("div", "card-modal-parent", []);
  const closeButton = createHTMLElement(
    "button",
    "card-modal-close-button",
    []
  );
  closeButton.innerText = "Close";
  closeButton.addEventListener("click", () => {
    modalParent.remove();
  });
  modalParent.appendChild(closeButton);

  const cardImage = createHTMLElement("img", "card-modal-image");
  const findedCard = currentCardList.getCardById(cardId);
  if (findedCard != null) {
    cardImage.src = findedCard.images.large;
    cardImage.addEventListener("click", (event) => {
      event.stopPropagation();
    });
    modalParent.appendChild(cardImage);
  }
  // Añadir el modal al padre del menu
  const mainParent = document.getElementById("pokemon-set-info");
  mainParent.appendChild(modalParent);
}

initialiceCollectionMenu();
function initialiceSelectSetsMenu() {}
