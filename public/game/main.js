
function coup(){
//begin init func

var host = location.origin.replace(/^http/, 'ws')
console.log('host: ' + host)
var ws = new WebSocket(host);

var user_id;

ws.onopen = function (event) {
	user_id = $.cookie('user_id');
	var jstr = JSON.stringify({
		header: 'start',
		user_id: user_id,
		game_id: $('#game-id').val(),
	});
	ws.send(jstr); 
};

function wrap(tag, raw){
	return '<' + tag + '>' + raw + '</' + tag + '>';
}

function updateHand(hand){
	var out = 'Empty :(';
	if(hand && hand.length > 0){
		var names = [];
		hand.forEach(function (card){
			names.push(card.name);
		});
		names.sort();
		out = names.join(', ');
	}
	$('#hand').html(out);
}

function discard(dis){
	var out = '';
	if(dis && dis.length > 0){
		var names = [];
		dis.forEach(function (card){
			names.push(card.name);
		});
		out = names.join(', ');
	}
	return wrap('td',out);
}

ws.onmessage = function (event) {
	var data = JSON.parse(event.data);
	
	if(data.log && data.log.length > 0){
		var log_out = '';
		data.log.forEach(function (line){
			log_out = wrap('p', line) + log_out;
		});
		$('#log').html(log_out);			
	}

	var players_html;
	data.players.forEach(function (p){
		if(p.user.id == user_id){
			updateHand(p.hand);
		}
		players_html += 
			wrap('tr',
				wrap('td', p.user.name)
			+ 	wrap('td', p.cash)
			+ 	wrap('td', p.hand.length)
			+ 	discard(p.discard));
	});
	$('#players').html(players_html);
};

$('#draw').on('click', function(){
	var jstr = JSON.stringify({
		header: 'action',
		action: 'draw',
	});
	console.log(jstr);
	ws.send(jstr);
});

$('.cash-add').on('click', function(){
	var value = $(this).val();
	var jstr = JSON.stringify({
		header: 'action',
		action: 'cash',
		value: value,
	});
	console.log(jstr);
	ws.send(jstr);
});

//end init func
}