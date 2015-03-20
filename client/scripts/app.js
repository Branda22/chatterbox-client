
/* ------------------------------------------------------------------------------
	JQuery App Implementation
------------------------------------------------------------------------------ */

var app = {

	server: 'https://api.parse.com/1/classes/chatterbox',
	rooms: {},
	room: undefined,
	data: undefined,

	intervalID: undefined,

	init: function(){
		app.fetch();
		app.intervalID = setInterval(app.fetch, 1000);
	},

	send: function(message){
		$.ajax({
			url: app.server,
			type: 'POST',
			data: JSON.stringify(message),
			contentType: 'application/json',
			success: function(data){
				console.log('chatterbox: Message sent');
			},
			error: function(data){
				console.error('chatterbox: Failed to send message');
			}
		})
	},

	fetch: function(){
		$.ajax({
			url: app.server,
			type: 'GET',
			data: {'order': '-createdAt'},
			contentType: 'application/json',
			success: function(data){
				app.updateMessage(data, app.room);
				app.addRooms(data);
				app.callback(data);
			},
			error: function(){
				console.error('Oops, something went wrong');
			}
		}) 
	},

	callback: function(messageObj){
 		app.data = messageObj;
	},	

	clearMessages: function(){
		$("#chats").children().remove();
	},

	updateMessage: function(messageObj, roomname){ 
		var messages = messageObj.results;
		if ( !roomname ) roomname = 'lobby';
		 messages = messages.filter(function(msg){
		 	return msg.roomname === roomname;
		});
		app.clearMessages();
		for( var i = 0; i < messages.length; i++ ){
			var msg = messages[i].text;
			var user = messages[i].username;
			if ( msg && user ) {
				msg = app.safe_tags(msg);
				user = app.safe_tags(user);
			}
			$("#chats").append("<div class='message'><strong>@" + user + "</strong>: " + msg + '</div>');
		}
	},

	safe_tags: function(str){
		str = str.replace(/([^a-z0-9áéíóúñü_-\s\.,]|[\t\n\f\r\v\0])/gim,"");
		return str.trim();
	},

	addMessage: function(message){
		app.send(message);
	},

	addRooms: function(messageObj){
		var messages = messageObj.results;
		$("#roomSelect").children().remove();
		for( var i = 0; i < messages.length; i++ ){
			app.rooms[messages[i].roomname] = messages[i].roomname;
			if ( messages[i].roomname ) var room = app.safe_tags(messages[i].roomname);
		};
		for (var key in app.rooms){
			$('#roomSelect').append("<option class='clicker' id="+ app.rooms[key] +'>' + app.rooms[key] + '</option>');	
		};
	},

	addFriend: function(friend){
		$('.myFriends').append('<div>'+ friend + '</div>');
	}

};







