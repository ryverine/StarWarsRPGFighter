/*

<!-- VILLANS -->
Luke
Chewbacca
Han
Obi-Wan
Leia
Lando
Yoda
Wicket


<!-- VILLANS -->
Tusken Raider
Gamorrean
Sandtrooper
Greedo
Stormtrooper
Bossk
IG-88
Boba Fett
Imperial Guard 
Darth Vader
Palpatine

*/

/*

// Managing charater growth

first idea:

if a character is dex-based (dex is higher than str by default) dex should increase more than str
Then the same for str characters, str will have potential to increae more.


HP should use 
d10 - heavy character: chewbacca
d8 - moderate character: 
d6 - weak character: wicket, leia, yoda



https://roll20.net/compendium/dnd5e/Character%20Advancement#content

https://5thsrd.org/rules/leveling_up/
*/

/*

// how will defend button work

action state: neutral, attack, defend

attack proceeds defense, so character that selects attack will go first. If both choose attack then hero acts first.


*/





// Don't do anything until the page loads.
$(document).ready(function() 
{
	var gameOverFlag = false;

	var player = new EmptyCharacter();
	var opponent = new EmptyCharacter();

	var playerBaseHealth = 0;

	// the main areas of the page
	var heroSelectionArea = $("#heroSelectionArea");
	var villainSelectionArea = $("#villainSelectionArea");
	var battleGround = $("#battleGround");
	var fightDataArea = $("#fightDataArea");
	var fightEvents = $("#fightEvents");
	var battleOrder = $("#battleOrder");
	var battleComplete = $("#battleComplete");
	var battleCompleteMessage = $("#battleCompleteMessage");

	// when player selects "story" gameMode
	// var opponents = setOpponents(); 
	// var fightNumber = 0;
	// var opponent  = opponents[fightNumber];

	var fightNumber = 0;
	
//look for mouse over to display character name as text
//https://stackoverflow.com/questions/29760719/detect-onhover-jquery-or-css-event-with-js
/*
    	$("p").mouseover(function()
    	{
        	$("p").css("background-color", "yellow");
    	});

    	$("p").mouseout(function()
    	{
        	$("p").css("background-color", "lightgray");
    	});
*/

	$(".heroCharacter").mouseover(function()
    {
    	if(player.name.length === 0)
    	{
    		var heroName = $(this).val();
        	$("#heroMouseOverOutput").text(heroName);
    	}	
    });

    $(".heroCharacter").mouseout(function()
    {
    	if(player.name.length === 0)
    	{
        	$("#heroMouseOverOutput").text("");
        	//$("p").css("background-color", "lightgray");
        }
    });

    $(".villainCharacter").mouseover(function()
    {	
    	if(opponent.name.length === 0)
    	{
    		var villainName = $(this).val();
        	$("#villainMouseOverOutput").text(villainName);
    	}
    });


    $(".villainCharacter").mouseout(function()
    {
    	if(opponent.name.length === 0)
    	{
       		$("#villainMouseOverOutput").text("");
        	//.css("background-color", "lightgray");
        }
    });

	// hero selected
	$(".heroCharacter").on("click", function() 
	{
		if(!gameOverFlag)
		{
			fightEvents.text("");// always make sure this is clear when new game/round starts

			if(player.name.length > 0)
			{
				console.log("Player character already selected!");
			}
			else
			{
				setPlayerCharacter($(this).val());
				playerBaseHealth = player.hp;
				logGameStats();
				// hide ".heroCharacter" elements
				heroSelectionArea.hide( 2000, function() {});
				// show villains
				villainSelectionArea.show( 2000, function() {});
				//refreshBattleGround();
			}
		}
	});

	// villain selected
	$(".villainCharacter").on("click", function()
	{
		if(!gameOverFlag)
		{
			fightEvents.text("");// always make sure this is clear when new game/round starts

			if(opponent.name.length > 0)
			{
				console.log("villain character already selected!");
			}
			else
			{
				fightNumber++;
				setOpponentCharacter($(this).val());
				logGameStats();
				//show battleGround
				battleGround.show(2000, function(){});
				//show fightDataArea
				fightDataArea.show(2000, function(){});
				refreshBattleGround();
				fightEvents.text("");
				battleOrder.append("Round " + fightNumber + ": " + $(this).val() + "<br>");
			}
		}
	});

	//attack button onclick
	$("#btn-attack").on("click", function()
	{
		if(!gameOverFlag)
		{
			//console.log("ATTACK button clicked!");

			//make sure we have a hero and a villain
			if(player.name.length > 0 && opponent.name.length > 0)
			{
				attackAction(player,opponent);
				
				if (opponent.hp <= 0) //player defeated opponent
				{
					opponent.hp = 0;
					console.log(player.name + " defeated " + opponent.name + "!");
				
					fightEvents.append(player.name + " defeated " + opponent.name + "!" + "<br>");
				
					// reset player health and level up
					player.hp = playerBaseHealth;
					player.levelUp();
					playerBaseHealth = player.hp;

					/*// reset villain so player can choose next fight
					// put a "defeated" image on villain and prevent user from re-selecting?
					opponent = new EmptyCharacter ();

					refreshBattleGround();*/

					//setTimeout(startNextRound,1000);
					startNextRound();
				}
				else
				{
					attackAction(opponent,player);
					//counterAttackAction(opponent,player);

					if (player.hp <= 0) 
					{
						player.hp = 0;

						console.log(opponent.name + " defeated " + player.name + "!");

						fightEvents.append(opponent.name + " defeated " + player.name + "!" + "<br>");

						refreshBattleGround();

						setTimeout(gameOver,1000);
					}
				}
			}
			else
			{
				console.log("Must select hero and villain character!");
			}

			refreshBattleGround();
		}
	});

	//defend button onclick
	$("#btn-defend").on("click", function() 
	{
		if(!gameOverFlag)
		{
			//console.log("DEFEND button clicked!");

			if(player.name.length > 0 && opponent.name.length > 0)
			{
				//nothing yet
			}
			else
			{
				console.log("No player character selected!");
			}
		}
	});

	function rollDice(dieType, numDie)
	{ //this would not work for percentage die, 
		var roll = 0;

		for(var i = 0; i < numDie; i++)
		{
			roll += Math.floor((Math.random() * Math.floor(dieType)) + 1);
		}

		return roll;
	}

	function refreshBattleGround()
	{
		console.log("refreshBattleGround()");

		$("#heroName").text(player.name);
		$("#heroClass").text(player.characterClass);
		$("#heroStats").text("HP: " + player.hp);
		$("#heroStats").append("<br>" + "Str: " + player.strength);
		$("#heroStats").append("<br>" + "Dex: " + player.dexterity);
		$("#heroStats").append("<br>" + "Attack: " + player.attack);
		$("#heroStats").append("<br>" + "Defense: " + player.defend);
		$("#heroStats").append("<br>" + "Armor: " + player.armorClass);

		$("#villainName").text(opponent.name);
		$("#villainClass").text(opponent.characterClass);
		$("#villainStats").text("HP: " + opponent.hp);
		$("#villainStats").append("<br>" + "Str: " + opponent.strength);
		$("#villainStats").append("<br>" + "Dex: " + opponent.dexterity);
		$("#villainStats").append("<br>" + "Attack: " + opponent.attack);
		$("#villainStats").append("<br>" + "Defense: " + opponent.defend);
		$("#villainStats").append("<br>" + "Armor: " + opponent.armorClass);
	}

	function attackAction(theAttacker, theAttacked)
	{
		var comboHits = theAttacker.getComboHits();

		for(var i = 0; i < comboHits; i++)
		{
			if(theAttacker.getAttackRoll() >= theAttacked.armorClass)
			{
				var damage = theAttacker.getAttackPower();

				theAttacked.hp = theAttacked.hp - damage;

				fightEvents.append(theAttacker.name + " attacks " + theAttacked.name + " for " + damage + " DMG points." + "<br>");
			}
			else
			{
				fightEvents.append(theAttacker.name + " attack missed " + theAttacked.name + "<br>");
			}
		}
	}

	function counterAttackAction(theAttacker, theAttacked)
	{
		// theAttacker counter attacks theAttacked
		// this will be used once defend button is active
		/*
		
		Riposte: 
		- Immediately after targeting opponent with attack, opponent can make one attack against attacker.
		- Opponent can make a riposte a number of times equal to their Dexterity or Strength modifier, whichever is greater (a minimum of one use). 
		*/
		var attackerBonus = 0;

		if(theAttacker.strength > theAttacker.dexterity)
		{
			attackerBonus = theAttacker.strength;
		}
		else
		{
			attackerBonus = theAttacker.dexterity;
		}

		// var counterAttackRoll = rollDice(20,1) + theAttacker.counterAttack;
		// attack roll needs to be function of character, because dex or str can be a modifier

		if(theAttacker.getAttackRoll() >= theAttacked.armorClass)
		{
			var damage = theAttacker.getAttackPower() + attackerBonus;//getCounterAttackPower();

			theAttacked.hp = theAttacked.hp - damage;

			fightEvents.append(theAttacker.name + " counter attacks " + theAttacked.name + " for " + damage + " DMG points." + "<br>");
		}
		else
		{
			fightEvents.append(theAttacker.name + " counter attack missed " + theAttacked.name + "<br>");
		}
		
	}

	function startNextRound()
	{
		console.log("startNextRound()");

		battleCompleteMessage.text("");

		// https://stackoverflow.com/questions/6205258/jquery-dynamically-create-button-and-attach-event-handler
		// <button id="btn-luke" class="btn btn-dark heroCharacter" value="Luke"><span><img src="assets/images/icons/luke.png"></span></button>
		// <button type="button" id="continueButton" class="btn btn-warning">Warning</button>

		// http://api.jquery.com/attr/
		// $( "#greatphoto" ).attr( "alt", "Beijing Brush Seller" );
		//var continueBtn = $('<button>Continue</button>');
		//continueBtn.attr("id", "continueButton" );
		//continueBtn.attr("class", "btn btn-warning");
		//battleCompleteMessage.append(continueBtn);
		
		battleComplete.show(2000, function(){});

		battleCompleteMessage.append(player.name + " defeated " + opponent.name + "<br>" + "On to next fight!!!");
	}


	$("#btn-continue").on("click", function() 
	{
		fightEvents.text("");
		// reset villain so player can choose next fight
		// put a "defeated" image on villain and prevent user from re-selecting?

		var buttonId = opponent.name.toLowerCase();
		buttonId = buttonId.replace(/\s+/g, '');//regex
		buttonId = "#btn-" + buttonId;
		
		opponent = new EmptyCharacter ();

		refreshBattleGround();
		battleCompleteMessage.text("");
		battleComplete.hide(2000, function(){});

		$(buttonId).hide(2000, function(){});
	});


	/*
	function startNextRound()
	{
		console.log("startNextRound()");
		alert("Select next villian for " + player.name + " to fight!");
		fightEventsOutput.text("");
	}
	*/



	function gameOver()
	{
		console.log("gameOver()");
		var playAgain = confirm("GAME OVER" + "\n" + player.name + " was defeated by " + opponent.name + "!" + "\n" + "Would you like to play again?");

		/*
			Instead of this confirm i want to create a div-row to be placed above the "battleGround"
			#battleCompleteMessage

			three columns
			[victory img of winner] [text stating who won and lost] [defeat image of loser]

			under the text should be new game button and a quit button.
		*/

		if (playAgain)
		{
			player = new EmptyCharacter();
			opponent = new EmptyCharacter();
			refreshBattleGround();
			fightEvents.text("");
			battleOrder.text("");
			villainSelectionArea.hide();
			battleGround.hide();
			fightDataArea.hide();
			heroSelectionArea.show( 2000, function() {});
		}
		else
		{
			gameOverFlag = true;
		}
	}

	function logGameStats()
	{
		console.log("***** CURRENT GAME STATS *****");
		console.log("Player Character:");
		console.log("** ID: " + player.id);
		console.log("** Class: " + player.characterClass);
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
		console.log("** ID: " + opponent.id);
		console.log("** Class: " + opponent.characterClass);
		console.log("** Name: " + opponent.name);
		console.log("** HP: " + opponent.hp);
		console.log("** Strength: " + opponent.strength);
		console.log("** Dexterity: " + opponent.dexterity);
		console.log("** Attack Multiplier: " + opponent.attack);
		console.log("** Defense Multiplier: " + opponent.defend);
		console.log("** Armor: " + opponent.armor);
		console.log("** Attack Power: " + opponent.getAttackPower());
		console.log("** Defense Rating: " + opponent.getDefenseRating());
		/*
		console.log("Opponent Fight Order: ");

		/*for(var i = 0; i < opponents.length; i++)
		{
			console.log("[" + i + "]: " + opponents[i].name);
		}*/

		console.log("******************************");
	}

	function setPlayerCharacter(theCharacter)
	{
		console.log("getPlayerCharacter("+theCharacter+")");
		theCharacter = theCharacter.toLowerCase();
		if (theCharacter === "luke skywalker")
		{
			player =  {
				id: 101,
				characterClass: "Jedi",
				name: "Luke Skywalker",
				hp: 100,
				strength: 5,
				dexterity: 5,
				attack: 7, // proficiency with weapon
				defend: 5, // 
				armorClass: 12,
				counterAttack: 2,
				xpModifier: 2,
				getAttackRoll: function() {
					return (rollDice(20,1) + this.strength + this.attack);
				},
				getComboHits: function() {
					return 1;
				},
				getAttackPower: function() {
    				return (rollDice(20,1) + this.strength);
    			},
    			getDefenseRating: function() {
    				return (this.dexterity + this.armorClass);
				},
				getCounterAttackPower: function() {
					return (rollDice(4,1) + this.counterAttack);
				},
				levelUp: function() {
					this.hp += rollDice(6,1) * this.xpModifier;
					this.strength += rollDice(6,1) + this.xpModifier;
					this.dexterity += rollDice(4,1) + this.xpModifier;
				}
    		};
		}
		else if (theCharacter === "chewbacca")
		{
			player =  {
				id: 102,
				characterClass: "Outlaw",
				name: "Chewbacca",
				hp: 100,
				strength: 8,
				dexterity: 3,
				attack: 4,
				defend: 5,
				armorClass: 10,
				counterAttack: 2,
				xpModifier: 2,
				getAttackRoll: function() {
					return (rollDice(20,1) + this.strength + this.attack);
				},
				getComboHits: function() {
					return rollDice(4,1);
				},
				getAttackPower: function() {
    				return (rollDice(20,1) + this.strength);
    			},
    			getDefenseRating: function() {
    				return (this.dexterity + this.armorClass);
				},
				getCounterAttackPower: function() {
					return (this.counterAttack + rollDice(4,1));
				},
				levelUp: function() {
					this.hp += rollDice(6,1) * this.xpModifier;
					this.strength += rollDice(4,1) + this.xpModifier;
					this.dexterity += rollDice(4,1) + this.xpModifier;
				}
    		};
		}
		else if (theCharacter === "han solo")
		{
			player =  {
				id: 103,
				characterClass: "Outlaw",
				name: "Han Solo",
				hp: 100,
				strength: 5,
				dexterity: 5,
				attack: 2,
				defend: 5,
				armorClass: 10,
				counterAttack: 2,
				xpModifier: 2,
				getAttackRoll: function() {
					return (rollDice(20,1) + this.strength + this.attack);
				},
				getComboHits: function() {
					return 1;
				},
				getAttackPower: function() {
    				return (rollDice(20,1) + this.strength);
    			},
    			getDefenseRating: function() {
    				return (this.dexterity + this.armorClass);
				},
				getCounterAttackPower: function() {
					return (this.counterAttack + rollDice(4,1));
				},
				levelUp: function() {
					this.hp += rollDice(6,1) * this.xpModifier;
					this.strength += rollDice(4,1) + this.xpModifier;
					this.dexterity += rollDice(4,1) + this.xpModifier;
				}
    		};
		}
		else if (theCharacter === "obi-wan kenobi")
		{
			player =  {
				id: 104,
				characterClass: "Jedi",
				name: "Obi-Wan Kenobi",
				hp: 100,
				strength: 5,
				dexterity: 5,
				attack: 10,
				defend: 5,
				armorClass: 10,
				counterAttack: 2,
				xpModifier: 2,
				getAttackRoll: function() {
					return (rollDice(20,1) + this.strength + this.attack);
				},
				getComboHits: function() {
					return 1;
				},
				getAttackPower: function() {
    				return (rollDice(20,1) + this.strength);
    			},
    			getDefenseRating: function() {
    				return (this.dexterity + this.armorClass);
				},
				getCounterAttackPower: function() {
					return (this.counterAttack + rollDice(4,1));
				},
				levelUp: function() {
					this.hp += rollDice(6,1) * this.xpModifier;
					this.strength += rollDice(4,1) + this.xpModifier;
					this.dexterity += rollDice(4,1) + this.xpModifier;
				}
    		};
		}
		else if (theCharacter === "leia organa")
		{
			player =  {
				id: 105,
				characterClass: "Princess",
				name: "Leia Organa",
				hp: 100,
				strength: 5,
				dexterity: 5,
				attack: 2,
				defend: 5,
				armorClass: 10,
				counterAttack: 2,
				xpModifier: 2,
				getAttackRoll: function() {
					return (rollDice(20,1) + this.strength + this.attack);
				},
				getComboHits: function() {
					return 1;
				},
				getAttackPower: function() {
    				return (rollDice(20,1) + this.strength);
    			},
    			getDefenseRating: function() {
    				return (this.dexterity + this.armorClass);
				},
				getCounterAttackPower: function() {
					return (this.counterAttack + rollDice(4,1));
				},
				levelUp: function() {
					this.hp += rollDice(6,1) * this.xpModifier;
					this.strength += rollDice(4,1) + this.xpModifier;
					this.dexterity += rollDice(4,1) + this.xpModifier;
				}
    		};
		}
		else if (theCharacter === "lando calrissian")
		{
			player =  {
				id: 106,
				characterClass: "Outlaw",
				name: "Lando Calrissian",
				hp: 100,
				strength: 5,
				dexterity: 5,
				attack: 2,
				defend: 5,
				armorClass: 10,
				counterAttack: 2,
				xpModifier: 2,
				getAttackRoll: function() {
					return (rollDice(20,1) + this.strength + this.attack);
				},
				getComboHits: function() {
					return 1;
				},
				getAttackPower: function() {
    				return (rollDice(20,1) + this.strength);
    			},
    			getDefenseRating: function() {
    				return (this.dexterity + this.armorClass);
				},
				getCounterAttackPower: function() {
					return (this.counterAttack + rollDice(4,1));
				},
				levelUp: function() {
					this.hp += rollDice(6,1) * this.xpModifier;
					this.strength += rollDice(4,1) + this.xpModifier;
					this.dexterity += rollDice(4,1) + this.xpModifier;
				}
    		};
		}
		else if (theCharacter === "yoda")
		{
			player =  {
				id: 107,
				characterClass: "Jedi",
				name: "Yoda",
				hp: 100,
				strength: 5,
				dexterity: 5,
				attack: 15,
				defend: 5,
				armorClass: 10,
				counterAttack: 2,
				xpModifier: 2,
				getAttackRoll: function() {
					return (rollDice(20,1) + this.strength + this.attack);
				},
				getComboHits: function() {
					return 1;
				},
				getAttackPower: function() {
    				return (rollDice(20,1) + this.strength);
    			},
    			getDefenseRating: function() {
    				return (this.dexterity + this.armorClass);
				},
				getCounterAttackPower: function() {
					return (this.counterAttack + rollDice(4,1));
				},
				levelUp: function() {
					this.hp += rollDice(6,1) * this.xpModifier;
					this.strength += rollDice(4,1) + this.xpModifier;
					this.dexterity += rollDice(4,1) + this.xpModifier;
				}
    		};
		}
		else if (theCharacter === "wicket")
		{ //https://en.wikipedia.org/wiki/Ewok; https://en.wikipedia.org/wiki/Wicket_W._Warrick
			player =  {
				id: 108,
				characterClass: "Warrior",
				name: "Wicket", // Full name is Wicket W. Warrick
				hp: 100,
				strength: 5,
				dexterity: 5,
				attack: 2,
				defend: 5,
				armorClass: 10,
				counterAttack: 2,
				xpModifier: 2,
				getAttackRoll: function() {
					return (rollDice(20,1) + this.strength + this.attack);
				},
				getComboHits: function() {
					return rollDice(4,1);
				},
				getAttackPower: function() {
    				return (rollDice(20,1) + this.strength);
    			},
    			getDefenseRating: function() {
    				return (this.dexterity + this.armorClass);
				},
				getCounterAttackPower: function() {
					return (this.counterAttack + rollDice(4,1));
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
			console.log("Unexpected HERO selected!");
		}
	}

function setOpponentCharacter(theCharacter)
{
	console.log("getOpponentCharacter("+theCharacter+")");
	theCharacter = theCharacter.toLowerCase();
	if (theCharacter === "stormtrooper")
	{
		opponent =  {
			id: 210,
			characterClass: "Marksman",
			name: "Stormtrooper",
			hp: 100,
			strength: 5,
			dexterity: 7,
			attack: 4,
			defend: 5,
			armorClass: 15,
			counterAttack: 2,
			getAttackRoll: function() {
				return (rollDice(20,1) + this.dexterity + this.attack);
			},
			getComboHits: function() {
				return 1;
			},
			getAttackPower: function() {
    			return (rollDice(20,1) + this.dexterity);
    		},
			getDefenseRating: function() {
				return (this.dexterity + this.armorClass);
			},
			getCounterAttackPower: function() {
				return (this.counterAttack + rollDice(4,1));
			}
		};
	}
	else if (theCharacter === "sandtrooper")
	{
		opponent =  {
			id: 209,
			characterClass: "Marksman",
			name: "Sandtrooper",
			hp: 80,
			strength: 2,
			dexterity: 5,
			attack: 2,
			defend: 5,
			armorClass: 15,
			counterAttack: 2,
			getAttackRoll: function() {
				return (rollDice(20,1) + this.dexterity + this.attack);
			},
			getComboHits: function() {
				return 1;
			},
			getAttackPower: function() {
    			return (rollDice(20,1) + this.dexterity);
    		},
			getDefenseRating: function() {
				return (this.dexterity + this.armorClass);
			},
			getCounterAttackPower: function() {
				return (this.counterAttack + rollDice(4,1));
			}
		};
	}
	else if (theCharacter === "tusken raider")
	{
		opponent =  {
			id: 208,
			characterClass: "Outlaw",
			name: "Tusken Raider",
			hp: 50,
			strength: 2,
			dexterity: 2,
			attack: 1,
			defend: 2,
			armorClass: 10,
			counterAttack: 2,
			getAttackRoll: function() {
				return (rollDice(20,1) + this.strength + this.attack);
			},
			getComboHits: function() {
				return rollDice(4,1);
			},
			getAttackPower: function() {
    			return (rollDice(20,1) + this.strength);
    		},
			getDefenseRating: function() {
				return (this.dexterity + this.armorClass);
			},
			getCounterAttackPower: function() {
				return (this.counterAttack + rollDice(4,1));
			}
		};
	}
	else if (theCharacter === "gamorrean guard")
	{
		opponent =  {
			id: 207,
			characterClass: "Outlaw",
			name: "Gamorrean Guard",
			hp: 100,
			strength: 7,
			dexterity: 5,
			attack: 4,
			defend: 5,
			armorClass: 12,
			counterAttack: 2,
			getAttackRoll: function() {
				return (rollDice(20,1) + this.strength + this.attack);
			},
			getComboHits: function() {
				return rollDice(4,1);
			},
			getAttackPower: function() {
    			return (rollDice(20,1) + this.dexterity);
    		},
			getDefenseRating: function() {
				return (this.dexterity + this.armorClass);
			},
			getCounterAttackPower: function() {
				return (this.counterAttack + rollDice(4,1));
			}
		};
	}
	else if (theCharacter === "imperial guard")
	{
		opponent =  {
			id: 206,
			characterClass: "Sentinel",
			name: "Imperial Guard",
			hp: 100,
			strength: 10,
			dexterity: 5,
			attack: 5,
			defend: 5,
			armorClass: 18,
			counterAttack: 2,
			getAttackRoll: function() {
				return (rollDice(20,1) + this.strength + this.attack);
			},
			getComboHits: function() {
				return rollDice(4,1);
			},
			getAttackPower: function() {
    			return (rollDice(20,1) + this.strength);
    		},
			getDefenseRating: function() {
				return (this.dexterity + this.armorClass);
			},
			getCounterAttackPower: function() {
				return (this.counterAttack + rollDice(4,1));
			}
		};
	}
	else if (theCharacter === "greedo")
	{
		opponent =  {
			id: 205,
			characterClass: "Outlaw",
			name: "Greedo",
			hp: 100,
			strength: 2,
			dexterity: 5,
			attack: 3,
			defend: 5,
			armorClass: 10,
			counterAttack: 2,
			getAttackRoll: function() {
				return (rollDice(20,1) + this.dexterity + this.attack);
			},
			getComboHits: function() {
				return 1;
			},
			getAttackPower: function() {
    			return (rollDice(20,1) + this.dexterity);
    		},
			getDefenseRating: function() {
				return (this.dexterity + this.armorClass);
			},
			getCounterAttackPower: function() {
				return (this.counterAttack + rollDice(4,1));
			}
		};
	}
	else if (theCharacter === "bossk")
	{
		opponent =  {
			id: 204,
			characterClass: "Bounty Hunter",
			name: "Bossk",
			hp: 100,
			strength: 5,
			dexterity: 7,
			attack: 5,
			defend: 5,
			armorClass: 12,
			counterAttack: 2,
			getAttackRoll: function() {
				return (rollDice(20,1) + this.dexterity + this.attack);
			},
			getComboHits: function() {
				return 1;
			},
			getAttackPower: function() {
    			return (rollDice(20,1) + this.dexterity);
    		},
			getDefenseRating: function() {
				return (this.dexterity + this.armorClass);
			},
			getCounterAttackPower: function() {
				return (this.counterAttack + rollDice(4,1));
			}
		};
	}
	else if (theCharacter === "ig-88")
	{ 
		opponent =  {
			id: 203,
			characterClass: "Bounty Hunter",
			name: "IG-88",
			hp: 100,
			strength: 5,
			dexterity: 5,
			attack: 2,
			defend: 5,
			armorClass: 15,
			counterAttack: 2,
			getAttackRoll: function() {
				return (rollDice(20,1) + this.dexterity + this.attack);
			},
			getComboHits: function() {
				return 1;
			},
			getAttackPower: function() {
    			return (rollDice(20,1) + this.dexterity);
    		},
			getDefenseRating: function() {
				return (this.dexterity + this.armorClass);
			},
			getCounterAttackPower: function() {
				return (this.counterAttack + rollDice(4,1));
			}
		};
	}
	else if (theCharacter === "boba fett")
	{ 
		opponent =  {
			id: 202,
			characterClass: "Bounty Hunter",
			name: "Boba Fett",
			hp: 100,
			strength: 5,
			dexterity: 10,
			attack: 8,
			defend: 5,
			armorClass: 15,
			counterAttack: 2,
			getAttackRoll: function() {
				return (rollDice(20,1) + this.dexterity + this.attack);
			},
			getComboHits: function() {
				return rollDice(4,1);
			},
			getAttackPower: function() {
    			return (rollDice(20,1) + this.dexterity);
    		},
			getDefenseRating: function() {
				return (this.dexterity + this.armorClass);
			},
			getCounterAttackPower: function() {
				return (this.counterAttack + rollDice(4,1));
			}
		};
	}
	else if (theCharacter === "darth vader")
	{ 
		opponent =  {
			id: 201,
			characterClass: "Sith",
			name: "Darth Vader",
			hp: 100,
			strength: 5,
			dexterity: 5,
			attack: 2,
			defend: 5,
			armorClass: 18,
			counterAttack: 2,
			getAttackRoll: function() {
				return (rollDice(20,1) + this.strength + this.attack);
			},
			getComboHits: function() {
				return 1;
			},
			getAttackPower: function() {
    			return (rollDice(20,1) + this.strength);
    		},
			getDefenseRating: function() {
				return (this.dexterity + this.armorClass);
			},
			getCounterAttackPower: function() {
				return (this.counterAttack + rollDice(4,1));
			}
		};
	}
	else if (theCharacter === "emperor palpatine")
	{ 
		opponent =  {
			id: 200,
			characterClass: "Sith",
			name: "Emperor Palpatine",
			hp: 100,
			strength: 5,
			dexterity: 10,
			attack: 15,
			defend: 5,
			armorClass: 10,
			counterAttack: 2,
			getAttackRoll: function() {
				return (rollDice(20,1) + this.dexterity + this.attack);
			},
			getComboHits: function() {
				return rollDice(4,1);
			},
			getAttackPower: function() {
    			return (rollDice(20,1) + this.dexterity);
    		},
			getDefenseRating: function() {
				return (this.dexterity + this.armorClass);
			},
			getCounterAttackPower: function() {
				return (this.counterAttack + rollDice(4,1));
			}
		};
	}
	else
	{
		console.log("Unexpected villain selected!");
	}
}

function EmptyCharacter()
{
	this.id = 0;
	this.characterClass = "";
	this.name = "";
	this.hp = 0;
	this.strength = 0;
	this.dexterity = 0;
	this.attack = 0;
	this.defend = 0;
	this.armorClass = 0;
	this.counterAttack = 0;
	this.getAttackRoll = function(){};
	this.getComboHits = function(){};
	this.getAttackPower = function(){};
	this.getDefenseRating = function(){};
	this.getCounterAttackPower = function(){};
	this.getCounterAttackPower = function(){};
}

/* For story mode
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
			armorClass: 10,
			counterAttack: 2,
			getAttackPower: function() {
				return this.strength * this.attack;
			},
			getDefenseRating: function() {
				return ((this.dexterity * this.defend) + this.armorClass);
			},
			getCounterAttackPower: function() {
				return (this.counterAttack + rollDice(4,1));
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
			armorClass: 10,
			counterAttack: 2,
			getAttackPower: function() {
				return this.strength * this.attack;
			},
			getDefenseRating: function() {
				return ((this.dexterity * this.defend) + this.armorClass);
			},
			getCounterAttackPower: function() {
				return (this.counterAttack + rollDice(4,1));
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
			armorClass: 10,
			counterAttack: 2,
			getAttackPower: function() {
				return this.strength * this.attack;
			},
			getDefenseRating: function() {
				return ((this.dexterity * this.defend) + this.armorClass);
			},
			getCounterAttackPower: function() {
				return (this.counterAttack + rollDice(4,1));
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
			armorClass: 10,
			counterAttack: 2,
			getAttackPower: function() {
				return this.strength * this.attack;
			},
			getDefenseRating: function() {
				return ((this.dexterity * this.defend) + this.armorClass);
			},
			getCounterAttackPower: function() {
				return (this.counterAttack + rollDice(4,1));
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
			armorClass: 10,
			counterAttack: 2,
			getAttackPower: function() {
				return this.strength * this.attack;
			},
			getDefenseRating: function() {
				return ((this.dexterity * this.defend) + this.armorClass);
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
			armorClass: 10,
			counterAttack: 2,
			getAttackPower: function() {
				return this.strength * this.attack;
			},
			getDefenseRating: function() {
				return ((this.dexterity * this.defend) + this.armorClass);
			},
			getCounterAttackPower: function() {
				return (this.counterAttack + rollDice(4,1));
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
		this.armorClass = 10;		
		this.counterAttack = 2;

		this.getAttackPower = function() {
			return (this.strength * this.attack);
		};

		this.getDefenseRating = function() {
			return ((this.dexterity * this.defend) + this.armorClass);
		};

		this.getCounterAttackPower = function(){
			return (this.counterAttack + rollDice(4,1));
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
		this.armorClass = 10;
		this.counterAttack = 2;

		this.getAttackPower = function() {
			return (this.strength * this.attack);
		};

		this.getDefenseRating = function() {
			return ((this.dexterity * this.defend) + this.armorClass);
		};

		this.getCounterAttackPower = function(){
			return (this.counterAttack + rollDice(4,1));
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
		this.armorClass = 10;
		this.counterAttack = 2;

		this.getAttackPower = function() {
			return (this.strength * this.attack);
		};

		this.getDefenseRating = function() {
			return ((this.dexterity * this.defend) + this.armorClass);
		};

		this.getCounterAttackPower = function(){
			return (this.counterAttack + rollDice(4,1));
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
		this.armorClass = 10;
		this.counterAttack = 2;

		this.getAttackPower = function() {
			return (this.strength * this.attack);
		};

		this.getDefenseRating = function() {
			return ((this.dexterity * this.defend) + this.armorClass);
		};

		this.getCounterAttackPower = function(){
			return (this.counterAttack + rollDice(4,1));
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
		this.armorClass = 10;
		this.counterAttack = 2;

		this.getAttackPower = function() {
			return (this.strength * this.attack);
		};

		this.getDefenseRating = function() {
			return ((this.dexterity * this.defend) + this.armorClass);
		};

		this.getCounterAttackPower = function(){
			return (this.counterAttack + rollDice(4,1));
		};
	}
	*/

});

