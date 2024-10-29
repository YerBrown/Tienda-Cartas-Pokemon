import ShopProduct from "./CLASS/shopProducts.js";
export const allProducts = [
  new ShopProduct(
    "sm11-pack1",
    "Soon & Moon Unified Minds - Booster Pack 1",
    "sm11",
    "pack",
    "./ASSETS/images/shop-Items/sm11/pack_1.png",
    100
  ),
  new ShopProduct(
    "sm11-pack2",
    "Soon & Moon Unified Minds - Booster Pack 2",
    "sm11",
    "pack",
    "./ASSETS/images/shop-Items/sm11/pack_2.png",
    100
  ),
  new ShopProduct(
    "sm11-pack3",
    "Soon & Moon Unified Minds - Booster Pack 3",
    "sm11",
    "pack",
    "./ASSETS/images/shop-Items/sm11/pack_3.png",
    100
  ),
  new ShopProduct(
    "sm11-pack4",
    "Soon & Moon Unified Minds - Booster Pack 4",
    "sm11",
    "pack",
    "./ASSETS/images/shop-Items/sm11/pack_4.png",
    100
  ),
  new ShopProduct(
    "sv3pt5-pack1",
    "Scarlet & Violet 151 - Booster Pack",
    "sv3pt5",
    "pack",
    "./ASSETS/images/shop-Items/sv3pt5/pack_1.png",
    100
  ),
  new ShopProduct(
    "sv3pt5-bundle",
    "Scarlet & Violet 151 - Booster Bundle",
    "sv3pt5",
    "bundle",
    "./ASSETS/images/shop-Items/sv3pt5/bundle.png",
    500
  ),
  new ShopProduct(
    "sv3pt5-elite-trailer-box",
    "Scarlet & Violet 151 - Elite Trainer Box",
    "sv3pt5",
    "elite-trainer-box",
    "./ASSETS/images/shop-Items/sv3pt5/elite_trainer_box_1.png",
    300
  ),
  new ShopProduct(
    "sv3pt5-special-collection-box",
    "Scarlet & Violet 151 - Special Collection Box",
    "sv3pt5",
    "special-collection-box",
    "./ASSETS/images/shop-Items/sv3pt5/special_collection_box.png",
    1000
  ),
  new ShopProduct(
    "sv4-pack1",
    "Scarlet & Violet Paradox Rift - Booster Pack 1",
    "sv4",
    "pack",
    "./ASSETS/images/shop-Items/sv4/pack_1.png",
    100
  ),
  new ShopProduct(
    "sv4-pack2",
    "Scarlet & Violet Paradox Rift - Booster Pack 2",
    "sv4",
    "pack",
    "./ASSETS/images/shop-Items/sv4/pack_3.png",
    100
  ),
  new ShopProduct(
    "sv4-pack3",
    "Scarlet & Violet Paradox Rift - Booster Pack 3",
    "sv4",
    "pack",
    "./ASSETS/images/shop-Items/sv4/pack_3.png",
    100
  ),
  new ShopProduct(
    "sv4-pack4",
    "Scarlet & Violet Paradox Rift - Booster Pack 4",
    "sv4",
    "pack",
    "./ASSETS/images/shop-Items/sv4/pack_4.png",
    100
  ),
  new ShopProduct(
    "sv4-elite-trainer-box1",
    "Scarlet & Violet Paradox Rift - Elite Trainer Box 1",
    "sv4",
    "elite-trainer-box",
    "./ASSETS/images/shop-Items/sv4/elite_trainer_box_1.png",
    300
  ),
  new ShopProduct(
    "sv4-elite-trainer-box2",
    "Scarlet & Violet Paradox Rift - Elite Trainer Box 2",
    "sv4",
    "elite-trainer-box",
    "./ASSETS/images/shop-Items/sv4/elite_trainer_box_2.png",
    300
  ),
  new ShopProduct(
    "sv5-pack1",
    "Scarlet & Violet Temporal Forces - Booster Pack 1",
    "sv5",
    "pack",
    "./ASSETS/images/shop-Items/sv5/pack_1.png",
    100
  ),
  new ShopProduct(
    "sv5-pack2",
    "Scarlet & Violet Temporal Forces - Booster Pack 2",
    "sv5",
    "pack",
    "./ASSETS/images/shop-Items/sv5/pack_2.png",
    100
  ),
  new ShopProduct(
    "sv5-pack3",
    "Scarlet & Violet Temporal Forces - Booster Pack 3",
    "sv5",
    "pack",
    "./ASSETS/images/shop-Items/sv5/pack_3.png",
    100
  ),
  new ShopProduct(
    "sv5-pack4",
    "Scarlet & Violet Temporal Forces - Booster Pack 4",
    "sv5",
    "pack",
    "./ASSETS/images/shop-Items/sv5/pack_4.png",
    100
  ),
  new ShopProduct(
    "sv5-elite-trainer-box1",
    "Scarlet & Violet Temporal Forces - Elite Trainer Box 1",
    "sv5",
    "elite-trainer-box",
    "./ASSETS/images/shop-Items/sv5/elite_trainer_box_1.png",
    300
  ),
  new ShopProduct(
    "sv5-elite-trainer-box2",
    "Scarlet & Violet Temporal Forces - Elite Trainer Box 2",
    "sv5",
    "elite-trainer-box",
    "./ASSETS/images/shop-Items/sv5/elite_trainer_box_2.png",
    300
  ),
];
export function getProductsSets() {
  const setsInProducts = [];
  for (const product of allProducts) {
    const set = product.set;
    if (!setsInProducts.includes(set)) {
      setsInProducts.push(set);
    }
  }

  return setsInProducts;
}
