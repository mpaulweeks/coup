var _deck = require('./deck.js');
var _player = require('./player.js');

module.exports.create = function(){
	var deck = _deck.create();
	var players = [];
	var log = [];

	var addPlayer = function(user){
		var alreadyExists = false;
		players.forEach(function (p){
			alreadyExists = alreadyExists || p.user.id == user.id;
		});
		if(!alreadyExists){
			var p = _player.create(user, deck);
			players.push(p);
		}
	};

	var getPlayer = function(user_id){
		var out;
		players.forEach(function (p){
			if(p.user.id == user_id){
				out = p;
			}
		});
		return out;
	}

	var getJSON = function(){
		var p_objs = []
		players.forEach(function (p){
			p_objs.push(p.getObj());
		});
		var out = {
			players: p_objs,
			log: log,
		}
		return JSON.stringify(out);
	};

	return {
		addPlayer: addPlayer,
		getPlayer: getPlayer,
		getJSON: getJSON,
		log: log,
	};
}