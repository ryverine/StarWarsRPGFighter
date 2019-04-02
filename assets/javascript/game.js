/*

Star Wars (1977)
http://readcomiconline.to/Comic/Star-Wars-1977

Font:
https://www.dafont.com/star-jedi.font

// sounds for each character's attack and defend.


https://www.w3schools.com/js/js_math.asp

*/

/*
CRITICAL HITS
http://dnd.wizards.com/dungeons-and-dragons/start-playing
https://www.polygon.com/2018/5/26/17153274/dnd-how-to-play-dungeons-dragons-5e-guide-spells-dice-character-sheets-dm

http://archive.wizards.com/default.asp?x=dnd/glossary&term=Glossary_dnd_criticalhit&alpha=C

var randomNum = Math.floor(Math.random() * Math.floor(wordsToUse.length));

*/

// Don't do anything until the page loads.
$(document).ready(function() 
{
	var player = {
		name: "",
		hp: 0,
		strength: 0,
		dexterity: 0,
		attack: 0,
		defend: 0,
		armor: 0,
		counterAttack: 0,
		xpModifier: 0,
		getAttackPower: function() {},
		getDefenseRating: function() {},
		getCounterAttackPower: function(){},
		levelUp: function(){}
	};

	var playerBaseHealth = 0;

	var gameEventsOutput = $("#gameEvents");

	var opponents = setOpponents();

	var fightNumber = 0;

	var opponent  = opponents[fightNumber];
	
	//hero button clicked
	$(".heroCharacter").on("click", function() {

		if(player.name.length > 0)
		{
			console.log("Player character already selected!")
		}
		else
		{
			setPlayerCharacter($(this).val());
			playerBaseHealth = player.hp;
			logGameStats();
			setBattleGround();
		}
		
	});

	//attack button onclick
	$("#btn-attack").on("click", function() {

		console.log("ATTACK button clicked!");

		if(player.name.length > 0)
		{
			var playerAttack = Math.abs(player.getAttackPower() - opponent.getDefenseRating());

			alert("playerAttack = " + playerAttack);

			opponent.hp = Math.floor(opponent.hp - playerAttack);

			alert("opponent.hp = " + opponent.hp);
 
			gameEventsOutput.append("<br>" + player.name + " hits " + opponent.name + " for " + playerAttack + " points.")

			var opponentCounter = Math.abs(opponent.getCounterAttackPower() - player.getDefenseRating());

			alert("opponentCounter = " + opponentCounter);

			player.hp = Math.floor(player.hp - opponentCounter);

			alert("player.hp = " + player.hp);

			gameEventsOutput.append("<br>" + opponent.name + " counter attacks " + player.name + " for " + opponentCounter + " points.")

			if(opponent.hp <= 0)
			{
				console.log(player.name + " defeated " + opponent.name + "!");
				alert(player.name + " defeated " + opponent.name + "!");

				if(fightNumber == (opponents.length - 1))
				{
					console.log("Player defeated last opponent!");
					alert(player.name + " has saved the galaxy!");
					setTimeout(setBattleGround,1000);
				}
				else
				{
					player.hp = playerBaseHealth;
					player.levelUp();
					playerBaseHealth = player.hp;

					fightNumber++;
					opponent = opponents[fightNumber];
					setTimeout(setBattleGround,1000);
				}
			}
			else
			{
				setBattleGround();
			}
		}
		else
		{
			console.log("No player character selected!");
		}
	});

	//defend button onclick
	$("#btn-defend").on("click", function() {
		console.log("DEFEND button clicked!");

		if(player.name.length > 0)
		{

		}
		else
		{
			console.log("No player character selected!");
		}
	});

	function rollDice(dieType, numDie)
	{
		var roll = Math.floor((Math.random() * Math.floor(dieType)) + 1) * numDie;
		return roll;
	}

	function setBattleGround()
	{
		$("#heroHeader").text(player.name);
		$("#heroStats").text("HP: " + player.hp);
		$("#heroStats").append("<br>" + "Attack: " + player.attack);
		$("#heroStats").append("<br>" + "Defense: " + player.defend);
		$("#heroStats").append("<br>" + "Armor: " + player.armor);

		$("#villianHeader").text(opponent.name);
		$("#villianStats").text("HP: " + opponent.hp);
		$("#villianStats").append("<br>" + "Attack: " + opponent.attack);
		$("#villianStats").append("<br>" + "Defense: " + opponent.defend);
		$("#villianStats").append("<br>" + "Armor: " + opponent.armor);
	}

	function logGameStats()
	{
		console.log("***** CURRENT GAME STATS *****");
		console.log("Player Character:");
		console.log("** Name: " + player.name);
		console.log("** HP: " + player.hp);
		console.log("** Strength: " + player.strength);
		console.log("** Dexterity: " + player.dexterity);
		console.log("** Attack Multiplier: " + player.attack);
		console.log("** Defense Multiplier: " + player.defend);
		console.log("** Armor: " + player.armor);
		console.log("** Attack Power: " + player.getAttackPower());
		console.log("** Defense Rating: " + player.getDefenseRating());
		console.log("Current Opponent:")
		console.log("** Name: " + opponent.name);
		console.log("** HP: " + opponent.hp);
		console.log("** Strength: " + opponent.strength);
		console.log("** Dexterity: " + opponent.dexterity);
		console.log("** Attack Multiplier: " + opponent.attack);
		console.log("** Defense Multiplier: " + opponent.defend);
		console.log("** Armor: " + opponent.armor);
		console.log("** Attack Power: " + opponent.getAttackPower());
		console.log("** Defense Rating: " + opponent.getDefenseRating());
		console.log("Opponent Fight Order: ");

		for(var i = 0; i < opponents.length; i++)
		{
			console.log("[" + i + "]: " + opponents[i].name);
		}

		console.log("******************************");
	}

	function setPlayerCharacter(theCharacter)
	{
		console.log("getPlayerCharacter("+theCharacter+")");

		if (theCharacter === "Luke")
		{
			player =  {
				id: 101,
				name: "Luke Skywalker",
				hp: 200,
				strength: 10,
				dexterity: 10,
				attack: 2,
				defend: 5,
				armor: 0,
				counterAttack: 2,
				xpModifier: 2,
				getAttackPower: function() {
    				return this.strength * this.attack;
    			},
    			getDefenseRating: function() {
    				return ((this.dexterity * this.defend) + this.armor);
				},
				getCounterAttackPower: function() {
					return this.counterAttack + this.dexterity + rollDice(4,1);
				},
				levelUp: function() {
					this.hp += rollDice(6,1) * this.xpModifier;
					this.strength += rollDice(4,1) + this.xpModifier;
					this.dexterity += rollDice(4,1) + this.xpModifier;
				}
    		};
		}
		else if (theCharacter === "Chewbacca")
		{
			player =  {
				id: 102,
				name: "Chewbacca",
				hp: 200,
				strength: 10,
				dexterity: 10,
				attack: 2,
				defend: 5,
				armor: 0,
				counterAttack: 2,
				xpModifier: 2,
				getAttackPower: function() {
    				return this.strength * this.attack;
    			},
    			getDefenseRating: function() {
    				return ((this.dexterity * this.defend) + this.armor);
				},
				getCounterAttackPower: function() {
					return this.attack + this.dexterity + rollDice(6,1);
				},
				levelUp: function() {
					this.hp += rollDice(6,1) * this.xpModifier;
					this.strength += rollDice(4,1) + this.xpModifier;
					this.dexterity += rollDice(4,1) + this.xpModifier;
				}
    		};
		}
		else if (theCharacter === "Han")
		{
			player =  {
				id: 103,
				name: "Han Solo",
				hp: 200,
				strength: 10,
				dexterity: 10,
				attack: 2,
				defend: 5,
				armor: 0,
				counterAttack: 2,
				xpModifier: 2,
				getAttackPower: function() {
    				return this.strength * this.attack;
    			},
    			getDefenseRating: function() {
    				return ((this.dexterity * this.defend) + this.armor);
				},
				getCounterAttackPower: function() {
					return this.attack + this.dexterity + rollDice(6,1);
				},
				levelUp: function() {
					this.hp += rollDice(6,1) * this.xpModifier;
					this.strength += rollDice(4,1) + this.xpModifier;
					this.dexterity += rollDice(4,1) + this.xpModifier;
				}
    		};
		}
		else if (theCharacter === "Obi-Wan")
		{
			player =  {
				id: 104,
				name: "Obi-Wan Kenobi",
				hp: 200,
				strength: 10,
				dexterity: 10,
				attack: 2,
				defend: 5,
				armor: 0,
				counterAttack: 2,
				xpModifier: 2,
				getAttackPower: function() {
    				return this.strength * this.attack;
    			},
    			getDefenseRating: function() {
    				return ((this.dexterity * this.defend) + this.armor);
				},
				getCounterAttackPower: function() {
					return this.attack + this.dexterity + rollDice(6,1);
				},
				levelUp: function() {
					this.hp += rollDice(6,1) * this.xpModifier;
					this.strength += rollDice(4,1) + this.xpModifier;
					this.dexterity += rollDice(4,1) + this.xpModifier;
				}
    		};
		}
		else if (theCharacter === "Leia")
		{
			player =  {
				id: 105,
				name: "Leia Organa",
				hp: 200,
				strength: 10,
				dexterity: 10,
				attack: 2,
				defend: 5,
				armor: 0,
				counterAttack: 2,
				xpModifier: 2,
				getAttackPower: function() {
    				return this.strength * this.attack;
    			},
    			getDefenseRating: function() {
    				return ((this.dexterity * this.defend) + this.armor);
				},
				getCounterAttackPower: function() {
					return this.attack + this.dexterity + rollDice(6,1);
				},
				levelUp: function() {
					this.hp += rollDice(6,1) * this.xpModifier;
					this.strength += rollDice(4,1) + this.xpModifier;
					this.dexterity += rollDice(4,1) + this.xpModifier;
				}
    		};
		}
		else if (theCharacter === "Lando")
		{
			player =  {
				id: 106,
				name: "Lando Calrissian",
				hp: 200,
				strength: 10,
				dexterity: 10,
				attack: 2,
				defend: 5,
				armor: 0,
				counterAttack: 2,
				xpModifier: 2,
				getAttackPower: function() {
    				return this.strength * this.attack;
    			},
    			getDefenseRating: function() {
    				return ((this.dexterity * this.defend) + this.armor);
				},
				getCounterAttackPower: function() {
					return this.attack + this.dexterity + rollDice(6,1);
				},
				levelUp: function() {
					this.hp += rollDice(6,1) * this.xpModifier;
					this.strength += rollDice(4,1) + this.xpModifier;
					this.dexterity += rollDice(4,1) + this.xpModifier;
				}
    		};
		}
		else if (theCharacter === "Yoda")
		{
			player =  {
				id: 107,
				name: "Yoda",
				hp: 200,
				strength: 10,
				dexterity: 10,
				attack: 2,
				defend: 5,
				armor: 0,
				counterAttack: 2,
				xpModifier: 2,
				getAttackPower: function() {
    				return this.strength * this.attack;
    			},
    			getDefenseRating: function() {
    				return ((this.dexterity * this.defend) + this.armor);
				},
				getCounterAttackPower: function() {
					return this.attack + this.dexterity + rollDice(6,1);
				},
				levelUp: function() {
					this.hp += rollDice(6,1) * this.xpModifier;
					this.strength += rollDice(4,1) + this.xpModifier;
					this.dexterity += rollDice(4,1) + this.xpModifier;
				}
    		};
		}
		else if (theCharacter === "Wicket")
		{ //https://en.wikipedia.org/wiki/Ewok; https://en.wikipedia.org/wiki/Wicket_W._Warrick
			player =  {
				id: 108,
				name: "Wicket W. Warrick",
				hp: 200,
				strength: 10,
				dexterity: 10,
				attack: 2,
				defend: 5,
				armor: 0,
				counterAttack: 2,
				xpModifier: 2,
				getAttackPower: function() {
    				return this.strength * this.attack;
    			},
    			getDefenseRating: function() {
    				return ((this.dexterity * this.defend) + this.armor);
				},
				getCounterAttackPower: function() {
					return this.attack + this.dexterity + rollDice(6,1);
				},
				levelUp: function() {
					this.hp += rollDice(6,1) * this.xpModifier;
					this.strength += rollDice(4,1) + this.xpModifier;
					this.dexterity += rollDice(4,1) + this.xpModifier;
				}
    		};
		}
		else
		{
			console.log("Unexpected character selected!");
		}
	}

	function setOpponents()
	{
		var arrayOfCharacters = [];

		//create characters 

        var greedo = {
        	id: 201,
			name: "Greedo",
			hp: 200,
			strength: 10,
			dexterity: 10,
			attack: 2,
			defend: 5,
			armor: 0,
			counterAttack: 2,
			getAttackPower: function() {
				return this.strength * this.attack;
			},
			getDefenseRating: function() {
				return ((this.dexterity * this.defend) + this.armor);
			},
			getCounterAttackPower: function() {
				return this.counterAttack + this.dexterity + rollDice(6,1);
			}
		};

		var bossk = {
			id: 202,
			name: "Bossk",
			hp: 200,
			strength: 10,
			dexterity: 10,
			attack: 2,
			defend: 5,
			armor: 5,
			counterAttack: 2,
			getAttackPower: function() {
				return this.strength * this.attack;
			},
			getDefenseRating: function() {
				return ((this.dexterity * this.defend) + this.armor);
			},
			getCounterAttackPower: function() {
				return this.counterAttack + this.dexterity + rollDice(6,1);
			}
		};

		var ig88 = {
			id: 203,
			name: "IG-88",
			hp: 200,
			strength: 10,
			dexterity: 10,
			attack: 2,
			defend: 5,
			armor: 8,
			counterAttack: 2,
			getAttackPower: function() {
				return this.strength * this.attack;
			},
			getDefenseRating: function() {
				return ((this.dexterity * this.defend) + this.armor);
			},
			getCounterAttackPower: function() {
				return this.counterAttack + this.dexterity + rollDice(6,1);
			}
		};

		var bobaFett = {
			id: 204,
			name: "Boba Fett",
			hp: 200,
			strength: 10,
			dexterity: 10,
			attack: 2,
			defend: 5,
			armor: 10,
			counterAttack: 2,
			getAttackPower: function() {
				return this.strength * this.attack;
			},
			getDefenseRating: function() {
				return ((this.dexterity * this.defend) + this.armor);
			},
			getCounterAttackPower: function() {
				return this.counterAttack + this.dexterity + rollDice(6,1);
			}
		};

		 var darthVader = {
		 	id: 205,
			name: "Darth Vader",
			hp: 200,
			strength: 10,
			dexterity: 10,
			attack: 2,
			defend: 5,
			armor: 15,
			counterAttack: 2,
			getAttackPower: function() {
				return this.strength * this.attack;
			},
			getDefenseRating: function() {
				return ((this.dexterity * this.defend) + this.armor);
			},
			getCounterAttackPower: function() {
				return this.counterAttack+ this.dexterity + rollDice(6,1);
			}
		};

		var palpatine = {
			id: 206,
			name: "Palpatine",
			hp: 200,
			strength: 10,
			dexterity: 10,
			attack: 2,
			defend: 5,
			armor: 0,
			counterAttack: 2,
			getAttackPower: function() {
				return this.strength * this.attack;
			},
			getDefenseRating: function() {
				return ((this.dexterity * this.defend) + this.armor);
			},
			getCounterAttackPower: function() {
				return this.counterAttack + this.dexterity + rollDice(6,1);
			}
		};

		var tuskenRaider_01 = new TuskenRaider(207, "Tusken Raider", 200, 10, 10, 2, 5);
		var tuskenRaider_02 = new TuskenRaider(208, "Tusken Raider", 200, 10, 10, 2, 5);
		var tuskenRaider_03 = new TuskenRaider(209, "Tusken Raider", 200, 10, 10, 2, 5);
		var tuskenRaider_04 = new TuskenRaider(210, "Tusken Raider", 200, 10, 10, 2, 5);
		var tuskenRaider_05 = new TuskenRaider(211, "Tusken Raider", 200, 10, 10, 2, 5);

		var sandtrooper_01 = new Sandtrooper(212, "Sandtrooper", 200, 10, 10, 2, 5);
		var sandtrooper_02 = new Sandtrooper(213, "Sandtrooper", 200, 10, 10, 2, 5);
		var sandtrooper_03 = new Sandtrooper(214, "Sandtrooper", 200, 10, 10, 2, 5);
		var sandtrooper_04 = new Sandtrooper(215, "Sandtrooper", 200, 10, 10, 2, 5);
		var sandtrooper_05 = new Sandtrooper(216, "Sandtrooper", 200, 10, 10, 2, 5);

		var stormtrooper_01 = new Stormtrooper(217, "Stormtrooper", 200, 10, 10, 2, 5);
		var stormtrooper_02 = new Stormtrooper(218, "Stormtrooper", 200, 10, 10, 2, 5);
		var stormtrooper_03 = new Stormtrooper(219, "Stormtrooper", 200, 10, 10, 2, 5);
		var stormtrooper_04 = new Stormtrooper(220, "Stormtrooper", 200, 10, 10, 2, 5);
		var stormtrooper_05 = new Stormtrooper(221, "Stormtrooper", 200, 10, 10, 2, 5);
		var stormtrooper_06 = new Stormtrooper(222, "Stormtrooper", 200, 10, 10, 2, 5);
		var stormtrooper_07 = new Stormtrooper(223, "Stormtrooper", 200, 10, 10, 2, 5);
		var stormtrooper_08 = new Stormtrooper(224, "Stormtrooper", 200, 10, 10, 2, 5);
		var stormtrooper_09 = new Stormtrooper(225, "Stormtrooper", 200, 10, 10, 2, 5);

		var gamorrean_01 = new GamorreanGuard(226, "Gamorrean Guard", 200, 10, 10, 2, 5);
		var gamorrean_02 = new GamorreanGuard(227, "Gamorrean Guard", 200, 10, 10, 2, 5);

		var imperialGuard_01 = new ImperialGuard(228, "Imperial Guard", 200, 10, 10, 2, 5);
		var imperialGuard_02 = new ImperialGuard(229, "Imperial Guard", 200, 10, 10, 2, 5);
		var imperialGuard_03 = new ImperialGuard(230, "Imperial Guard", 200, 10, 10, 2, 5);

		// add characters to array

		/* simple game
		arrayOfCharacters.push(tuskenRaider_01);
		arrayOfCharacters.push(sandtrooper_01);
		arrayOfCharacters.push(greedo);
		arrayOfCharacters.push(stormtrooper_01);
		arrayOfCharacters.push(bossk);
		arrayOfCharacters.push(ig88);
		arrayOfCharacters.push(gamorrean_01);
		arrayOfCharacters.push(bobaFett);
		arrayOfCharacters.push(imperialGuard_01);
    	arrayOfCharacters.push(darthVader);
    	arrayOfCharacters.push(palpatine);*/

		/* want to have player fight some characters multiple times,
			becasue there are more than just one tuskan raider, stormtooper, sandtrooper, gamorrean, and imperial guard.
			This would help weaker characters to build some stats before they get to harder fights.
			The problem is that I would need some way to identify where I am at in the array, and that is hard without unique values.*/

		arrayOfCharacters.push(tuskenRaider_01);
		arrayOfCharacters.push(sandtrooper_01);
		arrayOfCharacters.push(tuskenRaider_02);
		arrayOfCharacters.push(stormtrooper_01);
		arrayOfCharacters.push(sandtrooper_02);
		arrayOfCharacters.push(tuskenRaider_03);
		arrayOfCharacters.push(stormtrooper_02);
		arrayOfCharacters.push(sandtrooper_03);
		arrayOfCharacters.push(greedo);
		arrayOfCharacters.push(sandtrooper_04);
		arrayOfCharacters.push(stormtrooper_03);
		arrayOfCharacters.push(bossk);
        arrayOfCharacters.push(stormtrooper_04);
		arrayOfCharacters.push(ig88);
		arrayOfCharacters.push(stormtrooper_05);
		arrayOfCharacters.push(sandtrooper_05);
		arrayOfCharacters.push(tuskenRaider_04);
		arrayOfCharacters.push(gamorrean_01);
		arrayOfCharacters.push(tuskenRaider_05);
		arrayOfCharacters.push(gamorrean_02);
		arrayOfCharacters.push(bobaFett);
		arrayOfCharacters.push(stormtrooper_06);
		arrayOfCharacters.push(imperialGuard_01);
		arrayOfCharacters.push(stormtrooper_07);
		arrayOfCharacters.push(imperialGuard_02);
    	arrayOfCharacters.push(darthVader);
    	arrayOfCharacters.push(stormtrooper_08);
    	arrayOfCharacters.push(imperialGuard_03);
    	arrayOfCharacters.push(stormtrooper_09);
    	arrayOfCharacters.push(palpatine);
    	
    	return(arrayOfCharacters);
	}

// CONSTRUCTORS
// https://www.w3schools.com/js/js_object_constructors.asp
// https://www.thecodeship.com/web-development/methods-within-constructor-vs-prototype-in-javascript/

	function TuskenRaider(theId, theName, theHp, theStrength, theDexterity, theAttack, theDefend)
	{
		this.id = theId;
		this.name = theName;
		this.hp = theHp;
		this.strength = theStrength;
		this.dexterity = theDexterity;
		this.attack = theAttack;
		this.defend = theDefend;
		this.armor = 2;		
		this.counterAttack = 2;

		this.getAttackPower = function() {
			return (this.strength * this.attack);
		};

		this.getDefenseRating = function() {
			return ((this.dexterity * this.defend) + this.armor);
		};

		this.getCounterAttackPower = function(){
			return this.counterAttack + this.dexterity + rollDice(6,1);
		};
	}

	function GamorreanGuard(theId, theName, theHp, theStrength, theDexterity, theAttack, theDefend)
	{
		this.id = theId;
		this.name = theName;
		this.hp = theHp;
		this.strength = theStrength;
		this.dexterity = theDexterity;
		this.attack = theAttack;
		this.defend = theDefend;
		this.armor = 5;
		this.counterAttack = 2;

		this.getAttackPower = function() {
			return (this.strength * this.attack);
		};

		this.getDefenseRating = function() {
			return ((this.dexterity * this.defend) + this.armor);
		};

		this.getCounterAttackPower = function(){
			return this.counterAttack + this.dexterity + rollDice(6,1);
		};
	}

	function Sandtrooper(theId, theName, theHp, theStrength, theDexterity, theAttack, theDefend)
	{
		this.id = theId;
		this.name = theName;
		this.hp = theHp;
		this.strength = theStrength;
		this.dexterity = theDexterity;
		this.attack = theAttack;
		this.defend = theDefend;
		this.armor = 6;
		this.counterAttack = 2;

		this.getAttackPower = function() {
			return (this.strength * this.attack);
		};

		this.getDefenseRating = function() {
			return ((this.dexterity * this.defend) + this.armor);
		};

		this.getCounterAttackPower = function(){
			return this.counterAttack + this.dexterity + rollDice(6,1);
		};
	}

	function Stormtrooper(theId, theName, theHp, theStrength, theDexterity, theAttack, theDefend)
	{
		this.id = theId;
		this.name = theName;
		this.hp = theHp;
		this.strength = theStrength;
		this.dexterity = theDexterity;
		this.attack = theAttack;
		this.defend = theDefend;
		this.armor = 7;
		this.counterAttack = 2;

		this.getAttackPower = function() {
			return (this.strength * this.attack);
		};

		this.getDefenseRating = function() {
			return ((this.dexterity * this.defend) + this.armor);
		};

		this.getCounterAttackPower = function(){
			return this.counterAttack + this.dexterity + rollDice(6,1);
		};
	}

	function ImperialGuard(theId, theName, theHp, theStrength, theDexterity, theAttack, theDefend)
	{
		this.id = theId;
		this.name = theName;
		this.hp = theHp;
		this.strength = theStrength;
		this.dexterity = theDexterity;
		this.attack = theAttack;
		this.defend = theDefend;
		this.armor = 10;
		this.counterAttack = 2;

		this.getAttackPower = function() {
			return (this.strength * this.attack);
		};

		this.getDefenseRating = function() {
			return ((this.dexterity * this.defend) + this.armor);
		};

		this.getCounterAttackPower = function(){
			return this.counterAttack + this.dexterity + rollDice(6,1);
		};
	}

});

