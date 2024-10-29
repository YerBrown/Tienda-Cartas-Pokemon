import {
  getTypes,
  getSubTypes,
  getSuperTypes,
  getRarities,
  getAllSets,
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
    this.sets = setResponse.data;
  }
  getSetById(id) {
    if (this.sets.length > 0) {
      return this.sets.find((set) => set.id == id);
    }
    return "default";
  }
}
export default CardsDataBase;
