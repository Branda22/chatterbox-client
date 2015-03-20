$(document).ready(function(){
	$("form #message").keydown(function(event){
		//event.preventDefault();
		if (event.keyCode === 13 ){
			event.preventDefault();
			var msg = {};
			msg.username = window.location.search.slice(10);
			msg.text = $("#message").val();
			msg.roomname = $("#roomname").val();
			app.addMessage(msg);
			$("#message").val('');
			$("#roomname").val('');	
		}
	});

	$("select").change(function(event){
		app.room = $(this).val();
		$("#chatName").text(app.room);
		$("#chats").children().remove();
		app.fetch();
	});

});