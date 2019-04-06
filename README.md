# unit-4-game

Star Wars themed game using jQuery.

The mechanics of this game include a combination of RPG and Fighting game elements.

For the combat calulations I have used D&D 5e as a guideline.


## Sources

[Wookieepedia, the Star Wars Wiki](https://starwars.fandom.com/wiki/)


## Game Mechanics 


### Basic Play

1. Player selects a hero character by clicking a hero icon.
2. The player selects a villian character by clicking a villian icon.
3. The player and villian have two actions, Attack and Defend.

  * Attack: Character attempts to deal damage to their opponent's health (HP). 

  * Defend: The character anticipates an attack from their opponent and attempts to evade the attack.

4. The goal is for the hero character to defeat each villian character, but the hero may lose the figt. A character will be defeated once their HP reaches zero.

5. If hero wins their HP is reset and they get an increase to some stats. Player will select the next villian to fight.

6. If villian wins it is game over.



### Character Play Styles

There are three different types of character:

 * Force Users: Luke, Obi-Wan, Yoda, Darth Vader, and Palpatine.

 * Gun Fighters: Han, Leia, Lando, Stormtrooper, Sandtrooper, Greedo, Bossk, IG-88, and Boba Fett.

 * Brutes: Chewbacca, Tusken Raider, Imperal Guard, and Gamorrean.



#### Attack Types

Attack actions will reduce an opponent's HP value.

Force Users attack with Lightsaber, except for Palpatine who uses Force Lightning. These attacks can deal lots of damage, but these characters are unarmored (except for Darth Vader).

Gun Fighters attack with blasters. These characters have a better chance of getting a critical hit, which will do more damage than a standard attack. Some characters can get multiple shots, but this is very rare.

Brutes use hand-to-hand attacks, or conventional weapons (i.e. staff, axe, pike). These attacks do moderate damage and have the chance to combo (multiple hits from single attack).



#### Defense Types

Defend actions allow a character to avoid an attack from their opponent. If a player uses defend when their opponent uses attack, the player character will have the chance to counter attack their opponent.

Force Users block incoming attack with lightsaber (force lighting for Palpatine). The block serverly reduces damage, and has potential to deal a counter-strike attack.

Gun Fighters can evade incoming attacks. This means they will take less damage from the attack and have the chance of dodging all damage. 

Brute characters block attacks. Their block does not provide a massive reduction in damage, but their counter attacks are much heavier.



#### Armor

Some characters have armor, and some do not. Characters with armor recieve some degree of damage reduction when attacked.

Characters with armor:

 * Stormtrooper
 * Sandtrooper
 * Bossk
 * IG-88
 * Boba Fett
 * Gamorrean 
 * Darth Vader


## Global Variables

### gameOverFlag

### player

Player Character

	player =  {
	id: 108,
	imgUrl: "../images/",
	actionState: "neutral",
	characterClass: "Ewok Warrior",
	name: "Wicket", // Full name is Wicket W. Warrick
	hp: 80,
	strength: 5,
	dexterity: 2,
	attack: 2,
	defend: 5,
	armorClass: 10,
	counterAttack: 2,
	xpModifier: 3,

	getAttackRoll: function() {}
	getComboHits: function() {}
	getAttackPower: function() {}
    	getDefenseRating: function() {}
	getCounterAttackPower: function() {}
	comboAttackRoll: function() {}
	counterAttackRoll: function() {},
	levelUp: function() {}
	}

### opponent

Opponent Character

	opponent =  {
	id: 200,
	imgUrl: "../images/",
	actionState: "neutral",
	characterClass: "Sith Lord",
	name: "Emperor Palpatine",
	hp: 1000,
	strength: 5,
	dexterity: 10,
	attack: 15,
	defend: 5,
	armorClass: 10,
	counterAttack: 8,

	getAttackRoll: function() {}
	getComboHits: function(){}
	getDefenseRating: function() {}
	getCounterAttackPower: function() {}
	comboAttackRoll: function() {}
	counterAttackRoll: function() {}
	setActionState:  function() {}
	}

### playerBaseHealth
### heroSelectionArea
### villainSelectionArea
### battleGround
### fightDataArea
### fightEvents
### battleOrder
### battleComplete
### battleCompleteMessage
### fightNumber
### villainTotal
### actionCount
### actionDetails

## Event Listeners

### $(".heroCharacter") : mouseover
### $(".heroCharacter") : mouseout
### $(".villainCharacter") : mouseover
### $(".villainCharacter") : mouseout
### $(".heroCharacter") : click
### $(".villainCharacter") : click
### $("#btn-attack") : click
### $("#btn-defend") : click
### $("#btn-continue") : click
### $("#btn-newgame") : click
### $("#btn-quit") : click

## Functions

### doAttackAction(theAttacker, theAttacked)
### rollDice(dieType, numDie)
### rollForInitiative(rollerOne, rollerTwo)
### refreshBattleGround()
### startNextRound()
### gameOver(playerWins)
### logGameStats()
### setPlayerCharacter(theCharacter)
### setOpponentCharacter(theCharacter)
### EmptyCharacter(){}

## Things to Do

1. Get images for each character. Need thumbnail images (200x200 px) and larger images for the battle ground area.

2. Get logos, icons, and image for background. For the background, it would be cool to change it to diffrent scenes for each villian. For example, if you fight the Sandtrooper the background should be a desert. If you fight the Gamorrean the background should be Jabba's palace.

3. Get sounds for each character's attack and defend actions.

4. Use Star Wars theme when player wins. Use imperial march when player loses. If chewbacca beats palpatine play Chewbacca by Supernova.

5. Add game mode selector that allows player to choose *arcade mode* or *story mode*.

 * Arcade Mode: The standard moode of play, as described under Basic Play.

 * Story Mode: The player picks a hero character. The hero must then face villian characters in a set order. Some villians can be re-used (stormtrooper, tuskan raider, Gamorrean, etc...)


 *************************************************************************************************














