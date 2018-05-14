module.exports = function Manapotter(dispatch) {
	
	let cid = null,
		player = '',
		cooldownMp = false,
		cooldownHp = false,
		cooldownHealth = false,
		enabled,
		battleground,
		onmount,
		incontract,
		inbattleground,
		alive,
		inCombat,
		itemid
	let HPthresold = 40;
		
	// #############
	// ### Magic ###
	// #############
	
	dispatch.hook('S_LOGIN', 1, event => {
		({cid} = event)
		player = event.name
		enabled = true
	})
	
	dispatch.hook('S_START_COOLTIME_ITEM', 1, event => { 
		let item = event.item
		let thiscooldown = event.cooldown
		
		if(item == 6562) { // has 10 seconds cooldown MP pot
			cooldownMp = true
			setTimeout(() => {
				cooldownMp = false
			}, thiscooldown*1000)
		}
		if(item == 6552) { // has 10 seconds cooldown HP pot
			cooldownHp = true
			setTimeout(() => {
				cooldownHp = false
			}, thiscooldown*1000)
		}		
		if(item == 116) { // has 30 seconds cooldown Healthpot
			cooldownHealth = true
			setTimeout(() => {
				cooldownHealth = false
			}, thiscooldown*3000)
		}		
		
	})
/*	dispatch.hook('S_PLAYER_STAT_UPDATE', 4, event => {
		currentHp = event.curHp
        maxHp = event.maxHp
		currentMp = event.curMp
		maxMp = event.maxMp		
		
		if(!cooldownHp && (currentHp <= maxHp*0.7)) {
			useItem(6552)
		} else 			
		if(!cooldownHealth && (currentHp <= maxHp*0.4)) {
			useItem(116)
		}	
		if(!cooldownMp && (currentMp <= maxMp*0.6)) {
			useItem(6562)
		}		
	})
*/	
    dispatch.hook('S_CREATURE_CHANGE_HP', 2, (event) => {
        if (event.target.toString() == cid.toString()) {
            currentHp = event.curHp;
            maxHp = event.maxHp;
        }
		
		if(!cooldownHp && event.target.equals(cid) && (currentHp <= maxHp*(HPthresold/100))) {
			useItem(6552)
		}			
	/*	if(!cooldownHealth && event.target.equals(cid) && (currentHp <= maxHp*0.2)) {
			useItem(116)
		}			*/
    });	
	dispatch.hook('S_PLAYER_CHANGE_MP', 1, event => {
		currentMp = event.currentMp
		maxMp = event.maxMp
		
		if(!cooldownMp && event.target.equals(cid) && (currentMp <= maxMp*0.6)) {
			useItem(6562)
		}
	})
	
	function useItem(itemid) {
		if (!enabled) return
		if(alive && inCombat && !onmount && !incontract && !inbattleground) {
			dispatch.toServer('C_USE_ITEM', 1, {
				ownerId: cid,
				item: itemid, // 6562: Prime Replenishment Potable, 184659: Everful Nostrum
				id: 0,
				unk1: 0,
				unk2: 0,
				unk3: 0,
				unk4: 1,
				unk5: 0,
				unk6: 0,
				unk7: 0,
				x: 0, 
				y: 0, 
				z: 0, 
				w: 0, 
				unk8: 0,
				unk9: 0,
				unk10: 0,
				unk11: 1,
			})
		}
	}
	
	// ##############
	// ### Checks ###
	// ##############
	
	dispatch.hook('S_BATTLE_FIELD_ENTRANCE_INFO', 1, event => { battleground = event.zone })
	dispatch.hook('S_LOAD_TOPO', 1, event => {
		onmount = false
		incontract = false
		inbattleground = event.zone == battleground
	})
	
	dispatch.hook('S_SPAWN_ME', 1, event => { 
		alive = event.alive
	})
	
	dispatch.hook('S_USER_STATUS', 1, event => { 
		if(event.target.equals(cid)) {
			if(event.status == 1) {
				inCombat = true
			}
			else inCombat = false
		}
	})
	
	dispatch.hook('S_CREATURE_LIFE', 1, event => {
		if(event.target.equals(cid) && (alive != event.alive)) {
			if(!alive) {
				onmount = false
				incontract = false
			}
		}
	})

	dispatch.hook('S_MOUNT_VEHICLE', 1, event => { if(event.target.equals(cid)) onmount = true })
	dispatch.hook('S_UNMOUNT_VEHICLE', 1, event => { if(event.target.equals(cid)) onmount = false })

	dispatch.hook('S_REQUEST_CONTRACT', 1, event => { incontract = true })
	dispatch.hook('S_ACCEPT_CONTRACT', 1, event => { incontract = false })
	dispatch.hook('S_REJECT_CONTRACT', 1, event => { incontract = false })
	dispatch.hook('S_CANCEL_CONTRACT', 1, event => { incontract = false })
	
	// #################
	// ### Chat Hook ###
	// #################
	
	dispatch.hook('C_WHISPER', 1, (event) => {
		if(event.target.toUpperCase() === "!manapotter".toUpperCase()) {
			if (/^<FONT>on?<\/FONT>$/i.test(event.message)) {
				enabled = true
				message('Manapotter <font color="#56B4E9">enabled</font>.')
			}
			else if (/^<FONT>off?<\/FONT>$/i.test(event.message)) {
				enabled = false
				message('Manapotter <font color="#E69F00">disabled</font>.')
			}
			else message('Commands:<br>'
								+ ' "on" (enable Manapotter),<br>'
								+ ' "off" (disable Manapotter)'
						)
			return false
		}
	})
	
	function message(msg) {
		dispatch.toClient('S_WHISPER', 1, {
			player: cid,
			unk1: 0,
			gm: 0,
			unk2: 0,
			author: '!Manapotter',
			recipient: player,
			message: msg
		})
	}
	
	dispatch.hook('C_CHAT', 1, event => {
		if(/^<FONT>!mpots<\/FONT>$/i.test(event.message)) {
			if(!enabled) {
				enabled = true
				message('Manapotter <font color="#56B4E9">enabled</font>.')
				console.log('Manapotter enabled.')
			}
			else {
				enabled = false
				message('Manapotter <font color="#E69F00">disabled</font>.')
				console.log('Manapotter disabled.')
			}
			return false
		}
		if(/^<FONT>!mpots20<\/FONT>$/i.test(event.message)) {
			if(enabled) {
				message('HP thresold is set to <font color="#56B4E9">20%</font>.')
				HPthresold = 20;
			}
			return false			
		}
		if(/^<FONT>!mpots30<\/FONT>$/i.test(event.message)) {
			if(enabled) {
				message('HP thresold is set to <font color="#56B4E9">30%</font>.')
				HPthresold = 30;
			}
			return false			
		}
		if(/^<FONT>!mpots40<\/FONT>$/i.test(event.message)) {
			if(enabled) {
				message('HP thresold is set to <font color="#56B4E9">40%</font>.')
				HPthresold = 40;
			}
			return false			
		}		
	})
}