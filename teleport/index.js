const SAVE_TRIGGER_ITEM = 6561;
const TP_BACK_TRIGGER_ITEM = 6551;
const gg = { x: 52225.53125, y: 117238.3515625, z: 4356.09423828125 };
const hw = { x: 21949.31640625, y: 5738.04052734375, z: 6196.001953125 };
const ace1 = { x: 28216.755859375, y: 178408.03125, z: -1675.3272705078125 };
const ace2 = { x: 72413.1796875, y: 134155.65625, z: -502.7822570800781 };
const casta = { x: 87158.84375, y: 77415.9296875, z: 2124.31298828125 };
const cw = { x: -112662.5703125, y: -35149.35546875, z: 409.93109130859375 };
const ACE1_ID = 9032;
const ACE2_ID = 9031;
const GG_ID = 9713;
const CASTA_ID = 7004;
const CW_ID = 9777;
module.exports = function SaveTp(dispatch) {
	let cid = null;
	let currLocation = null;
	let savedLocation = null;
	let zone = null;
	let enabled = false;
	
	let userId;
	dispatch.hook('S_LOGIN', 1, (event) => {	
		cid = event.cid;
    })	

	dispatch.hook('C_PLAYER_LOCATION', 1, event => {
		currLocation = {
			x: event.x2,
			y: event.y2,
			z: event.z2
		};
	});
	
	
	dispatch.hook('S_LOAD_TOPO', 1, event => {
		if(!enabled) return	
//		console.log(event.zone);
		zone = event.zone;
		if (zone == ACE1_ID) {
			event.x = ace1.x
			event.y = ace1.y
			event.z = ace1.z
			return true
		}
		if (zone == ACE2_ID) {		
			event.x = ace2.x
			event.y = ace2.y
			event.z = ace2.z
			return true
		}	
		if (zone == GG_ID) {		
			event.x = gg.x
			event.y = gg.y
			event.z = gg.z
			return true
		}		
		if (zone == CW_ID) {		
			event.x = cw.x
			event.y = cw.y
			event.z = cw.z
			return true
		}			
		if (zone == CASTA_ID) {		
			event.x = casta.x
			event.y = casta.y
			event.z = casta.z
			return true
		}	
		if (zone == 9714) {
			dispatch.toServer('C_RESET_ALL_DUNGEON', 1, {});
		}
		
	});

	dispatch.hook('S_SPAWN_ME', 1, event => {
		if(!enabled) return	
		if (zone == ACE1_ID) {
			event.x = ace1.x
			event.y = ace1.y
			event.z = ace1.z
			return true
		}
		if (zone == ACE2_ID) {	
			event.x = ace2.x
			event.y = ace2.y
			event.z = ace2.z
			return true			
		}		
		if (zone == GG_ID) {
			event.x = gg.x
			event.y = gg.y
			event.z = gg.z
			return true
		}	
		if (zone == CW_ID) {		
			event.x = cw.x
			event.y = cw.y
			event.z = cw.z
			return true
		}		
		if (zone == CASTA_ID) {		
			event.x = 87158.84375
			event.y = 77415.9296875
			event.z = 2124.31298828125
			return true
		}
	
			
	});	
	
	
//----------------- USE ITEM TO SAVE LOCATION 

	dispatch.hook('C_USE_ITEM', 1, event => {
		if (event.item === SAVE_TRIGGER_ITEM) {
			savedLocation = currLocation;
//			console.log(savedLocation);		
			return false;
		} else if (event.item === TP_BACK_TRIGGER_ITEM) {
			dispatch.toClient('S_INSTANT_MOVE', 1, Object.assign(savedLocation, {
				id: cid
			}));
			return false;
		}
	});
	
//--------------- COMMAND TO TOGGLE THE MOD

	dispatch.hook('C_CHAT', 1, (event) => {	
		if(event.message.includes("autotele")) {
			enabled = !enabled;
			message(` Auto Teleport toggled: ${enabled}`);
			return false
		} 
		
		if(event.message.includes("tps")) {
			savedLocation = currLocation;
	//		console.log(savedLocation);
			return false
		} 
				
		if(event.message.includes("tpl")) {
			dispatch.toClient('S_INSTANT_MOVE', 1, Object.assign(savedLocation, {
				id: cid
			}));
			return false
		}		
    });	
	function message(msg) {
		dispatch.toClient('S_CHAT', 1, {
			channel: 24,
			authorID: 0,
			unk1: 0,
			gm: 0,
			unk2: 0,
			authorName: '',
			message: '(proxy)' + msg
		})
	}	

}