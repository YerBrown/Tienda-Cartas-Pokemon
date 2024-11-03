import { createHTMLElement, createImgElement } from "../codigo.js";
import { userDataBase, dataBase } from "../mainPageController.js";
import {
  getProductsSets,
  getRandomSetOfProducts,
} from "../completeProductList.js";
class Combat {
  constructor(combatMenu) {
    this.combatMenu = combatMenu;
    this.playerTeam = [];
    this.opponentTeam = [];
    this.combatwindow = this.createCombatWindow();
    this.playerFightWon = [];
  }
  async loadOpponentTeam() {
    this.combatMenu.addLoadingModal();
    const opponentSet = getRandomSetOfProducts();
    await dataBase.getCardsOfSetById(opponentSet);
    this.opponentTeam = [];
    for (let i = 0; i < 6; i++) {
      const opponentCard = dataBase.getRandomPokemonCardOfSet(opponentSet);
      this.opponentTeam.push(opponentCard);
    }
    this.combatMenu.removeLoadingModal();
  }
  createCombatWindow() {
    const combatWindow = createHTMLElement("div", "combat-window");
    this.playerCards = createHTMLElement("div", "player-team");
    this.createTeamCards(this.playerTeam, this.playerCards);
    this.opponentCards = createHTMLElement("div", "opponent-team");
    this.createTeamCards(this.opponentTeam, this.opponentCards);

    this.combatField = createHTMLElement("div", "combat-field");
    combatWindow.append(this.playerCards, this.combatField, this.opponentCards);
    return combatWindow;
  }
  async sendPlayerteam(playerTeam = null) {
      await this.loadOpponentTeam();
    if (playerTeam != null) {
        this.playerTeam = playerTeam;
    }else{
        this.playerTeam = await this.loadOpponentTeam();
    }
    this.loadCombatWindow(this.playerTeam, this.opponentTeam);
  }
  async loadCombatWindow(playerTeam, opponentTeam) {
    this.playerFightWon = [];
    this.playerTeam = playerTeam;
    this.opponentTeam = opponentTeam;
    this.updateTeamCards();
    this.startCombat();
  }
  createTeamCards(team, container) {
    container.innerHTML = "";
    for (let i = 0; i < 6; i++) {
      const newCard = createImgElement(
        "ASSETS/images/pokemon-card-back.webp",
        "empty slot",
        "",
        ["team-card", "selectable"]
      );
      if (team[i] != null) {
        newCard.src = team[i].images.large;
        newCard.alt = "card of " + team[i].name;
      }
      container.appendChild(newCard);
    }
  }
  updateTeamCards() {
    this.createTeamCards(this.playerTeam, this.playerCards);
    this.createTeamCards(this.opponentTeam, this.opponentCards);
  }
  async startCombat() {
    await this.setPokemonsInField(this.playerTeam[0], this.opponentTeam[0]);
    await this.setPokemonsInField(this.playerTeam[1], this.opponentTeam[1]);
    await this.setPokemonsInField(this.playerTeam[2], this.opponentTeam[2]);
    await this.setPokemonsInField(this.playerTeam[3], this.opponentTeam[3]);
    await this.setPokemonsInField(this.playerTeam[4], this.opponentTeam[4]);
    await this.setPokemonsInField(this.playerTeam[5], this.opponentTeam[5]);
  }
  async setPokemonsInField(playerCard, opponentCard) {
    const playerFighter = this.createFighterElement(playerCard);
    playerFighter.id = "player-fighter";

    const opponentFighter = this.createFighterElement(opponentCard);
    opponentFighter.id = "opponent-fighter";

    this.combatField.innerHTML = "";
    const vsText = createHTMLElement("p", "vs-text");
    vsText.innerText = "VS";
    this.combatField.append(opponentFighter, vsText, playerFighter);
    await this.calculateWinner(
      playerCard,
      playerFighter,
      opponentCard,
      opponentFighter
    );
  }
  createFighterElement(card) {
    const fighter = createHTMLElement("div", "", ["fighter"]);
    const fighterImg = createImgElement(
      card.images.large,
      "pokemon card of " + card.name
    );
    const fighterHp = createHTMLElement("div", "", ["fighter-hp-panel"]);
    const hptext = createHTMLElement("p", "", ["hp-text"]);
    hptext.innerText = card.hp + " HP";
    fighterHp.append(hptext);

    const energiesContainer = createHTMLElement("div", "", [
      "energies-container",
    ]);

    fighter.append(fighterImg, fighterHp, energiesContainer);
    return fighter;
  }
  async calculateWinner(
    playerCard,
    playerFighterElement,
    opponentCard,
    opponentFighterElement
  ) {
    // Combertir cartas a clase pokemon para la pelea
    const playerPokemon = new Pokemon(
      playerFighterElement,
      playerCard.id,
      playerCard.name,
      playerCard.types[0],
      playerCard.hp,
      playerCard.attacks,
      playerCard.weaknesses ?? null,
      playerCard.resistances ?? null
    );
    const opponentPokemon = new Pokemon(
      opponentFighterElement,
      opponentCard.id,
      opponentCard.name,
      opponentCard.types[0],
      opponentCard.hp,
      opponentCard.attacks,
      opponentCard.weaknesses ?? null,
      opponentCard.resistances ?? null
    );

    let turnOwner = Math.round(Math.random());
    console.log("Empieza el " + (turnOwner == 0 ? "Player" : "Opponent"));
    await this.esperar(2);
    while (playerPokemon.hp > 0 && opponentPokemon.hp > 0) {
      // Turno del pokemon del jugador
      if (turnOwner == 0) {
        // Agregar energia
        playerPokemon.addEnergy();
        await this.esperar(1);
        const nextAttack = playerPokemon.selectAttack();
        if (nextAttack) {
          console.log(
            `Tu ${playerPokemon.name} ataca a el ${opponentPokemon.name} del rival con ${nextAttack.name}!`
          );
          playerPokemon.attack();
          opponentPokemon.receiveDamage(nextAttack, playerPokemon.element);
        }
        await this.esperar(0.5);
        playerPokemon.resetAnim();
        opponentPokemon.resetAnim();
        await this.esperar(1);
        opponentPokemon.resetdamageText();
        playerPokemon.resetdamageText();
        turnOwner = 1;
      } else {
        // Turno del oponente
        // Agregar energia
        opponentPokemon.addEnergy();
        await this.esperar(1);
        const nextAttack = opponentPokemon.selectAttack();
        if (nextAttack) {
          console.log(
            `El ${opponentPokemon.name} del rival ataca a tu ${playerPokemon.name} con ${nextAttack.name}!`
          );
          opponentPokemon.attack();
          playerPokemon.receiveDamage(nextAttack, opponentPokemon.element);
        }
        await this.esperar(0.5);
        opponentPokemon.resetAnim();
        playerPokemon.resetAnim();
        await this.esperar(1);
        opponentPokemon.resetdamageText();
        playerPokemon.resetdamageText();

        turnOwner = 0;
      }
    }

    this.playerFightWon.push(playerPokemon.hp > 0);
    // Comprobar quien a perdido
    if (playerPokemon.hp > 0) {
      console.log("Player pokemon " + playerPokemon.name + " won the fight!");
      playerPokemon.fighterNode.children[0].classList.add("fight-won");
      opponentPokemon.fighterNode.children[0].classList.add("fight-lost");
    } else {
      console.log(
        "Opponent pokemon " + opponentPokemon.name + " won the fight!"
      );
      opponentPokemon.fighterNode.children[0].classList.add("fight-won");
      playerPokemon.fighterNode.children[0].classList.add("fight-lost");
    }
    this.updateFightsResults();
    await this.esperar(2);
  }
  updateFightsResults() {
    for (let i = 0; i < this.playerFightWon.length; i++) {
      const playerCard = this.playerCards.children[i];
      const opponentCard = this.opponentCards.children[i];
      if (this.playerFightWon[i] == true) {
        // Ha ganado este combate
        playerCard.classList.add("fight-won");
        opponentCard.classList.add("fight-lost");
      } else {
        playerCard.classList.add("fight-lost");
        opponentCard.classList.add("fight-won");
      }
    }
  }
  async esperar(segundos) {
    return new Promise((resolve) => setTimeout(resolve, segundos * 1000));
  }
}
class Pokemon {
  constructor(
    fighterNode,
    id,
    name,
    element,
    hp,
    attacks,
    weaknesses,
    resistances
  ) {
    this.fighterNode = fighterNode;
    this.id = id;
    this.name = name;
    this.element = element;
    this.hp = hp;
    this.attacks = attacks;
    this.weakness = null;
    if (weaknesses) {
      this.weakness = weaknesses[0];
    }
    this.resistance = null;
    if (resistances) {
      this.resistance = resistances[0];
    }
    this.energies = 0;
  }
  addEnergy() {
    this.energies++;

    const energyContainer = this.fighterNode.querySelector(
      ".energies-container"
    );
    const newEnergyIcon = createImgElement(
      dataBase.getTypeById(this.element).image,
      this.element + " energy",
      "",
      ["energy-icon"]
    );
    if (energyContainer) {
      energyContainer.appendChild(newEnergyIcon);
    }
  }
  selectAttack() {
    let posibleAttack = null;
    for (const attack of this.attacks) {
      if (attack.convertedEnergyCost <= this.energies) {
        posibleAttack = attack;
      }
    }
    return posibleAttack;
  }
  attack() {
    this.fighterNode.classList.add("attack");
  }
  resetAnim() {
    this.fighterNode.classList.remove("attack");
    this.fighterNode.classList.remove("hit");
  }
  resetdamageText() {
    if (this.damageText) {
      this.damageText.classList.remove("show-damage");
    }
  }
  receiveDamage(attack, attackElement) {
    let damageStr = attack.damage.replace(/\D/g, "");
    console.log(attack.damage);
    let calculatedDamage = Number(damageStr);
    // Calcular devilidades y resistencias
    if (this.weakness && attackElement == this.weakness.type) {
      calculatedDamage *= 2;
    } else if (this.resistance && attackElement == this.resistance.type) {
      calculatedDamage -= 30;
    }
    if (calculatedDamage > 0) {
      this.fighterNode.classList.add("hit");
      if (!this.damageText) {
        this.damageText = createHTMLElement("p", "", ["damage-text"]);
        this.fighterNode.appendChild(this.damageText);
      }
      this.damageText.innerText = "-" + calculatedDamage;
      this.damageText.classList.add("show-damage");
    }
    this.hp -= calculatedDamage;
    if (this.hp < 0) {
      this.hp = 0;
    }
    const hpText = this.fighterNode.querySelector(".hp-text");
    hpText.innerText = this.hp + " HP";
    console.log(
      `${this.name} recivio ${calculatedDamage} puntos de daño de tipo ${attackElement} y se quedo con ${this.hp} hp`
    );
  }
}
export default Combat;
