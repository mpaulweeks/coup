AMBASSADOR = 1
ASSASSIN = 2
CAPTAIN = 3
CONTESSA = 4
DUKE = 5

function getName(type){
	switch(type) {
		case AMBASSADOR:
			return 'Ambassador';
		case ASSASSIN:
			return 'Assassin';
		case CAPTAIN:
			return 'Captain';
		case CONTESSA:
			return 'Contessa';
		case DUKE:
			return 'Duke';
		default:
			return 'Unknown';
	}
}

module.exports.getTypes = function(){
	return [AMBASSADOR,ASSASSIN,CAPTAIN,CONTESSA,DUKE];
}

module.exports.get = function(type){
	return {
		type: type,
		name: getName(type),
	}
}