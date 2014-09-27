var _deck = require('./deck.js');
var _player = require('./player.js');

function get(){
	var deck = _deck.create();

	var players = [];

	var addPlayer = function(user){
		var p = _player.create(user);
		players.push(p);
	};

	var getJSON = function(){
		var out = []
		players.forEach(function (p){
			out.push(p);
		});
		return out;
	};

	return {
		addPlayer: addPlayer,
		getJSON: getJSON,
	};
}