/*
*
* Global var
*
*/

// ---- Serveur vars
var http = require('http');
var fs = require('fs');


// ---- Glob vars
var usernames = {}; // usernames which are currently connected to the chat
var rooms = []; //rooms in server



/*
*
* load the client html
*
*/
var server = http.createServer(function(req, res) {
	fs.readFile('./index.html', 'utf-8', function(error, content) {
		res.writeHead(200, {"Content-Type": "text/html"});
		res.end(content);
	});
});

/*
*
* load socket io
*
*/
var io = require('/Users/jerome 1/node_modules/socket.io').listen(server);

/*
*
* server listener
*
*/
server.listen(8890);


/*
*
* socket connection
*
*/
io.on('connection', function (socket) {

	console.log("new client connected");

	// when the client emits 'adduser', this listens and executes
	socket.on('adduser', function(username){
	// store the username in the socket session for this client
	socket.username = username;
	console.log("username:", username);

	if(username in usernames)
	{
		console.log("username already used");
		socket.emit('change_username');
	}
	else
		usernames[username] = username; // add the client's username to the global list

	//informe qu'un utilisateur vient de se connecter
	io.sockets.emit('user-list', usernames); 

	//informe qu'un utilisateur vient de se connecter
	socket.broadcast.emit('user-logged', socket.username);

});


/*
*
* Change the socket username
*
* @parameter:
* - new_username : String Object
*/
socket.on('change_username', function(new_username){

	if(new_username in usernames )
	{
		console.log("username already used");
		socket.emit('change_username');
	}
	else
	{
		if(socket.username)
			usernames[socket.username] = new_username;
		else
			usernames[new_username]  = new_username ;

		socket.username = new_username;

		// Update the list
		io.sockets.emit('user-list', usernames); 

		//Notify everybody
		socket.broadcast.emit('user-logged', socket.username);
	}
});

/*
*
* Make a new room
*
* @parameter:
* - roomID : String Object
* - nickName : String Object - Other user to join
*/
socket.on('room', function(roomID, nickName){

if(rooms.indexOf(roomID) < 0) // Check if room already exist -- not exist
{

// push the room in room list
rooms.push(roomID); 

//emit to the other friend to join me
socket.broadcast.emit('addedToRoom', roomID, nickName); 
console.log(socket.username+" a rejoint la room:", roomID);
}
else // room exist
{
	console.log("room existe deja dans la liste: ", roomID);
	console.log('rooms:', rooms);
}

// join the room
socket.join(roomID);

//store the room
socket.room = roomID;

console.log("etat de la room:", socket.adapter.rooms[roomID]);
}); 




/*
*
* Send a Message to everybody
*
* @Param : 
* - roomID:  string object, room chat to display the msg 
* - msg : string object
*/
socket.on('newMessage', function(roomID, msg){
	console.log("message recu:", msg);
	socket.broadcast.emit('newMessage', roomID, msg, socket.username);
});

/*
*
* Quit a room
*
* @Param : 
* - roomID:  string object, room chat to display the msg 
* 
*/
socket.on('leaveRoom', function(roomID){
	socket.leave(roomID);
});


/*
*
* Send a like icon
*
* @Param : 
* - roomID:  string object, room chat to display the msg 
* 
*/
socket.on('likeThumb', function(roomID)
{
	socket.broadcast.emit('likeThumb', roomID, socket.username)
});


/*
*
* Do something when user disconnect
*
* @Param : 
* - roomID:  string object, room chat to display the msg 
* - msg : string object
*/
socket.on('disconnect', function(){
// remove the username from global usernames list
console.log(socket.username+'a disconnect. room: '+socket.room+' is now closed');
delete usernames[socket.username];
socket.leave(socket.room);
});


});


