/* SCRIPT BY BERNKASTEL */


module.exports = function blockflanker(dispatch) {
	
  let cid;
  let job;
  let model;
  let player;
  
  let flankerID = 67439764;
	
dispatch.hook('sLogin', 1, (event) => {
    ({cid, model} = event);
	player = event.name;
    job = (model - 10101) % 100;
});

dispatch.hook('C_START_TARGETED_SKILL', 1, {order: -9999}, (event) => {
		if(event.skill == flankerID && job == 0){
			return false;
		}
});


}