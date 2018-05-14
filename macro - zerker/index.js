/* SCRIPT BY BERNKASTEL */

const ZERKER = 3;


const SKILL_LS =  67289464; // cPressSkill
const SKILL_LS_1 = 67289474; // cStartSkill
const SKILL_LS_2 = 67289475; // cStartSkill
const SKILL_LS_3 = 67289476; // cStartSkill
const SKILL_LS_4 = 67289477; // cStartSkill

const SKILL_VB = 67259864; // cPressSkill
const SKILL_VB_1 = 67259874; // cStartSkill
const SKILL_VB_2 = 67259875; // cStartSkill
const SKILL_VB_3 = 67259876; // cStartSkill
const SKILL_VB_4 = 67259877; // cStartSkill
const SKILL_VB_CHAIN = 67259878; // cStartSkill

const SKILL_CY = 67209964; // cPressSkill
const SKILL_CY_1 = 67209974; // cStartSkill, stage 0
const SKILL_CY_2 = 67209975; // cStartSkill, stage 0-2
const SKILL_CY_3 = 67209976; // cStartSkill, stage 0-3
const SKILL_CY_4 = 67209977; // cStartSkill, stage 0-4


const SKILL_TS = 67139964; // cPressSkill
const SKILL_TS_1 = 67139974; // cStartSkill
const SKILL_TS_2 = 67139975; // cStartSkill
const SKILL_TS_3 = 67139976; // cStartSkill
const SKILL_TS_4 = 67139977; // cStartSkill

const SKILL_LEAPING_STRIKE = 67219664;
const SKILL_EVASIVE_ROLL = 67398964; 
const SKILL_EVASIVE_SMASH_ROLL = 67349064;
const SKILL_BLOCK = 67129094;
const SKILL_RAZE = 67359764;
const SKILL_TACKLE = 67368964;
const SKILL_FEIRY = 67189494;
const SKILL_FLATTEN = 67149764;
const S_P = 67120064;

const GLOBAL_DELAY = "30"
const SKILL_FLURRY = 400501;
const BLOCK_KEY = "]";
const VB_KEY = "f6";
const FLATTEN_KEY = "3";
const RAZE_KEY = "2";
const TS_KEY = "6";
const CYC_KEY = "q";
const LS_KEY = "f3"
const TS_BLOCK_AUTO = true;
const VB_BLOCK_AUTO = true;
const VB_BLOCK_AUTO_DELAY = "420";
const CYC_BLOCK_AUTO = true;
const LS_BLOCK_AUTO = true;
const LS_BLOCK_AUTO_DELAY = "490";
const RAZE_BLOCK_AUTO = true;
const AUTO_VB = true;
const TACKLE_BLOCK_AUTO = true;
const TACKLE_BLOCK_AUTO_DELAY = "660";
const RAZE_FLATTEN_AUTO = true;
const RAZE_FLATTEN_AUTO_DELAY = "50";
const FLATTEN_BLOCK_AUTO = true;
const FLATTEN_BLOCK_AUTO_DELAY = "1080";
const BASIC_RAZE_AUTO = false;
const LEAPING_BLOCK_AUTO = false;
const LEAPING_BLOCK_AUTO_DELAY = "1600";
const TS_DELAY = "1500";
const TS_BLOCK_AUTO_DELAY = "300";
const CYC_DELAY = "1500";
const LS_DELAY = "50";
const RAZE_BLOCK_AUTO_DELAY = "300";



module.exports = function zerkMacro(dispatch) {
	
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
	offCD[SKILL_VB_CHAIN] = true;
	offCD[SKILL_CY] = true;	
	let isFlurry = false
	let TS_count = 0
	let CYC_count = 0
	let LS_count = 0

	let myTimeout;
	let CYC_tick = 0	
	let lastEachSkill = 0
	let enabled = false
	function repeater(key, trigger) {
	  if (key == BLOCK_KEY) 
		  fspoint = 5;
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

	function skillTap(skillKey, times) {
		console.log("in robot")
		var robot17 = require("robotjs");		
		robot17.setKeyboardDelay(0)
		for (let i = 1; i < times; i++) {
			setTimeout(function(){robot17.keyTap(skillKey) }, (i*30))
		}
	}	
	function tapBlock() {
		console.log("tapblock")
		var robot17 = require("robotjs");
		robot17.setKeyboardDelay(0)
		robot17.keyToggle(BLOCK_KEY, "down");
		setTimeout(function(){robot17.keyToggle(BLOCK_KEY, "up");}, 20)
	}
	
	dispatch.hook('sLogin', 1, (event) => {
		({cid, model} = event);
		playerId = event.playerId;
		player = event.name;
		job = (model - 10101) % 100;
	});


	dispatch.hook('S_ABNORMALITY_BEGIN', 2, (event) => {
		if ((job == ZERKER) && (parseInt(event.target) == parseInt(cid))) {
			// console.log("S_ABNORMALITY_BEGIN_SOURCE = " + event.source)
			// console.log("S_ABNORMALITY_BEGIN_ID = " + event.id)
			if (event.id == SKILL_FLURRY) {
				isFlurry = true
			}
		}
	})
	dispatch.hook('S_ABNORMALITY_END', 1, (event) => {
		if (job == ZERKER) {
			// console.log("S_ABNORMALITY_END = " + event.id)
			if (event.id == SKILL_FLURRY) {
				isFlurry = false
			}

		}
	})	
	dispatch.hook('S_START_COOLTIME_SKILL', 1, (event) => {
		if(job == ZERKER) {
			console.log("S_START_COOLTIME_SKILL = " + event.skill + ", cooldown = " + event.cooldown);	
			lastCDSkill = event.skill;
			offCD[event.skill] = false;		
			setTimeout(function(event){offCD[event.skill] = true;}, (event.cooldown-20), event);
			if (event.skill == SKILL_FEIRY) {
				setTimeout(function(event){console.log("\007")}, (event.cooldown-20), event);			}
		}
		
	});

	
	dispatch.hook('S_ACTION_STAGE', 3, (event) => {		
		if ((job == ZERKER) && (parseInt(event.gameId) == parseInt(cid))) {
			// console.log("S_ACTION_STAGE = " + event.skill)	
			// console.log("S_ACTION_STAGE_stage = " + event.stage)
			if (lastEachSkill != event.skill) {
				clearTimeout(myTimeout)
				LS_count = 0
				TS_count = 0
				CYC_count = 0
				CYC_tick = 0				
			}
			lastEachSkill = event.skill		
			if (event.skill == SKILL_TS && event.stage == 3) {	
				console.log("S_ACTION_STAGE = TS")	
				console.log("S_ACTION_STAGE_stage = " + event.stage)
				if (isFlurry)
					myTimeout = setTimeout(function(){
									var robot17 = require("robotjs");
									robot17.setKeyboardDelay(0)
									robot17.keyToggle(TS_KEY, "up");
								}, (TS_DELAY * 0.90) /aspd)
				else 
					myTimeout = setTimeout(function(){
									var robot17 = require("robotjs");
									robot17.setKeyboardDelay(0)
									robot17.keyToggle(TS_KEY, "up");
								}, (TS_DELAY) /aspd)	
			}
			if (event.skill == SKILL_CY && event.stage == 3) {
				console.log("S_ACTION_STAGE = CYC")	
				console.log("S_ACTION_STAGE_stage = " + event.stage)
				if (isFlurry)
					myTimeout = setTimeout(function(){
									var robot17 = require("robotjs");
									robot17.keyToggle(CYC_KEY, "up");
									robot17.setKeyboardDelay(0)
								}, (CYC_DELAY*0.85)/aspd)
				else
					myTimeout = setTimeout(function(){
								var robot17 = require("robotjs");
								robot17.setKeyboardDelay(0)
								robot17.keyToggle(CYC_KEY, "up");
							}, (CYC_DELAY*0.01)/aspd)

			}	
			if (event.skill == SKILL_LS && event.stage == 3) {
				console.log("S_ACTION_STAGE = LS")	
				console.log("S_ACTION_STAGE_stage = " + event.stage)
				if (isFlurry)
					myTimeout = setTimeout(function(){
									var robot17 = require("robotjs");
									robot17.setKeyboardDelay(0)
									robot17.keyToggle(LS_KEY, "up");
								}, (LS_DELAY*2)/aspd)						
				else	
					myTimeout = setTimeout(function(){
									var robot17 = require("robotjs");
									robot17.setKeyboardDelay(0)
									robot17.keyToggle(LS_KEY, "up");
								}, LS_DELAY*2/aspd)
			}
		}
	})
	dispatch.hook('S_ACTION_END', 2, (event) => {
		if ((job == ZERKER) && (parseInt(event.gameId) == parseInt(cid))) {
			// console.log("S_ACTION_END = " + event.skill)			
			// if ((event.skill == SKILL_TS_1)||(event.skill == SKILL_TS_2)||(event.skill == SKILL_TS_3)||(event.skill == SKILL_TS_4)) {
				// console.log("S_ACTION_END = " + event.skill)
				// console.log("TS_count = " + TS_count)					
			
			// }
			// if ((event.skill == SKILL_CY_1)||(event.skill == SKILL_CY_2)||(event.skill == SKILL_CY_3)||(event.skill == SKILL_CY_4)) {
				// console.log("S_ACTION_END = " + event.skill)
				// console.log("CYC_count = " + CYC_count)				

			// }
			// if ((event.skill == SKILL_LS_1)||(event.skill == SKILL_LS_2)||(event.skill == SKILL_LS_3)||(event.skill == SKILL_LS_4)) {
				// console.log("S_ACTION_END = " + event.skill)
				// console.log("LS_count = " + CYC_count)				

			// }
			// if (event.skill == SKILL_LEAPING_STRIKE && LEAPING_BLOCK_AUTO) {
				// console.log("Skill LEAPING");
				// var robot17 = require("robotjs");
				// robot17.setKeyboardDelay(0)				
				// robot17.keyToggle(BLOCK_KEY,"up");				
			// }			
		}
	})	
	
	dispatch.hook('C_START_SKILL', 3, (event) => {
		if(job == ZERKER) {
			console.log("C_START_SKILL = " + event.skill)
			lastLastSkill = lastSkill;
			lastSkill = event.skill;
			lastEvent = event;
			

			if((lastSkill == SKILL_TS_1 || lastSkill == SKILL_TS_2 || lastSkill == SKILL_TS_3 || lastSkill == SKILL_TS_4) && AUTO_VB && offCD[SKILL_VB_CHAIN] && !offCD[SKILL_CY]) {
				// console.log("TS - VS-Auto");
				skillTap(VB_KEY, 16)
				
			};	
		
			

			if (lastSkill == SKILL_RAZE && RAZE_BLOCK_AUTO && enabled) {
				console.log("RAZE_BLOCK_AUTO")
				failsafe = 0;
				myTimeout = setTimeout(function(){ repeater(BLOCK_KEY, SKILL_RAZE);}, RAZE_BLOCK_AUTO_DELAY / aspd);	
			}

	
			if(lastSkill == S_P && BASIC_RAZE_AUTO) {
				failsafe = 0;
				repeater(RAZE_KEY, lastSkill);
			};
			
			if(lastSkill == SKILL_TACKLE && TACKLE_BLOCK_AUTO) {
				failsafe = 0;
				// console.log("Skill Tackle");
				myTimeout = setTimeout(function(){ repeater(BLOCK_KEY, SKILL_TACKLE);}, TACKLE_BLOCK_AUTO_DELAY / aspd);	
			};		

			if(lastSkill == SKILL_FLATTEN && FLATTEN_BLOCK_AUTO) {
				failsafe = 0;
				// console.log("Skill Flatten block");
				myTimeout = setTimeout(function(){ repeater(BLOCK_KEY, SKILL_FLATTEN);}, FLATTEN_BLOCK_AUTO_DELAY / aspd);	
			};			

			if (lastSkill == SKILL_LEAPING_STRIKE && LEAPING_BLOCK_AUTO) {
				failsafe = 0;
				// console.log("Skill LEAPING");
				var robot17 = require("robotjs");
				robot17.setKeyboardDelay(0)
				robot17.keyToggle(BLOCK_KEY,"down");				
				// setTimeout(function(){ repeater(BLOCK_KEY, SKILL_LEAPING_STRIKE);}, LEAPING_BLOCK_AUTO_DELAY / aspd);
			}
			if (event.skill == SKILL_EVASIVE_SMASH_ROLL) {
				// console.log("SKILL_EVASIVE_SMASH_ROLL = " + event.skill);
				clearTimeout(myTimeout)
				LS_count = 0
				TS_count = 0
				CYC_count = 0
				CYC_tick = 0

			}
		}

	});

	dispatch.hook('C_PRESS_SKILL', 1, (event) => {
		if (job == ZERKER) {
			// console.log("C_PRESS_SKILL = " + event.skill);
			if (event.skill == SKILL_BLOCK) {
				console.log("SKILL_BLOCK" );
				clearTimeout(myTimeout)
				LS_count = 0
				TS_count = 0
				CYC_count = 0
				CYC_tick = 0
			}
		}
		
	});

	dispatch.hook('S_EACH_SKILL_RESULT', 4, (event) => {
		if (job == ZERKER && (parseInt(event.source) == parseInt(cid))) {
			console.log("S_EACH_SKILL_RESULT_SKILL = " + event.skill);
			// console.log("S_EACH_SKILL_RESULT_DAMAGE = " + event.damage);
		
			if (event.skill == SKILL_CY_4) {
				CYC_tick++
				console.log("CYC_tick = " + CYC_tick) 
				if (CYC_tick == 5 || offCD[SKILL_TS]) {
					tapBlock()
				}					
			}
			if (event.skill == SKILL_VB_CHAIN && VB_BLOCK_AUTO) {
				myTimeout = setTimeout(	tapBlock, VB_BLOCK_AUTO_DELAY/aspd)
			}
			if (event.skill == SKILL_LS_4 && LS_BLOCK_AUTO) {
				myTimeout = setTimeout(	function () {tapBlock(); }, (LS_BLOCK_AUTO_DELAY/aspd))
			}
			if (event.skill == SKILL_TS_4 && offCD[SKILL_CY]) {
				console.log("TS autoblock")
				myTimeout = setTimeout(	tapBlock, TS_BLOCK_AUTO_DELAY/aspd)
			}
			if (event.skill == SKILL_RAZE && RAZE_FLATTEN_AUTO && !enabled) {
				console.log("RAZE_FLATTTEN")
				skillTap(FLATTEN_KEY, 16)
			};			
		}
	})
	dispatch.hook('sPlayerStatUpdate', 8, (event) => {
	// if(!enabled) return;
		if (job == ZERKER) {
			aspd = (event.attackSpeedBonus + event.attackSpeed) / event.attackSpeed;
		}

	});		
	dispatch.hook('C_CHAT', 1, event => {
		if(/^<FONT>!zerkslay<\/FONT>$/i.test(event.message)) {
			if(enabled = !enabled) {
				message(' Slaying zerk set up.')
			}
			else {
				message(' Normal zerk set up.')
			}
				
			return false
		}
	})
	
	function message(msg) {
		dispatch.toClient('S_CHAT', 1, {
			channel: 24,
			authorID: 0,
			unk1: 0,
			gm: 0,
			unk2: 0,
			authorName: '',
			message: '(Proxy)' + msg
		})
	}	
		
}



