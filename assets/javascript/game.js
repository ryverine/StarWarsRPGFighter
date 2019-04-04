/*

D&D 5th Edition
Compendium
Weapons

https://roll20.net/compendium/dnd5e/Weapons#content


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
							Riposte: 
							- Immediately after targeting opponent with attack, 
							opponent can make one attack against attacker.
							- Opponent can make a riposte a number of times equal to their Dexterity or Strength modifier, 
							whichever is greater (a minimum of one use). 
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

/*
Multi-attack
https://rpg.stackexchange.com/questions/92044/can-a-creature-with-multiattack-make-more-than-one-attack-as-part-of-a-readied-a
A creature that can make multiple attacks on its turn has the Multiattack ability. 
A creature can’t use Multiattack when making an opportunity attack, which must be a single melee attack.

Extra Attack
https://merricb.com/2015/04/21/the-attack-action-extra-attacks-and-other-attacks/
Extra Attack allows you to make one additional attack when you take the Attack action. 
(You may also move between the two attacks). 
Fighters gain the ability to gain two or three additional attacks at higher levels, 
so a 20th level fighter is able to make 4 attacks when they take the Attack action.


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
			console.log("ATTACK button clicked!");

			//make sure we have a hero and a villain
			if(player.name.length > 0 && opponent.name.length > 0)
			{
				player.actionState = "attack";

				opponent.setActionState();

				if(opponent.actionState.toLowerCase() === 'attack')
				{
					// determines who goes first
					var firstAttacker = rollForInitiative(player.name.toLowerCase(), opponent.name.toLowerCase());

					if (firstAttacker === player.name.toLowerCase())
					{
						//player attacks first
						var playerDmgToOpponent01 = doAttackAction(player, opponent);

						opponent.hp = opponent.hp - playerDmgToOpponent01;

						if (opponent.hp <= 0)
						{
							opponent.hp = 0;



							player.hp = playerBaseHealth;
							player.levelUp();
							playerBaseHealth = player.hp;



							refreshBattleGround();
							startNextRound();
						}
						else
						{
							//now opponent attacks

							var opponentDmgToPlayer01 = doAttackAction(opponent, player);

							player.hp = player.hp - opponentDmgToPlayer01;

							if (player.hp <= 0)
							{
								player.hp = 0;
								refreshBattleGround();
								gameOver();
							}
							else
							{
								refreshBattleGround();
							}
						}
					}
					else
					{
						//opponent attacks first

						var opponentDmgToPlayer02 = doAttackAction(opponent, player);

						player.hp = player.hp - opponentDmgToPlayer02;

						if (player.hp <= 0)
						{
							player.hp = 0;
							refreshBattleGround();
							gameOver();
						}
						else
						{
							// now player attacks
							var playerDmgToOpponent02 = doAttackAction(player, opponent);

							opponent.hp = opponent.hp - playerDmgToOpponent02;

							if (opponent.hp <= 0)
							{
								opponent.hp = 0;
								player.hp = playerBaseHealth;
								player.levelUp();
								playerBaseHealth = player.hp;
								refreshBattleGround();
								startNextRound();
							}
							else
							{
								refreshBattleGround();
							}
						}
					}
				}
				else if (opponent.actionState.toLowerCase() === 'defend')
				{
					fightEvents.append(opponent.name + " defends!" + "<br>");

					// player attacks
					var playerDmgToOpponent03 = doAttackAction(player, opponent);

					opponent.hp = opponent.hp - playerDmgToOpponent03;

					if (opponent.hp <= 0)
					{
						opponent.hp = 0;
						player.hp = playerBaseHealth;
						player.levelUp();
						playerBaseHealth = player.hp;
						refreshBattleGround();
						startNextRound();
					}
					else
					{
						// does opponent counter attack
						if (opponent.counterAttackRoll())
						{
							var opponentCounterAttack = opponent.getCounterAttackPower();

							fightEvents.append(opponent.name + " counter attacks " + player.name + " for " + opponentCounterAttack + " points." + "<br>");

							var counterDmgPercent = player.getDefenseRating() / 100;
							var counterDmgReduction = Math.floor(opponentCounterAttack * counterDmgPercent);

							fightEvents.append(player.name + " damage reduced by " + counterDmgReduction + " points." + "<br>");

							opponentCounterAttack = Math.floor(opponentCounterAttack - counterDmgReduction);

							player.hp = player.hp - opponentCounterAttack;

							if (player.hp <= 0)
							{
								player.hp = 0;
								refreshBattleGround();
								gameOver();
							}
							else
							{
								refreshBattleGround();
							}
						}
						else
						{
							fightEvents.append(opponent.name + " fails to counter attack " + player.name + "!" + "<br>");
						}
					}
				}
				else
				{
					console.log("Player attacked, but Opponent is in unexpected action state.")
				}
			}
			else
			{
				console.log("Must select hero and villain character!");
			}

			player.actionState = "neutral";
			player.opponentState = "neutral";
			refreshBattleGround();
		}
	});

	function doAttackAction(theAttacker, theAttacked)
	{
		var attackerComboHits = theAttacker.getComboHits();
		var totalDmg = 0;

		for(var i = 0; i < attackerComboHits; i++)
		{
			if(theAttacker.getAttackRoll() >= theAttacked.armorClass)
			{
				var damage = theAttacker.getAttackPower();

				totalDmg  += damage;

				fightEvents.append(theAttacker.name + " attacks " + theAttacked.name + " for " + damage + " points." + "<br>");
			}
			else
			{
				fightEvents.append(theAttacker.name + " attack missed " + theAttacked.name + "!" + "<br>");
			}
		}

		var attackedDmgReductionPercent = theAttacked.getDefenseRating() / 100;

		var attackedDmgReduction = Math.floor(totalDmg * attackedDmgReductionPercent);
	
		fightEvents.append(theAttacked.name + " damage reduced by " + attackedDmgReduction + " points."  + "<br>");

		totalDmg = Math.floor(totalDmg - attackedDmgReduction);

		return totalDmg;
	}

	//defend button onclick
	$("#btn-defend").on("click", function() 
	{
		if(!gameOverFlag)
		{
			console.log("DEFEND button clicked!");

			if(player.name.length > 0 && opponent.name.length > 0)
			{
				player.actionState = "defend";

				fightEvents.append(player.name + " defends!" + "<br>");

				opponent.setActionState();

				if(opponent.actionState.toLowerCase() === 'defend')
				{
					fightEvents.append(player.name + " and " + opponent.name + " stand their ground." + "<br>");
				}
				else if(opponent.actionState.toLowerCase() === 'attack')
				{
					// calculate damage done to player
					var opponentAttack = doAttackAction(opponent,player);

					player.hp = player.hp - opponentAttack;

					//did player die?
					if (player.hp <= 0)
					{
						player.hp = 0;
						refreshBattleGround();
						gameOver();
					}
					else
					{
						if (player.counterAttackRoll())
						{
							var counterDmg = player.getCounterAttackPower();

							fightEvents.append(player.name + " counter attacks " + opponent.name + " for " + counterDmg + " points." + "<br>");

							var opponentDmgPercent = opponent.getDefenseRating() / 100;

							var opponentDmgReduction = Math.floor(counterDmg * opponentDmgPercent);

							fightEvents.append(opponent.name + " damage reduced by " + opponentDmgReduction + " points." + "<br>");

							counterDmg = Math.floor(counterDmg - opponentDmgReduction);

							opponent.hp = opponent.hp - counterDmg;

							if (opponent.hp <= 0)
							{
								opponent.hp = 0;
								player.hp = playerBaseHealth;
								player.levelUp();
								playerBaseHealth = player.hp;
								refreshBattleGround();
								startNextRound();
							}
						}
						else
						{
							fightEvents.append(player.name + " fails to counter attack " + opponent.name + "!" + "<br>");
						}

						refreshBattleGround();
					}
				}
				else
				{
					console.log("Player defended, but Opponent is in unexpected action state.")
				}

				player.actionState = "neutral";
				opponent.actionState = "neutral";
			}
			else
			{
				console.log("No player character selected!");
			}

			player.actionState = "neutral";
			opponent.actionState = "neutral";

			refreshBattleGround();
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

	function rollForInitiative(rollerOne, rollerTwo)
	{
		rollerOne = rollerOne.toLowerCase();
		rollerTwo = rollerTwo.toLowerCase();

		var rollOne = rollDice(20,1);
		var rollTwo = rollDice(20,1);

		if(rollOne > rollTwo)
		{
			return rollerOne;
		}
		else if (rollTwo > rollOne)
		{
			return rollerTwo;
		}
		else
		{
			rollForInitiative(rollerOne, rollerTwo);
		}
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

				totalDmg += damage;

				theAttacked.hp = theAttacked.hp - damage;

				fightEvents.append(theAttacker.name + " attacks " + theAttacked.name + " for " + damage + " DMG points." + "<br>");
			}
			else
			{
				fightEvents.append(theAttacker.name + " attack missed " + theAttacked.name + "<br>");
			}
		}
	}

	function startNextRound()
	{
		console.log("startNextRound()");

		battleCompleteMessage.text("");
		
		battleComplete.show(2000, function(){});

		battleCompleteMessage.append(player.name + " defeated " + opponent.name + "<br>" + "On to next fight!!!");
	}

	$("#btn-continue").on("click", function() 
	{
		fightEvents.text("");

		var buttonId = opponent.name.toLowerCase();
		buttonId = buttonId.replace(/\s+/g, '');//regex
		buttonId = "#btn-" + buttonId;
		
		opponent = new EmptyCharacter ();

		refreshBattleGround();
		battleCompleteMessage.text("");
		battleComplete.hide(2000, function(){});

		$(buttonId).hide(2000, function(){});
	});

    $("#btn-newgame").on("click", function() 
	{
		// use instead of confirm in gameOver()
		console.log("NEW GAME button clicked!");
	});

	$("#btn-quit").on("click", function() 
	{
		// use instead of confirm in gameOver()
		console.log("QUIT button clicked!");
	});

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
		console.log("** Action State: " + player.actionState);
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
		console.log("** Action State: " + opponent.actionState);
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
		// to advance this have a weapon array
		// 0 = name, 1 = die type, 2 = num of die

		console.log("getPlayerCharacter("+theCharacter+")");
		theCharacter = theCharacter.toLowerCase();
		if (theCharacter === "luke skywalker")
		{
			player =  {
				id: 101,
				actionState: "neutral",
				characterClass: "Jedi Knight",
				name: "Luke Skywalker",
				hp: 100,
				strength: 5,
				dexterity: 5,
				attack: 5, // proficiency with weapon
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
					return (rollDice(20,1) + this.dexterity);
				},
				counterAttackRoll: function() {
					var roll = rollDice(20,1);
					
					if(20%roll === 0)
					{
						return true;
					}
					else
					{
						return false;
					}
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
				actionState: "neutral",
				characterClass: "Outlaw Smuggler",
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
					return (rollDice(20,1) + this.dexterity);
				},
				counterAttackRoll: function() {
					var roll = rollDice(4,1);
					
					if(4%roll === 0)
					{
						return true;
					}
					else
					{
						return false;
					}
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
				actionState: "neutral",
				characterClass: "Outlaw Smuggler",
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
    				return (rollDice(20,1) + this.dexterity + this.defend);
				},
				getCounterAttackPower: function() {
					return (rollDice(20,1) + this.dexterity);
				},
				counterAttackRoll: function() {
					var roll = rollDice(4,1);
					
					if(4%roll === 0)
					{
						return true;
					}
					else
					{
						return false;
					}
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
				actionState: "neutral",
				characterClass: "Jedi Knight",
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
    				return (rollDice(20,1) + this.dexterity + this.defend);
				},
				getCounterAttackPower: function() {
					return (rollDice(20,1) + this.dexterity);
				},
				counterAttackRoll: function() {
					var roll = rollDice(10,1);
					
					if(10%roll === 0)
					{
						return true;
					}
					else
					{
						return false;
					}
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
				actionState: "neutral",
				characterClass: "Princess",
				name: "Leia Organa",
				hp: 100,
				strength: 3,
				dexterity: 7,
				attack: 2,
				defend: 5,
				armorClass: 10,
				counterAttack: 5,
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
    				return (rollDice(20,1) + this.dexterity + this.defend);
				},
				getCounterAttackPower: function() {
					return (rollDice(20,1) + this.dexterity);
				},
				counterAttackRoll: function() {
					var roll = rollDice(6,1);
					
					if(6%roll === 0)
					{
						return true;
					}
					else
					{
						return false;
					}
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
				actionState: "neutral",
				characterClass: "Outlaw Hustler",
				name: "Lando Calrissian",
				hp: 100,
				strength: 5,
				dexterity: 5,
				attack: 2,
				defend: 5,
				armorClass: 10,
				counterAttack: 7,
				xpModifier: 2,
				getAttackRoll: function() {
					return (rollDice(20,1) + this.dexterity + this.attack);
				},
				getComboHits: function() {
					return 1;
				},
				getAttackPower: function() {
    				return (rollDice(20,1) + this.strength);
    			},
    			getDefenseRating: function() {
    				return (rollDice(20,1) + this.dexterity + this.defend);
				},
				getCounterAttackPower: function() {
					return (rollDice(20,1) + this.dexterity);
				},
				counterAttackRoll: function() {
					var roll = rollDice(12,1);
					
					if(12%roll === 0)
					{
						return true;
					}
					else
					{
						return false;
					}
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
				actionState: "neutral",
				characterClass: "Jedi Knight",
				name: "Yoda",
				hp: 100,
				strength: 5,
				dexterity: 5,
				attack: 15,
				defend: 5,
				armorClass: 10,
				counterAttack: 7,
				xpModifier: 2,
				getAttackRoll: function() {
					return (rollDice(20,1) + this.strength + this.attack);
				},
				getComboHits: function() {
					return 1;
				},
				getAttackPower: function() {
    				return (rollDice(10,2) + this.strength);
    			},
    			getDefenseRating: function() {
    				return (rollDice(20,1) + this.dexterity + this.defend);
				},
				getCounterAttackPower: function() {
					return (rollDice(20,1) + this.dexterity);
				},
				counterAttackRoll: function() {
					var roll = rollDice(4,1);
					
					if(4%roll === 0)
					{
						return true;
					}
					else
					{
						return false;
					}
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
				actionState: "neutral",
				characterClass: "Ewok Warrior",
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
    				return (rollDice(6,1) + this.strength);
    			},
    			getDefenseRating: function() {
    				return (rollDice(20,1) + this.dexterity + this.defend);
				},
				getCounterAttackPower: function() {
					return (rollDice(20,1) + this.dexterity);
				},
				counterAttackRoll: function() {
					var roll = rollDice(6,1);
					
					if(6%roll === 0)
					{
						return true;
					}
					else
					{
						return false;
					}
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
			actionState: "neutral",
			characterClass: "Imperial Soldier",
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
				return (rollDice(20,1) + this.dexterity + this.defend);
			},
			getCounterAttackPower: function() {
				return (rollDice(20,1) + this.dexterity);
			},
			counterAttackRoll: function() {
				var roll = rollDice(4,1);
				
				if(4%roll === 0)
				{
					return true;
				}
				else
				{
					return false;
				}
			},
			setActionState:  function() {
				// rollDice
				var roll = rollDice(6,1);

				// 4/6 chances to defend
				if(6%roll === 0)
				{
					this.actionState = 'defend';
				}
				else
				{
					this.actionState = 'attack';
				}
			}
		};
	}
	else if (theCharacter === "sandtrooper")
	{
		opponent =  {
			id: 209,
			actionState: "neutral",
			characterClass: "Imperial Soldier",
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
				return (rollDice(20,1) + this.dexterity + this.defend);
			},
			getCounterAttackPower: function() {
				return (rollDice(20,1) + this.dexterity);
			},
			counterAttackRoll: function() {
				var roll = rollDice(12,1);
				
				if(12%roll === 0)
				{
					return true;
				}
				else
				{
					return false;
				}
			},
			setActionState:  function() {
				// rollDice
				var roll = rollDice(4,1);

				// 2/4 chances to defend
				if(4%roll === 0)
				{
					this.actionState = 'defend';
				}
				else
				{
					this.actionState = 'attack';
				}
			}
		};
	}
	else if (theCharacter === "tusken raider")
	{
		opponent =  {
			id: 208,
			actionState: "neutral",
			characterClass: "Outlaw Nomad",
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
				return (rollDice(20,1) + this.dexterity + this.defend);
			},
			getCounterAttackPower: function() {
				return (rollDice(20,1) + this.dexterity);
			},
			counterAttackRoll: function() {
				var roll = rollDice(20,1);
				
				if(20%roll === 0)
				{
					return true;
				}
				else
				{
					return false;
				}
			},
			setActionState:  function() {
				// rollDice
				var roll = rollDice(12,1);

				// 5/12 chances to defend
				if(12%roll === 0)
				{
					this.actionState = 'defend';
				}
				else
				{
					this.actionState = 'attack';
				}
			}
		};
	}
	else if (theCharacter === "gamorrean guard")
	{
		opponent =  {
			id: 207,
			actionState: "neutral",
			characterClass: "Outlaw Bouncer",
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
				return (rollDice(20,1) + this.dexterity + this.defend);
			},
			getCounterAttackPower: function() {
				return (rollDice(20,1) + this.dexterity);
			},
			counterAttackRoll: function() {
				var roll = rollDice(4,1);
				
				if(4%roll === 0)
				{
					return true;
				}
				else
				{
					return false;
				}
			},
			setActionState:  function() {
				// rollDice
				var roll = rollDice(10,1);

				// 4/10 chances to attack
				if(10%roll === 0)
				{
					this.actionState = 'attack';
				}
				else
				{
					this.actionState = 'defend';
				}
			}
		};
	}
	else if (theCharacter === "imperial guard")
	{
		opponent =  {
			id: 206,
			actionState: "neutral",
			characterClass: "Emperor's Personal Guard",
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
				return (rollDice(20,1) + this.dexterity + this.defend);
			},
			getCounterAttackPower: function() {
				return (rollDice(20,1) + this.dexterity);
			},
			counterAttackRoll: function() {
				var roll = rollDice(4,1);
				
				if(4%roll === 0)
				{
					return true;
				}
				else
				{
					return false;
				}
			},
			setActionState:  function() {
				// rollDice
				var roll = rollDice(6,1);

				// 4/6 chances to attack
				if(6%roll === 0)
				{
					this.actionState = 'attack';
				}
				else
				{
					this.actionState = 'defend';
				}
			}
		};
	}
	else if (theCharacter === "greedo")
	{
		opponent =  {
			id: 205,
			actionState: "neutral",
			characterClass: "Bounty Hunter",
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
				return (rollDice(20,1) + this.dexterity + this.defend);
			},
			getCounterAttackPower: function() {
				return (rollDice(20,1) + this.dexterity);
			},
			counterAttackRoll: function() {
				var roll = rollDice(20,1);
				
				if(20%roll === 0)
				{
					return true;
				}
				else
				{
					return false;
				}
			},
			setActionState:  function() {
				// rollDice
				var roll = rollDice(10,1);

				// 4/10 chances to attack, becasue greedo doesn't shoot first
				if(10%roll === 0)
				{
					this.actionState = 'attack';
				}
				else
				{
					this.actionState = 'defend';
				}
			}

		};
	}
	else if (theCharacter === "bossk")
	{
		opponent =  {
			id: 204,
			actionState: "neutral",
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
				return (rollDice(20,1) + this.dexterity + this.defend);
			},
			getCounterAttackPower: function() {
				return (rollDice(20,1) + this.dexterity);
			},
			counterAttackRoll: function() {
				var roll = rollDice(4,1);
				
				if(4%roll === 0)
				{
					return true;
				}
				else
				{
					return false;
				}
			},
			setActionState:  function() {
				// rollDice
				var roll = rollDice(6,1);

				// 4/6 chances to attack
				if(6%roll === 0)
				{
					this.actionState = 'attack';
				}
				else
				{
					this.actionState = 'defend';
				}
			}
		};
	}
	else if (theCharacter === "ig-88")
	{ 
		opponent =  {
			id: 203,
			actionState: "neutral",
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
				return (rollDice(20,1) + this.dexterity + this.defend);
			},
			getCounterAttackPower: function() {
				return (rollDice(20,1) + this.dexterity);
			},
			counterAttackRoll: function() {
				var roll = rollDice(4,1);
				
				if(4%roll === 0)
				{
					return true;
				}
				else
				{
					return false;
				}
			},
			setActionState:  function() {
				// rollDice
				var roll = rollDice(4,1);

				// 2/4 chances to defend
				if(4%roll === 0)
				{
					this.actionState = 'defend';
				}
				else
				{
					this.actionState = 'attack';
				}
			}
		};
	}
	else if (theCharacter === "boba fett")
	{ 
		opponent =  {
			id: 202,
			actionState: "neutral",
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
				return (rollDice(20,1) + this.dexterity + this.defend);
			},
			getCounterAttackPower: function() {
				return (rollDice(20,1) + this.dexterity);
			},
			counterAttackRoll: function() {
				var roll = rollDice(6,1);
				
				if(6%roll === 0)
				{
					return true;
				}
				else
				{
					return false;
				}
			},
			setActionState:  function() {
				// rollDice
				var roll = rollDice(12,1);

				// 5/12 chance to attack
				if(12%roll === 0)
				{
					this.actionState = 'attack';
				}
				else
				{
					this.actionState = 'defend';
				}
			}
		};
	}
	else if (theCharacter === "darth vader")
	{ 
		opponent =  {
			id: 201,
			actionState: "neutral",
			characterClass: "Sith Lord",
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
				return (rollDice(20,1) + this.dexterity + this.defend);
			},
			getCounterAttackPower: function() {
				return (rollDice(20,1) + this.dexterity);
			},
			counterAttackRoll: function() {
				var roll = rollDice(12,1);
				
				if(12%roll === 0)
				{
					return true;
				}
				else
				{
					return false;
				}
			},
			setActionState:  function() {
				// rollDice
				var roll = rollDice(10,1);

				// 4/10 chances to attack
				if(10%roll === 0)
				{
					this.actionState = 'attack';
				}
				else
				{
					this.actionState = 'defend';
				}
			}
		};
	}
	else if (theCharacter === "emperor palpatine")
	{ 
		opponent =  {
			id: 200,
			actionState: "neutral",
			characterClass: "Sith Lord",
			name: "Emperor Palpatine",
			hp: 100,
			strength: 5,
			dexterity: 10,
			attack: 15,
			defend: 5,
			armorClass: 10,
			counterAttack: 8,
			getAttackRoll: function() {
				return (rollDice(8,3) + this.dexterity + this.attack);
			},
			getComboHits: function() {
				return rollDice(4,1);
			},
			getAttackPower: function() {
    			return (rollDice(20,1) + this.dexterity);
    		},
			getDefenseRating: function() {
				return (rollDice(10,1) + this.dexterity + this.defend);
			},
			getCounterAttackPower: function() {
				return (rollDice(20,1) + this.dexterity);
			},
			counterAttackRoll: function() {
				var roll = rollDice(4,1);
				
				if(4%roll === 0)
				{
					return true;
				}
				else
				{
					return false;
				}
			},
			setActionState:  function() {
				// rollDice
				var roll = rollDice(20,1);

				// 5/20 chances to attack
				if(20%roll === 0)
				{
					this.actionState = 'attack';
				}
				else
				{
					this.actionState = 'defend';
				}
			}
		};
	}
	else
	{
		console.log("Unexpected villain selected!");
	}

	/*
	https://darkelfdice.com/collections/7-dice-sets
	// defese probablity is higher for some characters

	d4 : % = 0, 1,4 - 50% -- equal chance
	
	d6 : % = 0, 1,2,3,6 -  4/6 -- higher chance
	
	d8 : % = 0, 1,2,4,8 - 4/8 (50%) -- equal chance
	
	d10 : % = 0, 1,2,5,10 - 4/10 -- lower chance
	
	d12 : % = 0, 1,2,3,4,6 -- 5/12, slightly less than equal chance
	
	d20 : % = 0,  1,2,4,5,10 -- 5/20 (25%), rare chance

	//https://www.calculatorsoup.com/calculators/math/fractionscomparing.php
	// 3/8 > 1/4

	*/
}

function EmptyCharacter()
{
	this.id = 0;
	this.actionState = "";
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

