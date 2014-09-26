$(document).on('ready', function(){
	function redirect(){
		window.location.href = '/signin';		
	}

	var user_id = $.cookie("user_id");
	var user_name = $.cookie("user_name");

	if(!user_id || !user_name){
		redirect();
	} else {
		$('#user-name').html(' ' + user_name);

		// double check this is a valid user
		$.ajax({
			url: '/user/assert',
			type: 'POST',
			data: {
				'user_id': user_id,
				'user_name': user_name,
			}
		}).done(function (data){
			$.cookie('user_id', data.user_id, { expires: 1 });
			$.cookie('user_name', data.user_name, { expires: 1 });
			console.log('assered');
		});
	}
});