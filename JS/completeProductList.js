import ShopProduct from "./CLASS/shopProducts.js";
import { dataBase } from "./mainPageController.js";
export let allProducts = [];
export const productTypes = [
  {
    id: "pack",
    name: "Booster Pack",
    price: 100,
    packsAmount: 1
  },
  {
    id: "bundle",
    name: "Booster Bundle",
    price: 500,
    packsAmount: 6
  },
  {
    id: "elite_trainer_box",
    name: "Elite Trainer Box",
    price: 1000,
    packsAmount: 13
  },
  {
    id: "special_collection_box",
    name: "Special Collection Box",
    price: 2000,
    packsAmount: 30
  },
  {
    id: "mega_box",
    name: "Mega Box",
    price: 5000,
    packsAmount: 100
  },
];
const shopProductsImagesBasePath = "ASSETS/images/shop-items";
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
export function getRandomSetOfProducts(){
  const randomNumber = Math.floor(Math.random() * getProductsSets().length);
  return getProductsSets()[randomNumber];
}
export function addAllProducts() {
  allProducts = [];
  addProductsBySet("png", "sv7", 4, 0, 1, 0, 0);
  addProductsBySet("png", "sv6", 4, 0, 1, 0, 0);
  addProductsBySet("png", "sv5", 4, 0, 2, 0, 0);
  addProductsBySet("png", "sv4", 4, 0, 2, 0, 0);
  addProductsBySet("png", "sv3pt5", 1, 1, 1, 1, 0);
  addProductsBySet("png", "swsh8", 4, 1, 0, 0, 0);
  addProductsBySet("png", "swsh7", 4, 1, 0, 0, 0);
  addProductsBySet("png", "swsh5", 4, 0, 2, 0, 0);
  addProductsBySet("png", "sm11", 4, 0, 0, 0, 0);
  addProductsBySet("jpg", "xy7", 4, 0, 0, 0, 1);
}
function addProductsBySet(
  fileType,
  setId,
  packAmount,
  bundleAmount,
  eliteTrainerBoxAmount,
  specialCollectionBoxAmount,
  megaBoxAmount
) {
  for (let i = 0; i < packAmount; i++) {
    allProducts.push(
      createProductByType(setId, productTypes[0].id, i + 1, fileType)
    );
  }
  for (let i = 0; i < bundleAmount; i++) {
    allProducts.push(
      createProductByType(setId, productTypes[1].id, i + 1, fileType)
    );
  }
  for (let i = 0; i < eliteTrainerBoxAmount; i++) {
    allProducts.push(
      createProductByType(setId, productTypes[2].id, i + 1, fileType)
    );
  }
  for (let i = 0; i < specialCollectionBoxAmount; i++) {
    allProducts.push(
      createProductByType(setId, productTypes[3].id, i + 1, fileType)
    );
  }
  for (let i = 0; i < megaBoxAmount; i++) {
    allProducts.push(
      createProductByType(setId, productTypes[4].id, i + 1, fileType)
    );
  }
}
function createProductByType(set, productType, number, filetype) {
  const productId = `${set}-${productType + number}`;
  const productTypeInfo =  productTypes.find(
    (product) => product.id == productType
  );
  const setName =productTypeInfo.name;
  const setData = dataBase.getSetById(set);
  const productName = setData.name + " - " + setName + " " + number;
  const imageUrl = `${shopProductsImagesBasePath}/${set}/${productType}_${number}.${filetype}`;
  const price = productTypeInfo.price;
  const packsAmount = productTypeInfo.packsAmount;
  return new ShopProduct(
    productId,
    productName,
    set,
    productType,
    imageUrl,
    price,
    packsAmount  );
}
export function getProductsByFilter(productFilter, setFilter, page, pageSize) {
  const productsMeetFilter = [];
  const resultObject = {
    results: [],
    page: page,
    pageSize: pageSize,
    totalPages: 0,
  };
  for (const product of allProducts) {
    if (isProductMeetFilters(product, productFilter, setFilter)) {
      productsMeetFilter.push(product);
    }
  }

  const totalPages = Math.ceil(productsMeetFilter.length / pageSize);
  if (page > totalPages || page < 0) {
    return resultObject;
  }
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedElements = productsMeetFilter.slice(start, end);

  resultObject.results = paginatedElements;
  resultObject.totalPages = totalPages;
  return resultObject;
}
function isProductMeetFilters(productInfo, productFilter, setFilter) {
  const productFilterResult =
    productFilter == "" || productFilter.includes(productInfo.productType);
  const setFilterResult =
    setFilter == "" || setFilter.includes(productInfo.set);
  return productFilterResult && setFilterResult;
}
export function getProductById(id) {
  const obtainedProduct = allProducts.find((product) => product.id == id);
  return obtainedProduct;
}
