/* SCRIPT BY BERNKASTEL */

const SLAYER = 2;


const SKILL_EVIS = 67349764;
const SKILL_EVIS_1 = 67349794;
const SKILL_OHS = 67189864;
const SKILL_OHS_1 = 67189894;				
const SKILL_OHS_2 =	67358994;
const SKILL_MS = 67339764;
const SKILL_HT = 67229964;
const SKILL_KDS = 67129965;
const SKILL_WW = 67139964;
const SKILL_FURYS = 67269264;
const SKILL_STUNNING = 67239764;
const SKILL_STARTLING = 67259664;
const SKILL_ICB = 67309064;

const OHS_KEY = "0";
const MS_KEY = "f2";
const BACKSTEP_KEY = "c";
const EVIS_KEY = "3"

const EVIS_AUTO = true;
const HT_AUTO = true;
const HT_AUTO_DELAY = "1100";
const KDS_AUTO = true;
const KDS_AUTO_DELAY = "1170";
const WW_AUTO = true;
const WW_AUTO_DELAY = "1800";
const FURYS_AUTO = true;
const STUNNING_AUTO = true;
const STARTLING_AUTO = true;
const MS_AUTO = true;
const MS_AUTO_DELAY= "600";
const MS_EVIS_AUTO = true

const BACKSTEP_AUTO = false;
const BACKSTEP_AUTO_DELAY= "800";
const GLOBAL_DELAY = "200"
const MSbuff = "23032";


module.exports = function macroSlayer(dispatch) {
	
  let cid;
  let job;
  let model;
  let player;
  let aspd;
  
  let lastSkill;
  let lastLastSkill;
  let lastEvent;
  let failsafe = 0;
  let activeICB = false;
  let activeMSbuff= false;
  
  let OHS_offcd = true;

	function repeater(key, trigger) {
	  if(lastSkill == trigger && failsafe < 40){
		  failsafe++;
		  var robot17 = require("robotjs");
		  robot17.setKeyboardDelay(0)
		  robot17.keyTap(key);
		  setTimeout(function(key, trigger){repeater(key, trigger);}, 30, key, trigger);
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
	
	dispatch.hook('sLogin', 1, (event) => {
		({cid, model} = event);
		player = event.name;
		job = (model - 10101) % 100;
	});


    dispatch.hook('S_ABNORMALITY_BEGIN', 2, (event) => {
		 // console.log('Abnormality Begin:'+event.id+' Duration:'+event.duration+' Stacks:'+event.stacks)
		if (event.id == MSbuff)
			activeMSbuff = true;
    });	
    dispatch.hook('S_ABNORMALITY_END', 1, (event) => {
		// console.log('Abnormality End:'+event.id)
		if (event.id == MSbuff)
			activeMSbuff = false;
		
	});
	
	dispatch.hook('S_START_COOLTIME_SKILL', 1, (event) => {	
		// console.log("EVENT = " + event.skill + ", COOLDOWN = " + event.cooldown);
		if( event.skill == SKILL_ICB){
			activeICB = true;
			setTimeout(function(event){activeICB = false;}, 20000, event);
		}
		// if (event.skill == SKILL_EVIS){
			// activeMSbuff = true;
			// console.log("EVIS buff 8 sec");
			// setTimeout(function(event){activeMSbuff = false;}, 8000, event);			
		// }
		if (event.skill == SKILL_OHS || event.skill == SKILL_OHS_1 || event.skill == SKILL_OHS_2){
			// console.log("EVENT = " + event.skill + ", COOLDOWN = " + event.cooldown);
			OHS_offcd = false;
			setTimeout(function(){OHS_offcd = true;}, event.cooldown - 30);			
		}		
	});

	dispatch.hook('S_GRANT_SKILL', 1, (event) => {
		if(job == SLAYER) {	
			console.log("S_GRANT_SKILL = " + event.skill);
		}
	})
	dispatch.hook('S_CREST_MESSAGE', 2, event => {
		if (job == SLAYER) {
			if (event.type == 6 || (event.skill = SKILL_OHS || event.skill == SKILL_OHS_1 || event.skill == SKILL_OHS_2)) {
				OHS_offcd = true;
			}
		}
	})		
	
	dispatch.hook('C_START_SKILL', 3, (event) => {
		if(job == SLAYER) {	
			console.log("C_START_SKILL = " + event.skill);
			lastSkill = event.skill
			if(event.skill == SKILL_KDS && KDS_AUTO) {
				failsafe = 0;
				if (activeICB) {
					console.log("KDS_OHS")
					repeawter(OHS_KEY, SKILL_KDS);
	
				}
				else {
					console.log("KDS_EVIS")
					skillTap(EVIS_KEY, 20)				
				}
			};
			// if(event.skill == SKILL_MS && BACKSTEP_AUTO) {
				// failsafe = 0;
				// setTimeout(function(){
					// repeater(BACKSTEP_KEY, SKILL_MS);
				// }, (BACKSTEP_AUTO_DELAY / aspd));				
			// };					
		}
	});

	dispatch.hook('S_EACH_SKILL_RESULT', 4, (event) => {
		if ((job == SLAYER) && (parseInt(event.source) == parseInt(cid))) {
			console.log("S_EACH_SKILL_RESULT = " + event.skill);

			if (activeMSbuff)
				console.log("activeMSbuff = " + activeMSbuff);
			lastSkill = event.skill
			console.log("OHS_offcd = " + OHS_offcd)
			if((event.skill == SKILL_EVIS || event.skill == SKILL_EVIS_1) && EVIS_AUTO && OHS_offcd) {
				console.log("S_EACH_SKILL_RESULT_SKILL = SKILL_EVIS");
				// console.log("S_EACH_SKILL_RESULT_SKILL_stage = " + event.stage);
				// failsafe = 0;
				// repeater(OHS_KEY, SKILL_EVIS);
				skillTap(OHS_KEY, 11)

			};			
			if(event.skill == SKILL_HT && HT_AUTO) {
				console.log("S_EACH_SKILL_RESULT_SKILL = SKILL_HT");
				// console.log("S_EACH_SKILL_RESULT_SKILL_stage = " + event.stage);				
				// failsafe = 0;
				// repeater(OHS_KEY, SKILL_HT);
				skillTap(EVIS_KEY, 16)
				
			};
			if(event.skill == SKILL_KDS && KDS_AUTO) {
				console.log("S_EACH_SKILL_RESULT_SKILL = SKILL_KDS");
				// console.log("S_EACH_SKILL_RESULT_SKILL_stage = " + event.stage);				
				// failsafe = 0;
				// repeater(OHS_KEY, SKILL_WW);
				skillTap(OHS_KEY, 16)			
			}
			if(event.skill == SKILL_WW && WW_AUTO && event.stage == 1) {
				console.log("S_EACH_SKILL_RESULT_SKILL = SKILL_WW");
				// console.log("S_EACH_SKILL_RESULT_SKILL_stage = " + event.stage);				
				// failsafe = 0;
				// repeater(OHS_KEY, SKILL_WW);
				skillTap(OHS_KEY, 16)

			};	
			if(event.skill == SKILL_FURYS && FURYS_AUTO) {
				console.log("S_EACH_SKILL_RESULT_SKILL = SKILL_FURYS");
				// console.log("S_EACH_SKILL_RESULT_SKILL_stage = " + event.stage);				
				// setTimeout(function(){ skillTap(OHS_KEY) }, (GLOBAL_DELAY / aspd))
				// failsafe = 0;
				// repeater(OHS_KEY, SKILL_FURYS);				
				skillTap(OHS_KEY, 16)
			};			
			if(event.skill == SKILL_STUNNING && STUNNING_AUTO) {
				console.log("S_EACH_SKILL_RESULT_SKILL = SKILL_STUNNING");
				// console.log("S_EACH_SKILL_RESULT_SKILL_stage = " + event.stage);				
				// setTimeout(function(){ skillTap(OHS_KEY) }, (GLOBAL_DELAY / aspd))
				// failsafe = 0;
				// repeater(OHS_KEY, SKILL_STUNNING);				
				skillTap(OHS_KEY, 21)
			};
			if(event.skill == SKILL_STARTLING && STARTLING_AUTO) {
				console.log("S_EACH_SKILL_RESULT_SKILL = SKILL_STARTLING");
				// console.log("S_EACH_SKILL_RESULT_SKILL_stage = " + event.stage);				
				// setTimeout(function(){ skillTap(OHS_KEY) }, (GLOBAL_DELAY / aspd))
				// failsafe = 0;
				// repeater(OHS_KEY, SKILL_STARTLING);				
				skillTap(OHS_KEY, 16)
			};
			
			if((event.skill == SKILL_OHS || event.skill == SKILL_OHS_1 || event.skill == SKILL_OHS_2) && activeMSbuff && MS_AUTO) {
				console.log("S_EACH_SKILL_RESULT_SKILL = SKILL_OHS");
				// console.log("S_EACH_SKILL_RESULT_SKILL_stage = " + event.stage);	
				skillTap(MS_KEY, 16)
				// failsafe = 0;
				// repeater(MS_KEY, event.skill);				
		
			};		
			if((event.skill == SKILL_EVIS || event.skill == SKILL_EVIS_1) && !OHS_offcd && MS_AUTO) {
				console.log("S_EACH_SKILL_RESULT_SKILL = SKILL_EVIS_MS");
				skillTap(MS_KEY, 16)		
			};			
								
		}

	})		
	dispatch.hook('sPlayerStatUpdate', 8, (event) => {
	// if(!enabled) return;
		if (job == SLAYER) 
			aspd = (event.attackSpeedBonus + event.attackSpeed) / event.attackSpeed;

	});	
}


