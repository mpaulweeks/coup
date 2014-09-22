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

	var listeners = function(){
		// index
		$('#lobby').on('click', function(e){
			var name = $('#user-name').val();
			$.ajax({
				url: '/user/create',
				type: 'POST',
				data: {
					'user_name': name,
				}
			}).done(function(data){
				$.cookie("user_id", data.user_id, { expires : 1 });
				$container.html(data.html);
				listeners();
			});
		});

		// lobby
		$('#create-lobby').on('click', function(e){
			var lobby_name = $('#lobby-name').val();
			$.ajax({
				url: '/lobby/create',
				type: 'POST',
				data: {
					'lobby_name': lobby_name,
					'user_id': get_user_id(),
				}
			}).done(function(data){				
				window.location.href = '/lobby/' + data.lobby_id;
			});
		});
	};
	listeners();
});