import {
  getTypes,
  getSubTypes,
  getSuperTypes,
  getRarities,
  getAllSets,
  getCardsBySet,
} from "../apiCallController.js";
import Set from "./setData.js";
class CardsDataBase {
  constructor() {
    this.types = [];
    this.subTypes = [];
    this.superTypes = [];
    this.rarities = [];
    this.sets = [];
  }
  async loadDataBase() {
    const promesas = [];
    promesas.push(this.saveTypes());
    promesas.push(this.saveSubtypes());
    promesas.push(this.saveSupertypes());
    promesas.push(this.saveRarities());
    promesas.push(this.saveSets());

    await Promise.all(promesas);
  }
  async saveTypes() {
    this.types = await getTypes();
  }
  async saveSubtypes() {
    this.subTypes = await getSubTypes();
  }
  async saveSupertypes() {
    this.superTypes = await getSuperTypes();
  }
  async saveRarities() {
    this.rarities = await getRarities();
  }
  async saveSets() {
    const setResponse = await getAllSets();
    const setWithCollectionKey = setResponse.data;
    for (const set of setWithCollectionKey) {
      set.collection = []
    }
    this.sets = setWithCollectionKey;
  }
  async getCardsOfSetById(setId) {
    const currentSet = this.sets.find((set) => set.id == setId);
    console.log(currentSet);
    if (currentSet.collection.length <= 0) {
      await this.addCardsList(setId);
    }
    console.log(currentSet)
    return currentSet.collection;
  }
  getRandomCardOfSet(setId){
    const set = this.getSetById(setId);
    const randomNumber = Math.floor(Math.random() * set.collection.length);
    return set.collection[randomNumber];
  }
  async addCardsList(setId) {
    const currentSet = this.sets.find((set) => set.id == setId);
    const collection = await getCardsBySet(setId);
    currentSet.collection = collection.data;
  }
  getSetById(id) {
    if (this.sets.length > 0) {
      return this.sets.find((set) => set.id == id);
    }
    return "default";
  }
}
export default CardsDataBase;
