import { navBar, shopMenu } from "../mainPageController.js";
class UserDataBase {
  constructor() {
    this.coins = 0;
    this.lastSaveDate = new Date();
    this.collection = [];
    this.packs = [];
    this.winCoinsCooldown = 1000 * 30;
    this.winAmount = 100;
    this.updateUserData();
    this.checkTimeBetweenSaves();
  }
  updateUserData() {
    const localStorageData = this.getLocalStorageData();
    if (localStorageData) {
      this.coins = localStorageData.coins;
      this.lastSaveDate = localStorageData.lastSaveDate;
      this.collection = localStorageData.collection;
      this.packs = localStorageData.packs;
    }
    this.updateCoins(this.coins);
  }
  getLocalStorageData() {
    const userString = localStorage.getItem("userData");
    return JSON.parse(userString);
  }
  saveLocalStorageData() {
    this.lastSaveDate = new Date();
    localStorage.setItem("userData", JSON.stringify(this));
  }
  checkTimeBetweenSaves() {
    const currentDate = new Date();
    const differenceInMilliseconds = currentDate - new Date(this.lastSaveDate);
    console.log(currentDate, new Date(this.lastSaveDate));
    const addCoinsRemaining = Math.floor(
      differenceInMilliseconds / this.winCoinsCooldown
    );
    console.log(addCoinsRemaining);
    if (addCoinsRemaining > 0) {
      this.addCoins(addCoinsRemaining * this.winAmount);
    }
    setTimeout(() => {
      this.winCoins();
    }, this.winCoinsCooldown);
  }
  addCardsToCollection(cards) {
    for (const card of cards) {
      const newCard = { card: card, amount: 1 };
      const currentCard = this.getCardById(card.id);
      if (currentCard) {
        if (currentCard.amount >= 4) {
          this.updateCoins(this.coins + 30);
        } else {
          currentCard.amount++;
        }
      } else {
        this.collection.push(newCard);
      }
    }
    this.saveLocalStorageData();
  }
  removeCardsOfCollection(cards) {
    for (const card of cards) {
      this.removeCardOfCollection(card.id, 1);
    }
  }
  removeCardOfCollection(id, amount) {
    const removedCard = this.getCardById(id);
    if (removedCard) {
      removedCard.amount -= amount;
      if (removedCard.amount <= 0) {
        const cardIndex = this.collection.indexOf(removedCard);
        this.collection.splice(cardIndex, 1);
      }
    }
    this.saveLocalStorageData();
  }
  sellCard(id) {
    const selledCard = this.getCardById(id);
    const coinsObtained = 30;

    this.updateCoins(this.coins + coinsObtained);
    this.removeCardOfCollection(id, 1);
  }
  getCardById(id) {
    const findedCard = this.collection.find(
      (cardObject) => cardObject.card.id == id
    );
    return findedCard;
  }
  addPacks(pack, set, amount) {
    const newPack = { packid: pack, set: set, amount: amount };
    const currentPack = this.getPackById(pack);
    if (currentPack) {
      currentPack.amount += amount;
    } else {
      this.packs.push(newPack);
    }
    this.saveLocalStorageData();
  }
  removePacks(id, amount) {
    const removedPack = this.getPackById(id);
    if (removedPack) {
      if (removedPack.amount <= amount) {
        removedPack.amount = 0;
        const packIndex = this.collection.indexOf(removedPack);
        this.packs.splice(packIndex, 1);
      } else {
        removedPack.amount -= amount;
      }
    }
    this.saveLocalStorageData();
  }
  getPackById(id) {
    const findedPack = this.packs.find((pack) => pack.packid == id);
    return findedPack;
  }
  removeCoins(amount) {
    this.updateCoins(this.coins - amount);
    this.saveLocalStorageData();
  }
  isPosibleToBuy(price) {
    return price >= this.coins;
  }
  removeCoins(amountRemoved) {
    this.updateCoins(this.coins - amountRemoved);
  }
  addCoins(amountAdded) {
    navBar.addCoinsAnim(amountAdded);
    this.updateCoins(this.coins + amountAdded);
  }
  updateCoins(newCoinsValue) {
    this.coins = newCoinsValue;
    if (this.coins < 0) {
      this.coins = 0;
    } else if (this.coins > 100000) {
      this.coins = 100000;
    }
    navBar.updateCoinsText(this.coins);
    if (shopMenu) {
      shopMenu.updateProductPrices();
    }
    this.saveLocalStorageData();
  }
  isCardInCollection(cardId) {
    const findedCard = this.collection.find((card) => card.card.id == cardId);
    return findedCard ? true : false;
  }
  getAmountOfCardBySet(set) {
    const cardsOfSet = this.collection.filter(
      (cardInfo) => cardInfo.card.set.id == set
    ).length;
    return cardsOfSet;
  }
  winCoins() {
    this.addCoins(this.winAmount);
    setTimeout(() => {
      this.winCoins();
    }, this.winCoinsCooldown);
  }
  getCollectionCardsByFilter(elementFilter, page, pageSize) {
    const cardsMeetFilter = [];
    const resultObject = {
      results: [],
      page: page,
      pageSize: pageSize,
      totalPages: 0,
    };
    for (const cardObject of this.collection) {
      if (this.isCardsMeetFilters(cardObject.card, elementFilter)) {
        cardsMeetFilter.push(cardObject.card);
      }
    }

    const totalPages = Math.ceil(cardsMeetFilter.length / pageSize);
    if (page > totalPages || page < 0) {
      return resultObject;
    }
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedElements = cardsMeetFilter.slice(start, end);

    resultObject.results = paginatedElements;
    resultObject.totalPages = totalPages;
    return resultObject;
  }
  isCardsMeetFilters(card, elementFilter) {
    if (card.supertype != "Pokémon") {
      return false;
    }
    const elementFilterResult =
      elementFilter == "" ||
      elementFilter.some((element) => card.types.includes(element));

    return elementFilterResult;
  }
}
export default UserDataBase;
