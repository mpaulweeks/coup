var _card = require('./cardjs');

function getCards(){
	var out = [];
	_card.getTypes().forEach(function (type){
		out.push(_card.get(type));
		out.push(_card.get(type));
		out.push(_card.get(type));
	});
	return out;
}

module.exports.get = function(){

	var deck = getCards();

	var draw = function(){
		var index = Math.floor((Math.random() * deck.length));
		var drawn = deck.splice(index, 1)[0];
		return drawn;
	}

	var insert = function(card){
		deck.push(card);
	}

	return {
		draw: draw,
		insert: insert,
	}
}