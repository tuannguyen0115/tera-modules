module.exports = function Soulbind(dispatch) {
	let gameId = null
	
	dispatch.hook('S_LOGIN', 9, event => { ({gameId} = event) })
	
	dispatch.hook('C_BIND_ITEM_BEGIN_PROGRESS', 1, event => {
		dispatch.toServer('C_BIND_ITEM_EXECUTE', 1, { contractId: event.contractId })

		process.nextTick(() => {
			dispatch.toClient('S_CANCEL_CONTRACT', 1, {
				senderId: event.gameId,
				recipientId: 0,
				type: 32,
				id: event.contractId
			})
		})
	})
		
	dispatch.hook('C_BIND_ITEM_EXECUTE', 'raw', () => false)
}
