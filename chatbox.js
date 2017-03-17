
/*
*
* Global var
*
*/
var arr_chatWindow = []; // Array to store your room
var arr_userList; //userlists
var myID = randomStr();
var myUserName = null;
var currentDate = new Date();
var now = currentDate.getHours() + "h" + currentDate.getMinutes();


/*
*
* Connect to server
*
*/
var socket = io.connect('http://localhost:8890');


/*
*
* when you connect to the server
* Ask for an username. Needed. By Default you are anonymous, can't be double
*
*/
socket.on('connect', function() {
   
   
    var userPrompt = prompt("Please enter your name", "Anonymous");
    if (userPrompt != null) {
        myUserName = userPrompt;
        socket.emit('adduser', userPrompt);
    }
});

/*
*
* Change your username in server
*
*/
socket.on('change_username', function() {
   
   
    var userPrompt = prompt("Username already taken", "Anonymous");
    if (userPrompt != null) {
        myUserName = userPrompt;
        socket.emit('change_username', userPrompt);
    }
});


/*
*
* Update the userlist
*
* @Param : 
* - userList : array object, List of user actually connected
*/
socket.on('user-list', function (list) {

    // Add userList to view
    console.log(list);
    $("#user_list").empty(); // clean the list
    for(user in list)
    {
        if(user != myUserName)
        {
            $("#user_list").append('<li><a href="#" onClick="openNewChatWindow(\''+list[user]+
                '\')">'+list[user]+'</a></li>'); // display all name without mind
        }
    }
    arr_userList  = list;
});


/*
*
* Notifiy you because a new user is logged
*
* @Param : 
* - username: string object, username connected
*/
socket.on('user-logged', function (username) {

    Push.create("New Connexion", {
        body: username+' is now connected',
        icon: '', //'icon.png',
        timeout: 4000,
        onClick: function () {
            window.focus();
            this.close();
        }
    });  
});


/*
*
* Receive a message from server
* Use when some client send a message
*
* @Param : 
* - room:  string object, room chat to display the msg 
* - msg : string object
* - username : string name of the user who sent you the msg
*/
socket.on('newMessage', function (room, msg, username) {
    

    var chatInfos = arr_chatWindow.find(function(e){
       return e.id == room;
    });

    if(chatInfos != null)
        addMsg(room, msg, username);
});


/*
*
* Display a system message
*
* @Param : 
* - room:  string object, room chat to display the msg  -- if null, all room must to display the msg
* - username : string name of the user who sent you the msg
*/
socket.on('SYSTEM', function (room, msg) {

    var $contener;
    if(room)
    {
        //get the room
        var $room = $("#"+room);

        var chatInfos = arr_chatWindow.find(function(e){
           return e.id == room;
        });

        if(chatInfos != null)
        {
             $contener = $room.find(".msg_container_base") 
            
        }
    }
    else
    {
        $contener = $(".msg_container_base");
    }


    $contener.append('<div class="row msg_container base_receive"> \
                <div class="col-md-12 col-xs-12"> \
                    <div class="messages"> \
                        <p>'+msg+'</p> \
                    </div>\
                </div>\
            </div>');
    $(".msg_container_base").scrollTo(90000);

});



/*
*
* Ask to user for join room
*
* @Param : 
* - room:  string object, room ID
* - id_wanted : string object
* - username : string name of the user who sent you the msg
*/
socket.on('addedToRoom', function (room, username) {
    console.log('addedToRoom', room, username);
    if(username == myUserName)
    {
        socket.emit('room', room); //rejoint la room
        var roomInfos = {}; // make a local object for this room
        roomInfos.title = username; // associate roomname with username
        roomInfos.id = room;
        arr_chatWindow.push(roomInfos); // store the room
    }
});

/*
*
* Receive like event
*
* @Param : 
* - room:  string object, room chat to display the msg 
* - username : string name of the user who sent you the msg
*/
socket.on('likeThumb', function (room, username) {
    var msg = '<img src="asset/fb-like.png" width="25px" alt="pouce">';

     var chatInfos = arr_chatWindow.find(function(e){
       return e.id == room;
    });

    if(chatInfos != null)
        addMsg(room, msg, username);
});



/*
*
* Minimise the window
*
*/
$(document).on('click', '.panel-heading span.icon_minim', function (e) {

    var $this = $(this);
    if (!$this.hasClass('panel-collapsed')) {
        $this.parents('.panel').find('.panel-body').slideUp();
        $this.addClass('panel-collapsed');
        $this.removeClass('glyphicon-minus').addClass('glyphicon-plus');
    } else {
        $this.parents('.panel').find('.panel-body').slideDown();
        $this.removeClass('panel-collapsed');
        $this.removeClass('glyphicon-plus').addClass('glyphicon-minus');
    }
});

/*
*
* Listener to close the chat window
* Leave the room too
*
*/
$(document).on('click', '.icon_close', function (e) {
    $(this).closest(".chat-window").remove();
});


$(document).on('focus', '.panel-footer input.chat_input', function (e) {
    var $this = $(this);
    if ($('#minim_chat_window').hasClass('panel-collapsed')) {
        $this.parents('.panel').find('.panel-body').slideDown();
        $('#minim_chat_window').removeClass('panel-collapsed');
        $('#minim_chat_window').removeClass('glyphicon-plus').addClass('glyphicon-minus');
    }
});


/*
*
* Listener to display more option for the chat window
* Leave the room too
*
*/
$(document).on('click', '.icon_logout', function (e) {
    var r = confirm("Do you want to leave this discussion ?");
    if (r == true) {
        socket.emit('leaveRoom', $(this).closest(".chat-window").attr('id'));
    }
    $(this).closest(".chat-window").remove();
});


/*
*
* Event send message when form submit
* 
*/
$(document).on('submit', '.form_txtfield', function(e){ 

    e.preventDefault();
    
    // field chat on focus
    var $focus_field = $(this).parents().find(":focus");
    var $message = $focus_field.val();
    var $roomChat = $focus_field.parents('.chat-window').attr('id');

    // send the message to server
    socket.emit('newMessage', $roomChat, $message);

    // search the good field
    if($(this).parents().find("input").is(":focus") && $focus_field.val() != "") 
    {
        $("#"+$roomChat)
        .find(".msg_container_base")
        .append('<div class="row msg_container base_sent"> \
                                <div class="col-md-10 col-xs-10"> \
                                    <div class="messages msg_sent"> \
                                        <p>'+$message+'</p> \
                                        <time datetime="'+now+'">'+myUserName+' • '+now+'</time> \
                                    </div> \
                                </div>\
                            </div>');
        emojify.setConfig({
            img_dir :'https://github.global.ssl.fastly.net/images/icons/emoji/'
        });
        emojify.run();
    }
    
    //clean the field
    $focus_field.val(''); 
    
    //scroll at the end of view
    $(".msg_container_base").scrollTo(90000);
});



/*
*
* send a thumb icon like facebook
* 
*/
$(document).on('click', '.btn-like', function(e){ 

    var $roomChat = $(this).parents('.chat-window').attr('id');

    socket.emit('likeThumb', $roomChat); // Envoi un message a tout le monde

    $("#"+$roomChat)
        .find(".msg_container_base")
        .append('<div class="row msg_container base_sent"> \
                                <div class="col-md-10 col-xs-10"> \
                                    <div class="messages msg_sent"> \
                                        <p><img src="asset/fb-like.png" width="25px" alt="pouce"></p> \
                                        <time datetime="'+now+'">'+myUserName+' • '+now+'</time> \
                                    </div> \
                                </div>\
                            </div>');

    $(".msg_container_base").scrollTo(90000)    
});


/*
*
* This function send an event to server to join a new room. 
* After, it open a new div window to chat.  
* 
*/
function openNewChatWindow(nickname, id_dest)
{
        // Calcule a size window
        var size = $( ".chat-window:last-child" ).css("margin-left");
        size_total = parseInt(size) + 400;

        // Make a new convers
        var newRoomID = randomStr(); 
        socket.emit('room', newRoomID, nickname); // Ask to join a new room
        createChatWindow(nickname, newRoomID); // make a div in template
}


/*
*
* This function make a div window for chat with information in parameters
*
* @Param : 
* - title:  string object, Nickname
* - id : string object
*/
function createChatWindow(title, id)
{
    // make a new roomInfos
    var roomInfos = {};
    roomInfos.title = title;
    roomInfos.id = id;

    // make a new room object
    var $room = $(chatTemplate(title, id));  

    // check if room already exist
    var chatInfos = arr_chatWindow.find(function(e){
       return e.title == title
    });

    //exist
    if(chatInfos != null)
    {
        // re-open room added to template
        $room = $(chatTemplate(chatInfos.title, chatInfos.id)); 
        if(!$("#"+chatInfos.id).length) 
            $("#chat-contener").append($room);
    }
    //not exist
    else
    {
        // add to exist room & reopen
        arr_chatWindow.push(roomInfos); 
        $("#chat-contener").append($room);
    }

    return $room; 
}



/*
* Generate a ramdom String
* @return: String
*/
function randomStr()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 25; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

/*
*
* Add a msg in a room
*
* @Param : 
* - room:  string object, room chat to display the msg 
* - msg : string object
* - username : string name of the user who sent you the msg
*/
function addMsg(room, msg, username)
{
    //get the room
    var $room = $("#"+room);

    //if no window is open, make a new one
    if($room.length == 0){
        $room = createChatWindow(username, room); //ouvre la fenetre adéquat //TODO => verifier le nb max
    }

    // append the message to the window
    $room.find(".msg_container_base") 
        .append('<div class="row msg_container base_receive"> \
                    <div class="col-md-12 col-xs-12"> \
                        <div class="messages msg_receive"> \
                            <p>'+msg+'</p> \
                            <time datetime="'+now+'">'+username+' • '+now+'</time> \
                        </div> \
                    </div>\
                </div>');
    $(".msg_container_base").scrollTo(90000)
    
    emojify.setConfig({
            img_dir :'https://github.global.ssl.fastly.net/images/icons/emoji/'
        });
    emojify.run();
}
