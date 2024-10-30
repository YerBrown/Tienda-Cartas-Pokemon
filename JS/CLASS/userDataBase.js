import { navBar } from "../mainPageController.js";
class UserDataBase {
  constructor() {
    this.coins = 0;
    this.updateCoins(1000);
    this.collection = [];
    this.packs = [];
    this.updateUserData();
  }
  updateUserData() {
    const localStorageData = this.getLocalStorageData();
    console.log(localStorageData);
    if (localStorageData) {
      this.coins = localStorageData.coins;
      this.collection = localStorageData.collection;
      this.packs = localStorageData.packs;
      this.updateCoins(this.coins);
    }
  }
  getLocalStorageData() {
    const userString = localStorage.getItem("userData");
    return JSON.parse(userString);
  }
  saveLocalStorageData() {
    localStorage.setItem("userData", JSON.stringify(this));
  }
  addCardsToCollection(cards) {
    for (const card of cards) {
      console.log(card);
      const newCard = { card: card, amount: 1 };
      const currentCard = this.getCardById(card);
      if (currentCard) {
        if (currentCard.amount >= 4) {
          this.updateCoins(this.coins + 30);
        } else {
          currentCard.amount++;
        }
      } else {
        this.collection.push(newCard);
      }
      console.log(card);
    }
    this.saveLocalStorageData();
  }
  removeCardsOfCollection(id, amount) {
    const removedCard = this.getCardById(id);
    if (removedCard) {
      if (removedCard.amount <= amount) {
        const cardIndex = this.collection.indexOf(removedCard);
        this.collection.splice(cardIndex, 1);
      } else {
        removedCard.amount -= amount;
      }
    }
    this.saveLocalStorageData();
  }
  sellCard(id) {
    const selledCard = this.getCardById(id);
    const coinsObtained = 30;

    this.updateCoins(this.coins + coinsObtained);
    this.removeCardsOfCollection(id, 1);
  }
  getCardById(id) {
    const findedCard = this.collection.find((card) => card.id == id);
    return findedCard;
  }
  addPacks(pack, set, amount) {
    const newPack = { packid: pack, set: set, amount: amount };
    const currentPack = this.getPackById(pack);
    console.log(currentPack);
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
  updateCoins(newCoinsValue) {
    this.coins = newCoinsValue;
    if (this.coins < 0) {
      this.coins = 0;
    }
    navBar.updateCoinsText(this.coins);
  }
  isCardInCollection(cardId) {
      const findedCard = this.collection.find((card) => card.card.id == cardId);
    return findedCard ? true : false;
  }
}
export default UserDataBase;
