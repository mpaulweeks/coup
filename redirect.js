$(document).on('ready', function(){
	if(!$.cookie("user_id")){
		window.location.href = '/signin';
	} else {
		$('#user-name').html($.cookie('user_name'));
	}
});