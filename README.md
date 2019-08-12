# unit-4-game

Interactive Star Wars themed game using jQuery.

The goal of this project is to dynamically update HTML pages with the jQuery library.

The mechanics of this game include a combination of RPG and Fighting game elements. Characters progress and grow stronger as they defeat enemies like an RPG, but you will select your charater and your opponets as you would in a Fighting game.

For the combat calulations I have used D&D 5e as a basic guideline.

## Technologies

 * HTML
 * CSS
 * JavaScript
 * jQuery

## Sources

[Wookieepedia, the Star Wars Wiki](https://starwars.fandom.com/wiki/)

## Game Mechanics 

### Basic Play

1. Player selects a hero character by clicking a hero icon.

![Select Hero](/documentation/hero_select.gif)

2. The player selects a villian character by clicking a villian icon.

![Select Villain](/documentation/villain_select.gif)

3. The player and villian have two actions, Attack and Defend.

  * Attack: Character attempts to deal damage to their opponent's health (HP).

![Player Attack](/documentation/player_attack.gif)

  * Defend: The character anticipates an attack from their opponent and attempts to evade the attack, with a chance of making a counter-attack.
  
  ![Player Defend](/documentation/player_defend.gif)

4. The goal is for the hero character to defeat each villian character, but the hero may lose the fight. A character will be defeated once their HP reaches zero.

5. If hero wins their HP is reset and they get an increase to key stats. Player will then select the next villian to fight.

6. If villian wins it is game over.

### Character Play Styles

Each character has their own suttle differences. Not only are HP, Strength, and Dexterity tailored to each character, but there is also Armor along with specific probably rates for combo and counter attack chance.

### Character Object

{

	id: INT,

	imgUrl: STRING,

	actionState: STRING,

	characterClass: STRING,

	name: STRING,

	hp: INT,

	strength: INT,

	dexterity: INT,

	attack: INT,

	defend: INT,

	armorClass: INT,

	counterAttack: INT,

	xpModifier: INT,

	getAttackRoll: METHOD,

	getComboHits: METHOD,

	getAttackPower: METHOD,

    getDefenseRating: METHOD,

	getCounterAttackPower: METHOD,

	comboAttackRoll: METHOD,

	counterAttackRoll: METHOD,

	levelUp: METHOD

}















