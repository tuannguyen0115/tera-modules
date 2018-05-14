module.exports = [
	// Triple Nemesis
	{
		type: 'MissingDuringCombat',
		target: 'MyBoss',
		abnormalities: 28090,
		message: "Missing Triple Nemesis",
		rewarn_timeout: 10
	},

	// Energy Stars
	{
		type: 'MissingDuringCombat',
		target: 'Self',
		abnormalities: [801500, 801501, 801502, 801503],
		message: "Missing {icon}",
		rewarn_timeout: 10
	},

	// Shakan
	{
		type: 'MissingDuringCombat',
		target: 'Self',
		abnormalities: [805102, 805101],
		message: "Missing {icon}",
		rewarn_timeout: 10
	},	
	
	// Divine charge up soon
	{
		type: 'Expiring',
		skills: 280200,
		message: '{icon} cd {duration}',
		time_remaining: 3
	},
		
	// Edict
	{
		type: 'Expiring',
		skills: 430100,
		message: '{icon} cd {duration}',
		time_remaining: 3
	},
]
