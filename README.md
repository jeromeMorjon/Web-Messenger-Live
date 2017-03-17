# Web-Messenger-Live
A Messenger Like Facebook using Socket.io easy to integrate and very useful.
It based on Twitter Bootstrap framwork and socket.io. Some plugin are added to beautiful it.
Free to use

## How it work
When you add the contener to your website, it will display a div at bottom page like facebook. Each discussion are in a window.
Discussion are 1 to 1
Support of Emoji ok
Use username to separate each user but you will can add a database in futur version.

All the code is documented and open source. You can edit it to perform a better style and functionnality for your work ;)

## Requirement
Install Node.JS then install socket.io
```shell
npm install socket.io
```


## Installation

Very easy & fast to install

1) Include the header links with dependencies
``` html
<link rel="stylesheet" href="http://cdnjs.cloudflare.com/ajax/libs/emojify.js/1.1.0/css/basic/emojify.css" />
    <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="chatbox.css">
```

2) Include JS Dependencies first
``` HTML
<!-- JQuery 3.X -->
<script   src="https://code.jquery.com/jquery-3.1.1.min.js"   integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8="   crossorigin="anonymous"></script>

<!-- Dependencies -->
<script src="http://cdnjs.cloudflare.com/ajax/libs/emojify.js/1.1.0/js/emojify.js"></script>
<script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-scrollTo/2.1.2/jquery.scrollTo.min.js"></script>>
<!-- Socket IO -->
<script src="socket.io.js"></script>
```
2.1)
Other dependencies if you want to notify the web browser 
```HTML
<script src="dist/push.js/push.js"></script>
```

3) Include Chat JS Files
``` HTML
<!-- Template -->
<script src="template.js"></script>

<!-- Custom Chat -->
<script src="chatbox.js"></script>
```
4) Include the contener in your code wherever you want
```HTML
<div id="chat-contener" class="col-sm-12"></div>
```

## Usage
##### Configuration
1) Go to ```server.js```

2) change ```server.listen(8890);``` on the port you want to listen.

3) Then Go to ```chatbox.js``` 
and edit with your address server  ```var socket = io.connect('http://localhost:8890');```

### User List
You can access to the user list if you add the block user-list
```HTML
<div class="col-sm-4">
    <!-- UserLIst -->
    <h3>UserList Connected:</h3>
    <ul id="user_list" class="nav nav-list">
        <li class="nav-header">Connected</li>
    </ul>           
</div
```

##### Run the server
launch your shell and go in the folder
run this commande : 
```shell
node server.js
```

Here we go !! 
Your chat is ready.
## Plug-in

* Push.js : If you want to make notification on some event
* Emojify : Full support of emoji like iOS (very cool) 


## Contributing
1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D



## License

MIT Licence
