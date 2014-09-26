
var host = location.origin.replace(/^http/, 'ws')
console.log('host: ' + host)
var ws = new WebSocket(host);

user_id = $.cookie('user_id');
lobby_id = $('#lobby-id').val();

ws.onopen = function (event) {
	ws.send(JSON.stringify({
		type: 'open',
		user_id: user_id,
		lobby_id: lobby_id,
	})); 
};

ws.onmessage = function (event) {
	var data = JSON.parse(event.data);
	$('#messages').prepend('<p>' + data.message + '</p>');
	data.players.forEach(function (p){
		var id = p.user.id;
		$('#cash-'+id).html(p.cash);
		$('#cards-'+id).html(p.cards.length);
		$('#discard-'+id).html(p.discard);
	});
};