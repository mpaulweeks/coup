
module.exports.create = function(user, deck){
	var cash = 0;
	var hand = [];
	var discard = [];

	var addCash = function(amount){
		cash += Number(amount);
		return cash;
	};

	var draw = function(){
		hand.push(deck.draw());
	};

	var returnToDeck = function(card_type){
		for(var i = 0; i < hand.length; i ++){
			var card = hand[i];
			if(card.type == card_type){
				deck.insert(card);
				hand.splice(i, 1);
				return card;
			}
		}
	}

	var discard = function(card_type){
		for(var i = 0; i < hand.length; i++){
			var card = hand[i];
			if(card.type == card_type){
				hand.splice(i, 1);
				discard.push(card);
				return card;
			}
		}
	}

	var getObj = function(){
		return {
			user: user,
			cash: cash,
			hand: hand,
			discard: discard,
		}
	};

	//init
	cash = 2;
	draw();
	draw();

	return {
		user: user,
		addCash: addCash,
		draw: draw,
		returnToDeck: returnToDeck,
		discard: discard,
		getObj: getObj,
	};
}