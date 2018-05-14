module.exports = [
	// Mana Aura
	{
		type: 'MissingDuringCombat',
		target: 'Self',
		abnormalities: [700330, 700300],
		message: "Missing Mana Aura",
		rewarn_timeout: 10
	},

	// Crit Aura
	{
		type: 'MissingDuringCombat',
		target: 'Self',
		abnormalities: [700600, 700601, 700602, 700603],
		message: "Missing Crit Aura",
		rewarn_timeout: 10
	},
	
	// Endurance buff (Thrall)
	{
		type: 'MissingDuringCombat',
		target: 'Self',
		abnormalities: [27120],
		message: "Missing Thrall Endurance",
		rewarn_timeout: 10
	},

	// Endurance debuff
	{
		type: 'MissingDuringCombat',
		target: 'MyBoss',
		abnormalities: [27160, 28090],
		message: "Missing Endurance Debuff",
		rewarn_timeout: 10
	},
	
		// Contagion up soon
	{
		type: 'Expiring',
		skills: 410900,
		message: '{icon}cd {duration}',
		time_remaining: [1,2,3,4,5]
	},
		
		// Thrall of wrath up soon
	{
		type: 'Expiring',
		skills: 341600,
		message: '{icon}cd {duration}',
		time_remaining: 10
	},
	
		// Thrall of vengeance up soon
	{
		type: 'Expiring',
		skills: 331700,
		message: '{icon} cd {duration}',
		time_remaining: 2
	},
]
