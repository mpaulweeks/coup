
var host = location.origin.replace(/^http/, 'ws')
console.log('host: ' + host)
var ws = new WebSocket(host);

user_id = $.cookie('user_id');
game_id = $('#game-id').val();

ws.onopen = function (event) {
	ws.send(JSON.stringify({
		header: 'start',
		user_id: user_id,
		game_id: game_id,
	})); 
};

ws.onmessage = function (event) {
	var data = JSON.parse(event.data);
	
	$('#log').html(data.log);

	function updateHand(player){
		$('#hand').html(player.hand);
	}

	function tr(raw){
		return '<tr>' + raw + '/<tr>';

	function td(raw){
		return '<td>' + raw + '/<td>';
	}

	var players_html;
	data.players.forEach(function (p){
		if(p.user.id == user_id){
			updateHand(p);
		}
		players_html += 
			tr(
				td(p.user.name)
			+ 	td(p.cash)
			+ 	td(p.hand.length)
			+ 	td(p.discard));
	});
	$('#players').html(players_html);
};

$('#draw').on('click', function(){
	ws.send(JSON.stringify({
		header: 'action',
		action: 'draw',
	}));
});