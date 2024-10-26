import { apiKey } from "./apikey.js";
const OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
  },
};
const BASE_URL = "https://api.pokemontcg.io/";

async function fetchData(pathName, params = {}) {
  const apiKeyParam = {
    "X-Api-Key": apiKey,
  };
  Object.assign(params, apiKeyParam);
  try {
    const url = new URL(BASE_URL);
    url.pathname = pathName;
    for (const key of Object.keys(params)) {
      url.searchParams.append(key, params[key]);
    }
    const response = await fetch(url.toString(), OPTIONS);

    const data = await response.json();
    // console.log(url.toString(), data);
    return data;
  } catch (error) {
    console.error(error);
  }
}
/* Hacer una llamada para buscar cartas que coincidan con los parametros: 
(q) parametros de busqueda 
(page) la pagina que queremos que nos devuelva 
(pageSize) el numero de resultados que queremos que nos devuelva, maximo 250 resultados
(orderBy) establecer el parametro en el que se basara para ordenar los resultados
(select) podemos decir que nos devuelva solo los campos de cada carta que queramos, por ejemplo solo su id, nombre y tipo, tendriamos que poner 'select=id,name,types,'*/
export async function searchCards(q, page, pageSize, orderBy, select) {
  const params = {
    q: q,
    page: page,
    pageSize: pageSize,
    orderBy: orderBy,
    select: select,
  };
  const data = await fetchData("v2/cards", params);
  return data;
}
export async function getTypes() {
  const data = await fetchData("v2/types");
  return data;
}
export async function getSubTypes() {
  const data = await fetchData("v2/subtypes");
  return data;
}
export async function getSuperTypes() {
  const data = await fetchData("v2/supertypes");
  return data;
}
export async function getRarities() {
  const data = await fetchData("v2/rarities");
  return data;
}
export async function getSetById(id) {
  const params = {
    q: "id:" + id,
    page: 1,
    pageSize: 20,
    orderBy: "releaseDate",
    select: "id,name,total,images",
  };
  const data = await fetchData("v2/sets", params);
  return data;
}
export async function getAllSets(q, page, pageSize, orderBy, select) {
    const params = {
        page: page,
        pageSize: pageSize,
        orderBy: orderBy,
    }
  const data = await fetchData("v2/sets", params);
  return data;
}
export async function getCardsBySet(setId){
    const data = await searchCards('set.id:'+setId, 1, 250, 'number','');
    return data;
}
