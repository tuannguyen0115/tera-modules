/**
 * Version: 0.1.3
 * Made by Loggeru
 */

const LAIN_ID = 80081,                          // Lein's Dark Root Beer ID
    DELAY = 200,                                // How much time in miliseconds should wait after buff (seconds * 1000)
    NOTIFICATIONS = true;                       // true - Activates notification when you drink / false - Deactivates

/**
 * DON'T CHANGE ANYTHING BELOW THIS LINE
 */

const skills = require('./skills'),
    Command = require('command');

module.exports = function LetMeDrink(dispatch) {
    const command = Command(dispatch);

    let enabled = true,
        oCid = null,
        oJob = null,
        oX = null,
        oY = null,
        oZ = null,
        oW = null,
        qtdDrink = 0,
        idDrink = null,
        isCdDrink = false,
        getInfoCommand = false;

    command.add('letmedrink', () => {
        enabled = !enabled;
        let txt = (enabled) ? 'ENABLED' : 'DISABLED';
        message('Let me Drink is ' + txt, true);
    });


    dispatch.hook('S_LOGIN', 2, (event) => {
        oCid = event.cid;
        oJob = (event.model - 10101) % 100;
    });

    dispatch.hook('C_PLAYER_LOCATION', 1, { order: -10 }, (event) => {
        oX = (event.x1 + event.x2) / 2;
        oY = (event.y1 + event.y2) / 2;
        oZ = (event.z1 + event.z2) / 2;
        oW = event.w;
    });

    dispatch.hook('S_INVEN', 5, { order: -10 }, (event) => {
        if (!enabled) return;

        let tempInv = event.items;
        for (i = 0; i < tempInv.length; i++) {
            if (tempInv[i].item == LAIN_ID) {
                qtdDrink = tempInv[i].amount;
                idDrink = tempInv[i].uid.low;
                break;
            }
        }
    });


	dispatch.hook('S_ABNORMALITY_BEGIN', 2, (event) => {
		if (parseInt(event.target) == parseInt(oCid) && enabled) {
			if (event.id == 6002 || event.id == 6004) 
				useItem()
		}
	})
	
    function useItem() {
        setTimeout(function () {
            dispatch.toServer('C_USE_ITEM', 1, {
                ownerId: oCid,
                item: LAIN_ID,
                id: idDrink,
                unk1: 0,
                unk2: 0,
                unk3: 0,
                unk4: 1,
                unk5: 0,
                unk6: 0,
                unk7: 0,
                x: oX,
                y: oY,
                z: oZ,
                w: oW,
                unk8: 0,
                unk9: 0,
                unk10: 0,
                unk11: 1
            });
            isCdDrink = true;
            qtdDrink--;
            if (NOTIFICATIONS) message('You drank your beer, still have ' + qtdDrink + ' more.', true);
            setTimeout(function () { isCdDrink = false; }, 60000);
        }, DELAY);
    }

    function message(msg, chat = false) {
        if (chat == true) {
            command.message('(Let Me Drink) ' + msg);
        } else {
            console.log('(Let Me Drink) ' + msg);
        }
    }
}