var _deck = require('./deck.js');
var _player = require('./player.js');

module.exports.create = function(){
	var deck = _deck.create();

	var players = [];

	var addPlayer = function(user){
		var p = _player.create(user, deck);
		players.push(p);
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
		var out = []
		players.forEach(function (p){
			out.push(p.getObj());
		});
		return JSON.stringify(out);
	};

	return {
		addPlayer: addPlayer,
		getPlayer: getPlayer,
		getJSON: getJSON,
	};
}