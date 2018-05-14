const GLOBAL_DELAY = "30"
const ROB_AUTO = true;
const ROB_KEY = "1";
const ROB_AUTO_CANCEL = true;
const ROB_AUTO_CANCEL_DELAY = '1550';
const BLOCK_KEY = "]"
const SCYTHE_AUTO_CANCEL = true;
const SCYTHE_AUTO_CANCEL_DELAY = '30';
const SCYTHE_AUTO = false;
const SCYTHE_AUTO_DELAY = '50';
const SCYTHE_KEY = "q";
const BD_AUTO_CANCEL = true;
const BD_AUTO_CANCEL_DELAY = '30';
const RF_AUTO_CANCEL = true;
const RF_AUTO_CANCEL_DELAY = '250'
const RF_AUTO_BD = true
const RF_AUTO_BD_DELAY = "200"
const CS_AUTO_BD = true;
const CS_AUTO_BD_DELAY = "100"
const WARRIOR = 0;
const BD_KEY = "3";
const RF_KEY = "2";
const PB_AUTO_CANCEL = true;
const PB_AUTO_CANCEL_DELAY = "100";

// Warrior Skills
const SKILL_RISING_FURY_1 = 67299964;
const SKILL_RISING_FURY_1_DURATION = 840;
const SKILL_RISING_FURY_2 = 67299965;
const SKILL_RISING_FURY_2_DURATION = 1615;
const SKILL_COMBATIVE_STRIKE = 67289965;
const SKILL_COMBATIVE_STRIKE_2 = 67289966;
const SKILL_COMBATIVE_STRIKE_DURATION = 1275;
const SKILL_TOB = 67139164;
const SKILL_TOB_DURATION = 1890;
const SKILL_BD = 67399764;
const SKILL_BD_2 = 67399794;
const SKILL_BD_3 = 67478964;
const SKILL_BD_4 = 67478994;
const SKILL_BD_DURATION = 3555; //1600 SPEED
const SKILL_TC = 67389864;
const SKILL_TC_2 = 67389894;
const SKILL_TC_DURATION = 2380; //3240 CHAIN
const SKILL_PB = 67219964;
const SKILL_ROB = 67149764;
const SKILL_ROB_2 = 67149794;
const SKILL_ROB_3 = 67468964;
const SKILL_ROB_4 = 67468994;
const SKILL_ROB_DURATION = 3020;
const SKILL_SCYTHE = 67409764;
const SKILL_SCYTHE_2 = 67409794;
const SKILL_SCYTHE_3 = 67488964;
const SKILL_SCYTHE_4 = 67488994;
const SKILL_SCYTHE_DURATION = 2180;
const SKILL_DEADLY_GAMBLE = 67309064;
const SKILL_BLOCK = 67428964;
const SKILL_CHARGING = 67269864;
const SKILL_CHARGING_DURATION = 1100;
const SKILL_CHARGING_2 = 67269865;


const S_P = 67120064;
const S_P2 = 67120065;
const S_P3 = 67120066;
const S_P4 = 67120067;
const S_P_D = 640;
const S_P2_D = 800;
const S_P3_D = 800;
const S_P4_D = 1110;

const SKILL_LEAPING = 67229664;
const SKILL_LEAPING_DURATION = 1820;
const SKILL_ROLL = 67128964;
const SKILL_ROLL_DURATION = 980;
const SKILL_TRAVERSE_DS = 67498964;

module.exports = function macroWarrior(dispatch) {
	
	let cid;
	let job;
	let model;
	let player;
	let playerId;

	let lastSkill;
	let lastCDSkill;
	let lastLastSkill;
	let lastEvent;
	let failsafe = 0;
	let fspoint = 3;
	let offCD = [];
	offCD[SKILL_BD] = true
	let isDG = false
	let lastActionSkill = 0
	let BD_count = 0;
	let myTimeout;
	let full_edge = false
	
	
	function repeater(key, trigger) {
	  if (key == BLOCK_KEY) 
		  fspoint = 3;
	  else
		  fspoint = 40;
	
	  if(lastSkill == trigger && failsafe < fspoint){
		  failsafe++;
		  var robot17 = require("robotjs");
		  robot17.setKeyboardDelay(0)		  
		  robot17.keyTap(key);
		  setTimeout(function(key, trigger){repeater(key, trigger);}, 10, key, trigger);
	  }
	}  
	
	function tapSkill(skill_key) {
		console.log("skillTap = " + skill_key)
		var robot17 = require("robotjs")
		robot17.setKeyboardDelay(0)
		robot17.keyTap(skill_key)
		
	}
	
	dispatch.hook('sLogin', 1, (event) => {
		({cid, model} = event);
		playerId = event.playerId;
		player = event.name;
		job = (model - 10101) % 100;
		// console.log("cid = " + cid) 
		// console.log("====================================")
	});


	dispatch.hook('S_ABNORMALITY_BEGIN', 2, (event) => {
		if ((job == WARRIOR) && (parseInt(event.target) == parseInt(cid))) {
			// console.log("S_ABNORMALITY_BEGIN_TARGET = " + event.target)
			// console.log("S_ABNORMALITY_BEGIN_SOURCE = " + event.source)
		}
	})
	dispatch.hook('S_ABNORMALITY_END', 1, (event) => {
		if (job == WARRIOR) {
			// console.log("S_ABNORMALITY_END = " + event.id)

		}
	})	
	dispatch.hook('S_START_COOLTIME_SKILL', 1, (event) => {
		if(job == WARRIOR) {
			if (event.skill == SKILL_BD) {
				// console.log("S_START_COOLTIME_SKILL = BD, cooldown = " + event.cooldown);
				offCD[event.skill] = false;	
				setTimeout(function(event){offCD[event.skill] = true;}, event.cooldown, event);
			}
		}	
	});
	dispatch.hook('S_CREST_MESSAGE', 1, event => {
		if (job == WARRIOR) {
			if (event.type == 6) {
				offCD[SKILL_BD] = true;
			}
		}
	})	

	
	dispatch.hook('S_ACTION_STAGE', 3, (event) => {		
	
		if ((job == WARRIOR) && (parseInt(event.gameId) == parseInt(cid))) {
			console.log("S_ACTION_STAGE = " + event.skill)			
			if (lastActionSkill != event.skill) {
				clearTimeout(myTimeout)
				BD_count = 0			
			}
			lastActionSkill = event.skill		
		
			
		}
	})
	dispatch.hook('S_ACTION_END', 2, (event) => {
		if ((job == WARRIOR) && (parseInt(event.gameId) == parseInt(cid))) {
			// console.log("S_ACTION_END = " + event.skill)		
	
		}
	})	
	dispatch.hook('C_START_SKILL', 3, (event) => {
		if(job == WARRIOR) {
			// console.log("C_START_SKILL = " + event.skill)
			lastLastSkill = lastSkill;
			lastSkill = event.skill;
			lastEvent = event;
			
			if(lastSkill == SKILL_ROB && ROB_AUTO_CANCEL && full_edge==false){
			  failsafe = 0;
			  myTimeout = setTimeout(function(){repeater(BLOCK_KEY, SKILL_ROB);}, (ROB_AUTO_CANCEL_DELAY / aspd ));	
			}	
			// if(lastSkill == SKILL_BD && BD_AUTO_CANCEL && lastLastSkill != SKILL_BD){
			  // failsafe = 0;
			  // setTimeout(function(){repeater(BLOCK_KEY, SKILL_BD);}, (BD_AUTO_CANCEL_DELAY / aspd ));	
			// }
			// if(lastSkill == SKILL_SCYTHE && SCYTHE_AUTO_CANCEL){
			  // failsafe = 0;
			  // setTimeout(function(){repeater(BLOCK_KEY, SKILL_SCYTHE);}, (SCYTHE_AUTO_CANCEL_DELAY / aspd ));	
			// }	
		}
			if (lastSkill == SKILL_ROLL || lastSkill == SKILL_LEAPING) {
				clearTimeout(myTimeout)
			}
			if (lastSkill == SKILL_RISING_FURY_1 && RF_AUTO_CANCEL) {
				var robot17 = require("robotjs");
				robot17.setKeyboardDelay(0)		  
				robot17.keyToggle(RF_KEY, "down");
				myTimeout = setTimeout(function(){tapSkill(BLOCK_KEY)}, (RF_AUTO_CANCEL_DELAY/aspd))
			}

	});

	dispatch.hook('C_PRESS_SKILL', 1, (event) => {
		if (job == WARRIOR) {
			console.log("C_PRESS_SKILL = " + event.skill);
			if (event.skill == SKILL_BLOCK) {
				clearTimeout(myTimeout)
			}
		}
		
	});

	dispatch.hook('S_EACH_SKILL_RESULT', 4, (event) => {
		if (job == WARRIOR && (parseInt(event.source) == parseInt(cid))) {
			console.log("S_EACH_SKILL_RESULT_SKILL = " + event.skill);
			// console.log("S_EACH_SKILL_RESULT_DAMAGE = " + event.damage);
			console.log("S_EACH_SKILL_RESULT_STAGE = " + event.stage);			
			
			if ((event.skill == SKILL_BD || event.skill == SKILL_BD_2 || event.skill == SKILL_BD_3 || event.skill == SKILL_BD_4) 
				&& BD_AUTO_CANCEL) {
				if ((event.stage % 2 == 1) && full_edge==false) {
					myTimeout = setTimeout(function(){tapSkill(BLOCK_KEY)}, (BD_AUTO_CANCEL_DELAY/aspd))
				}
			}
			if(event.skill == SKILL_COMBATIVE_STRIKE_2 && ROB_AUTO){
			  failsafe = 0;
			  myTimeout = setTimeout(function(){repeater(ROB_KEY, SKILL_COMBATIVE_STRIKE_2);}, (GLOBAL_DELAY /aspd) );
			}				
			if ((event.skill == SKILL_SCYTHE || event.skill == SKILL_SCYTHE_2 || event.skill == SKILL_SCYTHE_3 || event.skill == SKILL_SCYTHE_4)
				&& SCYTHE_AUTO_CANCEL) {
				myTimeout = setTimeout(function(){tapSkill(BLOCK_KEY)}, (SCYTHE_AUTO_CANCEL_DELAY/aspd))
			}				
			if (event.skill == SKILL_CHARGING_2 && CS_AUTO_BD) {
				myTimeout = setTimeout(function(){tapSkill(BD_KEY)}, (CS_AUTO_BD_DELAY/aspd))		
			}
			if (event.skill == SKILL_PB && PB_AUTO_CANCEL && full_edge==false) {	
				myTimeout = setTimeout(function(){tapSkill(BLOCK_KEY)}, (PB_AUTO_CANCEL_DELAY/aspd))		
			}			
			if (event.skill == SKILL_RISING_FURY_2 && RF_AUTO_BD) {
				if (offCD[SKILL_BD])
					myTimeout = setTimeout(function(){tapSkill(BD_KEY)}, (RF_AUTO_BD_DELAY/aspd))
				else 
					myTimeout = setTimeout(function(){tapSkill(BLOCK_KEY)}, (150/aspd))

			}
			// if (full_edge && SCYTHE_AUTO/* && ([SKILL_BD, SKILL_BD_2, SKILL_BD_3, SKILL_BD_4, SKILL_PB, 
												   // SKILL_ROB, SKILL_ROB_2, SKILL_ROB_3, SKILL_ROB_4].indexOf(event.skill))*/) {
					// console.log("autocast Scythe")
					// tapSkill(BLOCK_KEY)
					// myTimeout = setTimeout(function(){tapSkill(SCYTHE_KEY)}, (SCYTHE_AUTO_DELAY/aspd))
				 // }

		}
	})
	dispatch.hook('S_DEFEND_SUCCESS', 1, (event)=>{
		if ((job == WARRIOR) && (parseInt(event.cid) == parseInt(cid))){
			// console.log("S_DEFEND_SUCCESS = " + event.cid)
			myTimeout = setTimeout(function(){ tapSkill(BD_KEY) }, (40/aspd))	
		}
	});	
	dispatch.hook('sPlayerStatUpdate', 8, (event) => {
		if (job == WARRIOR) {
			aspd = (event.attackSpeedBonus + event.attackSpeed) / event.attackSpeed;
			if (event.edge == 10) {				
				full_edge = true
				console.log("\007")

			} else 
				full_edge = false
		}		
		
	});		
		
}


