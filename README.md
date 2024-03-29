
![logo](/documentation/logo.png)

# Star Wars: RPG Fighter!

[Deployed App](https://ryverine.github.io/StarWarsRPGFighter/)

Interactive Star Wars themed game using jQuery.

The goal of this project is to dynamically update HTML pages with the jQuery library.

The mechanics of this game include a combination of RPG and Fighting game elements. Characters progress and grow stronger as they defeat enemies like an RPG, but you will select your charater and your opponets as you would in a Fighting game.

For the combat calulations I have used D&D 5e as a basic guideline.

## Technologies

 * HTML
 * CSS, CSS Reset, Bootstrap
 * JavaScript, jQuery

## Game Mechanics 

1. Player selects a `Hero` character by clicking a hero icon, and then selects a `Villian` character to battle.

![Select Hero and Villain](/documentation/villain_select.gif)

2. The player and villian have two actions, `Attack` and `Defend`.

  * __Attack:__ Character attempts to deal damage to their opponent's health (HP).

![Player Attack](/documentation/player_attack.gif)

  * __Defend:__ The character anticipates an attack from their opponent and attempts to evade the attack, with a chance of making a counter-attack.

  ![Player Defend](/documentation/player_defend.gif)

3. The goal is for the `Hero` character to defeat each `Villian` character, but the `Hero` may lose the fight. A character will be defeated once their HP reaches zero.

4. If the `Hero` wins their HP is reset and they get an increase to key stats. the player will then select the next villian to fight.

5. If a `Villian` wins it is game over for the player.

## Character Play Styles

Each character has their own subtle differences. Not only are HP, Strength, and Dexterity tailored to each character, but there is also Armor along with specific probably rates for combo and counter attack chance.

## Hero Character Stats

A brief explanation of key character stats.

### HP

Integer value that represents "Hit Points" which indicates whether a character has been defeated or not. When a character’s `HP` reaches zero they have been defeated.

### Strength

Integer value used in determining `attack power` for certain characters. It differs from the `Attack` stat in that `strength` increases upon `level up`.

### Dexterity

Integer value used in determining `attack power` for certain characters and, unlike `Strength`, it is used to  determine `Defense Rating` for all characters. It differs from the `defend` stat in that `dexterity` increases upon level up.

### Attack

Integer value that acts as a damage rating for the character’s particular weapon. `Attack` is used to determine `attack power` for some characters. This value does not change on `level up`.

### Defend

Integer value that acts as a rating to represent the character’s innate defensive abilities. `Defend` is used to determine `defense rating` for all characters. This value does not change on `level up`.

### Armor Class

Integer value which represents that some characters are wearing heavier armor than others. A character’s attack damage is only applied to the opponent's `HP` if it meets or exceeds the value of the opponent’s `armor class`.

### Counter Attack

Integer value used to determine damage done to opponent when character is successful at preemptively defending against attack. 

### XP Modifier

Integer value used upon `level up` to increase player stats. This represents the particular character’s potential to grow as a combatant.


## Hero Charater Mechanics

### Attack Roll

Integer value that represents the quality of the character’s attack. This vaue is compared to the `armor class` of the opponent, so that there is no guarantee that an attack made by a character will be successful against their opponent.

### Combo Hits

Integer value that represents the number of attacks to execute as the character’s single attack action. For most characters this value is hard-coded as one, but some characters get to make a dice roll to see how many attacks their combo will include.

### Attack Power

Integer that represents the damage that a character’s attack will do to their opponent. Some characters use `strength` to determine this value, others use `dexterity`.

### Defense Rating

Integer that represents the damage absorption. This is used when a character defends and their opponent attacks. The opponent’s attack will be reduced by a percentage that is determined by the `defense rating`.

### Counter Attack Power

Integer value that represents the damage that a character’s attack will do to their opponent. Uses `dexterity` and `counter attack` to determine this value.

### Combo Attack Roll

Boolean value to indicate that character is allowed to make a `combo attack` on their opponent. Each character has a different probability to execute a `counter attack`, thematically based on the type of character and weapon they use.

### Counter Attack Roll

Boolean value to indicate that character is allowed to make counter attack on opponent. Each character has a different probability to execute a counter attack, thematically based on the type of character and weapon they use.

### Level Up

When player character defeats an opponent the player gets stronger. This is represented by increasing player `HP`, `strength`, and `dexterity` by the value of a dice roll and the player character’s `xpModifier` value.

## Acknowledgments

I used art work from various sources for the player select icons and the larger battle stage VS icons. I do not know the individuals that created these works of art. If you know who the artists are please let me know so that I may give them credit for their wonderful work.

The back ground image is from the [Tim and Greg Hildebrandt](http://www.brothershildebrandt.com/) poster for "A New Hope".





