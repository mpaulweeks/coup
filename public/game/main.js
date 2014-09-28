
function coup(){
//begin init func

var host = location.origin.replace(/^http/, 'ws')
console.log('host: ' + host)
var ws = new WebSocket(host);

var user_id;
var is_admin = false;

ws.onopen = function (event) {
	user_id = $.cookie('user_id');
	var jstr = JSON.stringify({
		header: 'start',
		user_id: user_id,
		game_id: $('#game-id').val(),
	});
	ws.send(jstr); 
};

function wrap(tag, raw, classes){
	var out = '<' + tag;
	if(classes){
		out += ' class="' + classes + '"';
	}
	out += '>' + raw + '</' + tag + '>';
	return out;
}

function button(classes, value, text){
	return '<button class="btn btn-default ' + classes
		 + '" value="' + value + '">' + text + '</button>';
}

function updateHand(hand){
	$('.has-card').removeClass('has-card');

	var out = 'Empty :(';
	if(hand && hand.length > 0){
		out = ''
		hand.forEach(function (card){
			var typeClass = 'card-type-' + card.type;
			$('.special-action.' + typeClass).addClass('has-card');
			var c_html = 
				wrap('div', card.name, 'card-in-hand col-md-6 ' + typeClass) +
				wrap('div',
					button('reveal', card.type, 'Reveal')
				+ 	button('shuffle', card.type, 'Shuffle')
				+ 	button('discard', card.type, 'Discard'), 'col-md-6');
			out += wrap('div', c_html, 'row');
		});
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

function setup_listeners(){
	$('.reveal').on('click', function(){
		var value = $(this).val();
		var jstr = JSON.stringify({
			header: 'action',
			action: 'revealAndReturn',
			value: value,
		});
		console.log(jstr);
		ws.send(jstr);
	});

	$('.shuffle').on('click', function(){
		var value = $(this).val();
		var jstr = JSON.stringify({
			header: 'action',
			action: 'returnToDeck',
			value: value,
		});
		console.log(jstr);
		ws.send(jstr);
	});

	$('.discard').on('click', function(){
		var value = $(this).val();
		var jstr = JSON.stringify({
			header: 'action',
			action: 'discard',
			value: value,
		});
		console.log(jstr);
		ws.send(jstr);
	});

	$(".btn").mouseup(function(){
	    $(this).blur();
	});
}

ws.onmessage = function (event) {
	var data = JSON.parse(event.data);

	console.log(data);

	is_admin = data.admin_id == user_id;
	
	if(data.log && data.log.length > 0){
		var log_out = '';
		data.log.forEach(function (line){
			log_out = wrap('p', line) + log_out;
		});
		$('#log').html(log_out);			
	}

	var kicked = true;
	var players_html;
	data.players.forEach(function (p){
		var classes = '';
		if(p.user.id == user_id){
			updateHand(p.hand);
			classes = 'current-player';
			kicked = false;
		}
		players_html += 
			wrap('tr',
				wrap('td', p.user.name)
			+ 	wrap('td', p.cash)
			+ 	wrap('td', p.hand.length)
			+ 	discard(p.discardPile),
				classes);
	});
	$('#players').html(players_html);
	if(kicked){
		window.alert("You've been kicked from the room");		
		window.location.href = '/';
		return;
	}

	if(is_admin){
		$('.admin').show();
		$('#title').hide();
	}

	setup_listeners();
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

//admin
$('#reset').on('click', function(){
	var jstr = JSON.stringify({
		header: 'action',
		action: 'reset',
	});
	console.log(jstr);
	ws.send(jstr);	
});

$('#kick :button').on('click', function(){
	console.log('kickin');
	var value = $('#kick :input').val();
	var jstr = JSON.stringify({
		header: 'action',
		action: 'kick',
		value: value,
	});
	console.log(jstr);
	ws.send(jstr);
});

$('.admin').hide();

//end init func
}