module.exports = [
	//Flurry of Blows
	{
		type: 'expiring',
		target: 'Self',
		abnormalities: 400501,
		message: '{icon} {duration}',
		time_remaining:  [1,2,3,4,5]
		
	}
,
	//Unleash
	{
        type: 'Expiring',
		target: 'Self',
        abnormalities: 401705, 
        message: '{icon} {duration} ',
		time_remaining: [1,2,3,4,5]
    }
,
	//Lethal strike 
	{
		type: 'Reset',
		skills: 180600, 
		message: '{icon} Lethal Strike Reset'
	}
,
	//Cyclone 
	{
		type: 'Reset',
		skills: 101110, 
		message: 'Cyclone Reset'
	}
	
]