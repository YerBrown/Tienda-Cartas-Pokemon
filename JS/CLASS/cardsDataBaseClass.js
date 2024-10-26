import {
  getTypes,
  getSubTypes,
  getSuperTypes,
  getRarities,
  getSetById,
  searchCards,
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
    await this.saveTypes();
    await this.saveSubtypes();
    await this.saveSupertypes();
    await this.saveRarities();
    await this.saveSets();
    console.log(this);
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
    const setsId = ['base1', 'neo1', 'ex1', 'dp1', 'bw1', 'xy1', 'sm1', 'swsh1', 'sv1'];
    // const setsId = ["base1", "neo1"];
    for (const id of setsId) {
      const newSetData = await getSetById(id);
      console.log(newSetData.data[0]);
      const collection = await getCardsBySet(id);
      this.sets.push(
        new Set(
          newSetData.data[0].id,
          newSetData.data[0].name,
          newSetData.data[0].total,
          newSetData.data[0].images,
          collection.data
        )
      );
    }
  }
}
export default CardsDataBase;
