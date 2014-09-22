$(document).on('ready', function(){
	var host = location.origin.replace(/^http/, 'ws')
	console.log('host: ' + host)
	var ws = new WebSocket(host);
	var $container = $('#container');

	// butts
	$('#inc').on('click', function(e){
		ws.send('foo');
	});
	ws.onmessage = function (event) {
		$('#butts').append('<p>' + event.data + '</p>');
	}

	var get_user_id = function(){
		$.cookie("user_id");
	}
});