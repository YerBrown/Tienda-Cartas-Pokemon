class CardList {
  constructor(cardsArray) {
    this.allCards = cardsArray;
    console.log(this.allCards);
  }
  getCardById(id) {
    const findedCard = this.allCards.find((card) => card.id == id);
    return findedCard;
  }
}
export default CardList;
