var _deck = require('./deck.js');
var _player = require('./player.js');

module.exports.create = function(){
	var deck = _deck.create();
	var players = [];
	var log = [];
	var admin_id;

	var addPlayer = function(user){		
		var alreadyExists = false;
		players.forEach(function (p){
			alreadyExists = alreadyExists || p.user.id == user.id;
		});
		if(!alreadyExists){
			if(players.length == 0){
				admin_id = user.id;
			}
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
			admin_id: admin_id,
			log: log,
		}
		return JSON.stringify(out);
	};

	var reset = function(){
		// keep same admin and log
		var new_deck = _deck.create();
		var new_players = [];
		players.forEach(function (p){
			var new_p = _player.create(p.user, new_deck);
			new_players.push(new_p);
		});
		deck = new_deck;
		players = new_players;
	}

	var kick = function(user_name){
		for(var i = 0; i < players.length; i++){
			var p = players[i];
			if(p.user.name == user_name){
				players.splice(i, 1);
				return;
			}
		}
	}

	var isAdmin = function(user_id){
		return user_id == admin_id;
	}

	return {
		addPlayer: addPlayer,
		getPlayer: getPlayer,
		getJSON: getJSON,
		reset: reset,
		kick: kick,
		isAdmin: isAdmin,
		log: log,
	};
}