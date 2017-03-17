

/*
*
* Function template for chat window
* @return : string
*/
function chatTemplate(title, room)
{
    var strChat="";
    strChat += "<div id="+room+" class=\"col-md-4 col-xs-12 chat-window\">";
    strChat += "                    <div class=\" panel panel-default\">";
    strChat += "                        <div class=\"panel-heading top-bar\">";
    strChat += "                                <a href=\"#\" style=\" float: right;\"><span class=\"glyphicon glyphicon-log-out icon_logout\" d><\/span><\/a>";
    strChat += "                                <a href=\"#\" style=\" float: right;\"><span id=\"minim_chat_window\" class=\"glyphicon glyphicon-minus icon_minim\"><\/span><\/a>";
    strChat += "                                <a href=\"#\" style=\" float: right;\"><span class=\"glyphicon glyphicon-remove icon_close\" ><\/span><\/a>";
    strChat += "                            <h3 class=\"panel-title\"><span class=\"glyphicon glyphicon-comment\"><\/span> "+title+"<\/h3>";
    strChat += "                        <\/div>";
    strChat += "                        <div class=\"panel-body msg_container_base\">";
    strChat += "                        <\/div>";
    strChat += "                        <div class=\"panel-footer\">";
    strChat += "                            <div class=\"input-group\">";
    strChat += "                                <form class='form_txtfield'>"
    strChat += "                                <a class='btn-like' style='float: left'><img src='asset/fb-like.png' style=\"width: 15px;height: 15px; cursor:pointer\"/></a>";
    strChat += "                                <input id=\"btn-input\" style='width: 85%; margin-left: 10px;' type=\"text\"class=\"form-control input-sm chat_input\" autocomplete=\"off\" placeholder=\"Ecrivez un message...\" \/>";
    strChat += "                                ";
    strChat += "                               </form>";
    strChat += "                            <\/div>";
    strChat += "                        <\/div>";
    strChat += "                    <\/div>";
    strChat += "                <\/div>";

    return strChat;
}




/*
*
* Event when chat field change
* 
*/
$(".chat_input").keypress(function(event) {
    
    // refresh emoji
    emojify.run();

    // to send msg on return key
    if (event.which == 13) {
        event.preventDefault();
        $(".form_txtfield").preventDefault();
    }
});

