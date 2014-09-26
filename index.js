var WebSocketServer = require("ws").Server
var http = require("http")
var express = require("express")
var app = express()
var jade = require('jade')
var port = process.env.PORT || 5000
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use( bodyParser.urlencoded() ); // to support URL-encoded bodies

app.use(express.static(__dirname + "/public"))

var jade_dir = 'jade/';

var fn_signin = jade.compileFile(jade_dir + 'signin.jade');
var fn_lobbies = jade.compileFile(jade_dir + 'lobbies.jade');
var fn_game = jade.compileFile(jade_dir + 'game.jade');

var users = []
var lobbies = []
var id = 0

var get_by_id = function(arr, id){
	var result;
	arr.forEach(function(elm){
		if(String(elm.id) === String(id)){
			result = elm;
		}
	});
	return result;
}

var server = http.createServer(app)
server.listen(port)
console.log("http server listening on %d", port)
var wss = new WebSocketServer({server: server})
wss.broadcast = function(key, data) {
	for (var i in this.clients) {
	  	var ws = this.clients[i];
	    if(key === ws.key){
	    	ws.send(data);
	    }
	}
};
console.log("websocket server created")
var tests = [];
wss.on("connection", function(ws) {
	console.log("websocket connection open");

	ws.on("close", function() {
		console.log("websocket connection close");
	})

	ws.on('message', function(data){
		console.log("websocket hit: " + data);
		var message = JSON.parse(data);
		var test_number = message.test_number;
		tests.push(test_number);
		ws.key = test_number;
		wss.broadcast(ws.key, String(tests));
	})
});

//GETS
app.get('/', function(req, res){
	var data = {
		lobbies: lobbies,
	}
	res.send(fn_lobbies(data));
})

app.get('/signin', function(req, res) {
	res.send(fn_signin());
});

app.get('/lobby/:lobby_id', function(req, res){
	var lobby_id = req.params.lobby_id;
	var lobby = get_by_id(lobbies, lobby_id);
	var data = {
		id = lobby.id,
		name = lobby.name,
		players = lobby.players.json()
	}
	res.send(fn_game(lobby));
});

function _create_user(res, user_name){
	var user_id = id++;
	users.push({
		name: user_name,
		id: user_id,
	});
	res.send({
		user_id: user_id,
		user_name: user_name,
	});
}

//POSTS
app.post('/user/create', function(req, res) {
	var user_name = req.body.user_name;
	_create_user(res, user_name);
});

app.post('/user/assert', function(req, res) {
	var user = get_by_id(users, req.body.user_id);
	var user_name = req.body.user_name;
	if(!user || user.name != user_name){
		_create_user(res, user_name);
	} else {
		res.send({
			user_id: user.id,
			user_name: user.name,
		});
	}
});

app.post('/lobby/create', function(req, res) {
	var lobby_id = id++;
	lobbies.push({
		name: req.body.lobby_name,
		id: lobby_id,
		players: players.Create(),
	});
	res.send({
		lobby_id: lobby_id,
	});
});

app.get('/test/:num', function(req, res){
	var num = req.params.num;
	res.send(jade.compileFile(jade_dir + 'test.jade')({
		test_number: num,
	}));
})
