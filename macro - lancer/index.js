/* SCRIPT BY BERNKASTEL */

const LANCER = 1;
const GLOBAL_LACENCY = 35
const S_P = 67120064;
const SKILL_BLOCK = 67128964;
const S_OnSl = 67139064; // shield bash / 25% speed glyph
const S_SBash = 67158964;
const S_ShCo = 67189964; //chains from block
const S_Spring = 67239964; //deb, 4th combo, 2nd shield barrage, shield bash, shield counter
const S_Spring_chain = 67239994;
const S_Wind = 67269564;
const S_ShBarrage = 67289964;
const S_ShBarrage_D = 625;
const S_ShBarrage2 = 67289965;
const S_ShBarrage2_D = 800;
const S_Lockdown = 67319264;
const S_Wallop = 67359864; //spring, deb 
const S_Deb = 67209164;
const S_Counter = 67189964
const S_SLeap = 67388964
const S_SLeap_chain = 67388965
const S_Arush = 67279064

// const SPRING_BUG_TIME = 30;
const ONSLAUGHT_BUG_TIME = 80;
const SHIELD_COUNTER_KEY = "0"; 
const SB_AUTO_ONSLAUGHT = true; //Auto onslaught if shield bash
const ONSLAUGHT_KEY = "f3"; 
const ONSLAUGHT_AUTO_CANCEL = true; //Auto block cancel onslaught
const ONSLAUGHT_AUTO_CANCEL_DELAY = "2600"; //Onslaught block cancel delay at base aspd
const SB_AUTO_SPRING = true; //Auto spring attack after SB
const SPRING_KEY = "3";
// const AGGRO_SHOUT_AUTO_CANCEL = true; //Auto cancels challenging shout
// const AGGRO_SHOUT_AUTO_CANCEL_DELAY = "1400"; 
const WALLOP_AUTO_COUNTER = false; //Auto shield counter if wallop blocks
const BLOCK_KEY = "]";
const SPRING_AUTO_CANCEL = true;
const SPRING_AUTO_CANCEL_DELAY = "900";
const DEB_AUTO_CANCEL = true;
const DEB_AUTO_CANCEL_DELAY = "720"
const LOCKDOWN_AUTO_CANCEL = true;
const LOCKDOWN_AUTO_CANCEL_DELAY = "710";
const BASIC_AUTO_CANCEL =  true;
const BASIC_AUTO_CANCEL_DELAY = "600";
const SP_WALLOP_AUTO = true;
const SP_WALLOP_AUTO_DELAY = "900";
const WALLOP_KEY = "1";
const WALLOP_AUTO_CANCEL = false;
const WALLOP_AUTO_CANCEL_DELAY = "1200";
const SB_KEY = "e";
const SB_AUTO_CANCEL = false
const SB_AUTO_CANCEL_DELAY = "200";

const SPRINGAUTOWALLOP_TIME = 900;

module.exports = function macroLancer(dispatch) {
	
  let cid;
  let job;
  let model;
  let player;
  
  let lastSkill;
  let lastEvent;
  let lastLastSkill;
  let failsafe = 0;
  let offCD = [];
  let sBashGlyph = true;
  offCD[S_Wallop] = true;  
  let myTimeout;
  let lastActionSkill = 0
  
  let SA_count = 0;
  let Auto_count = 0
  let lastData = null
  

	var colors = require('colors');
	// var gkm = require('gkm')
	// gkm.events.on('key.*', function(data) {		
		// if (this.event == "key.pressed") {
			// console.log((this.event + ' ' + data).green);
			// console.log("lastData = ", lastData)
			// console.log("data = ", data)
			// if (this.event == "key.pressed" && lastData != data) {
				// if (data == "F1") {
					// var robot17 = require("robotjs");
					// robot17.setKeyboardDelay(0)
					// robot17.keyTap(BLOCK_KEY);
					// robot17.keyTap("f1");
					// lastData = data
				// }
			// }
		// }
	// });
	
	// gkm.events.on('mouse.*', function(data) {
		// if (job == LANCER) {
			// var robot17 = require("robotjs");
			// robot17.setKeyboardDelay(0)
			// var myInterval
			// if (data == 2) {
				// console.log((this.event + ' ' + data).red);	
				// var robot17 = require("robotjs");
				// robot17.setKeyboardDelay(0)
				// robot17.keyTap(BLOCK_KEY);	
				// myInterval = setInterval(function(){robot17.keyToggle(BLOCK_KEY, "down")}, 20);
				// robot17.keyToggle(BLOCK_KEY, "down")
				// clearTimeout(myTimeout)
				// SA_count = 0
				// Auto_count = 0	
			// }
			// if (data == 3) {
				// clearInterval(myInterval)
				// console.log((this.event + ' ' + data).blue);	
				// robot17.keyToggle(BLOCK_KEY, "up")
				// clearTimeout(myTimeout)			
				
			// }
		// }
	// });	
	const ioHook = require('iohook')
	ioHook.on("mousedown", event => {
		if (job == LANCER) {			
			if (event.button  == 2) {
				console.log(event)
				// var robot17 = require("robotjs");
				// robot17.setKeyboardDelay(0)
				// myInterval = setInterval(function(){robot17.keyToggle(BLOCK_KEY, "down")}, 20);
				clearTimeout(myTimeout)
				SA_count = 0
				Auto_count = 0	
			}
		}
		
	})
	// ioHook.on("mouseup", event => {
		// if (job == LANCER) {			
			// if (event.button  == 2) {
				// console.log(event)
				// var robot17 = require("robotjs");
				// robot17.setKeyboardDelay(0)
				// robot17.keyToggle(BLOCK_KEY, "up")
			// }
		// }
		
	// })	
	
	ioHook.start()

	
	function repeater(key, trigger){
		if (key == BLOCK_KEY)
			fspoint = 2;
		else 
			fspoint = 20;
	    if(lastSkill == trigger && failsafe < fspoint){
		    failsafe++;
		    var robot17 = require("robotjs");
			robot17.setKeyboardDelay(0)
			robot17.keyTap(key);
			setTimeout(function(key, trigger){repeater(key, trigger);}, 10, key, trigger);
		}
	}
	function skillTap(skill, times) {
		var robot17 = require("robotjs");
		robot17.setKeyboardDelay(0)
		// if (skill == BLOCK_KEY) {
			// robot17.keyToggle(skill, "down")
			// setTimeout( function(){robot17.keyToggle(skill, "up")}, (10*times))
		// } else {
			for (let i = 0; i < times; i++) {
				setTimeout( function(){robot17.keyTap(skill)}, (10*i))
			// }
		}
	}
	dispatch.hook('sLogin', 1, (event) => {
		({cid, model} = event);
		player = event.name;
		job = (model - 10101) % 100;
	});


	dispatch.hook('sStartCooltimeSkill', 1, (event) => {
		if(job == LANCER) {
			// console.log("sStartCooltimeSkill " + event.skill, " cd is = ", event.cooldown)
			offCD[event.skill] = false;
			setTimeout(function(event){offCD[event.skill] = true;}, event.cooldown-50, event);
			// if (event.skill == S_SLeap || event.skill == S_SLeap_chain) {
				// console.log("superleap cd = ", event.cooldown)
			// }	
			if (event.skill == S_Arush) {
				// console.log("In arush")
				setTimeout(function(event){console.log("\007")}, (event.cooldown-50), event);
			}
		}
	});
	
	dispatch.hook('C_START_SKILL', 3, (event) => {
		if(job == LANCER) {
			// console.log("C_START_SKILL = " + event.skill);
			lastLastSkill = lastSkill;
			lastSkill = event.skill;
			lastEvent = event;			

			
			if(lastSkill == S_OnSl && ONSLAUGHT_AUTO_CANCEL){
				if(sBashGlyph){
					 failsafe = 0;
					 myTimeout = setTimeout(function(){repeater(BLOCK_KEY, S_OnSl);}, (ONSLAUGHT_AUTO_CANCEL_DELAY / aspd / 1.25));
				}
				if(!sBashGlyph){
					  failsafe = 0;
					  myTimeout = setTimeout(function(){repeater(BLOCK_KEY, S_OnSl);}, (ONSLAUGHT_AUTO_CANCEL_DELAY / aspd)); 
				}
			}
			
			if(lastSkill == S_Deb && DEB_AUTO_CANCEL){
				failsafe = 0;
				if (offCD[S_Wallop]) {
					// myTimeout = setTimeout(function(){repeater(WALLOP_KEY, S_Deb);}, (GLOBAL_LACENCY / aspd ));
				} else {				
					myTimeout = setTimeout(function(){repeater(BLOCK_KEY, S_Deb);}, (DEB_AUTO_CANCEL_DELAY / aspd ));		  
				}
			}					  	 	  			
			
			if(lastSkill == S_Wallop && WALLOP_AUTO_CANCEL){
				failsafe = 0;
				myTimeout = setTimeout(function(){repeater(BLOCK_KEY, S_Wallop);}, (WALLOP_AUTO_CANCEL_DELAY / aspd ));
			}			
				
		}
	});
	
	dispatch.hook('S_ACTION_STAGE', 3, (event) => {	
		if ((job == LANCER) && (parseInt(event.gameId) == parseInt(cid))) {

			if (lastActionSkill != event.skill) {
				clearTimeout(myTimeout)
				SA_count = 0			
				Auto_count = 0
			}
			
			lastActionSkill = event.skill	
			
			if(event.skill == S_Lockdown && LOCKDOWN_AUTO_CANCEL){
				failsafe = 0;
				myTimeout = setTimeout(function(){repeater(BLOCK_KEY, S_Lockdown);}, (LOCKDOWN_AUTO_CANCEL_DELAY / aspd ));
			}				
			if (event.skill == S_ShBarrage && SB_AUTO_CANCEL) {				
				setTimeout(function(){
							skillTap(BLOCK_KEY,1)
							skillTap(SB_KEY, 5)
						}, (SB_AUTO_CANCEL_DELAY / aspd));
			}				
			if(lastSkill == S_SBash && SB_AUTO_ONSLAUGHT){
				failsafe = 0;
				myTimeout = setTimeout(function(){repeater(ONSLAUGHT_KEY, S_SBash);}, (ONSLAUGHT_BUG_TIME / aspd)); 	
			}
			
			if (event.skill == S_ShBarrage2 && SB_AUTO_SPRING) {
				skillTap(SPRING_KEY,10)
				// setTimeout(function(){skillTap(SPRING_KEY,20)}, (GLOBAL_LACENCY / aspd));
			}			
		}
	})	
	dispatch.hook('S_ACTION_END', 2, (event) => {	
		if ((job == LANCER) && (parseInt(event.gameId) == parseInt(cid))) {
			// if (event.skill == SKILL_BLOCK)
				// console.log("S_ACTION_END_SKILL_BLOCK")
			// else
				// console.log("S_ACTION_END = " + event.skill)
		}
		
	})
	dispatch.hook('S_EACH_SKILL_RESULT', 4, (event) => {
		if ((job == LANCER) && (parseInt(event.source) == parseInt(cid))) {
			console.log("S_EACH_SKILL_RESULT_SKILL = " + event.skill);
			console.log("S_EACH_SKILL_RESULT_STAGE = " + event.stage);	
			
			if (event.skill == S_ShBarrage2 && SB_AUTO_SPRING) {
				skillTap(SPRING_KEY,10)
				// setTimeout(function(){skillTap(SPRING_KEY,20)}, (GLOBAL_LACENCY / aspd));
			}

			if (event.skill == S_Spring_chain ) {			
				SA_count++
				// console.log("SA tick = " + SA_count)
				if (SA_count >= 4 ) {					
					if (SP_WALLOP_AUTO) {
						if (offCD[S_Wallop]) {
							skillTap(WALLOP_KEY,10)
						} else if (SPRING_AUTO_CANCEL) {
							skillTap(BLOCK_KEY,1)
						}
					}	else {
						
					}
				}
			}
			
			if (event.skill == S_P && BASIC_AUTO_CANCEL && event.stage >= 2) {
				Auto_count++
				console.log(Auto_count)
				if (Auto_count >=3 ) {
						myTimeout = setTimeout(function(){skillTap(BLOCK_KEY,1)}, (GLOBAL_LACENCY / aspd));

						
				}
				
			}
			// if (event.skill == S_Counter && event.stage >= 1) {
				// skillTap(BLOCK_KEY,2)
			// }			
		}
	})	
	dispatch.hook('C_PRESS_SKILL', 1, (event) => {
		if(job == LANCER) {	
			if (event.skill == SKILL_BLOCK) {
				// console.log("SKILL_BLOCK = " + event.skill);
				clearTimeout(myTimeout)
				SA_count = 0
				Auto_count = 0				
			}
		}
	})
	dispatch.hook('S_DEFEND_SUCCESS', 1, (event)=>{
		if ((job == LANCER) && (parseInt(event.cid) == parseInt(cid)) && WALLOP_AUTO_COUNTER){
			skillTap(SHIELD_COUNTER_KEY,5)
			// console.log("S_DEFEND_SUCCESS = " + event.cid)
			// myTimeout = setTimeout(function(){ skillTap(SHIELD_COUNTER_KEY,5) }, (GLOBAL_LACENCY/aspd))	
		}
	});
	
	dispatch.hook('sPlayerStatUpdate', 8, (event) => {
		// if(!enabled) return;
		if (job == LANCER) {
			aspd = (event.attackSpeedBonus + event.attackSpeed) / event.attackSpeed;
		}
	});	
		
}


