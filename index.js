var WebSocketServer = require("ws").Server
var http = require("http")
var express = require("express")
var app = express()
var jade = require('jade')
var _game = require('./modules/game.js');
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
var games = []
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

function interpret(ws, message){

}

var server = http.createServer(app)
server.listen(port)
console.log("http server listening on %d", port)
var wss = new WebSocketServer({server: server})
wss.broadcast = function(game_id) {
	var data = get_by_id(lobbies, game_id).game.getJSON();
	for (var i in this.clients) {
	  	var ws = this.clients[i];
	    if(game_id === ws.game_id){
	    	ws.send(data);
	    }
	}
};
console.log("websocket server created")
wss.on("connection", function(ws) {
	console.log("websocket connection open");

	ws.on("close", function() {
		console.log("websocket connection close");
	})

	ws.on('message', function(data){
		console.log("websocket hit: " + data);
		var message = JSON.parse(data);
		if(message.header == 'start'){
			ws.game_id = message.game_id;
			ws.user_id = message.user_id;
			var game = get_by_id(lobbies, ws.game_id).game;
			var user = get_by_id(users, ws.user_id);
			game.addPlayer(user);
		}
		if(message.header == 'action'){
			interpet(ws, message);
		}
		wss.broadcast(ws.game_id);
	})
});

//GETS
app.get('/', function(req, res){
	var data = {
		games: games,
	}
	res.send(fn_lobbies(data));
})

app.get('/signin', function(req, res) {
	res.send(fn_signin());
});

app.get('/games/:game_id', function(req, res){
	var game_id = req.params.game_id;
	var game = get_by_id(games, game_id);
	var data = {
		id = game.id,
		name = game.name,
	}
	res.send(fn_game(game));
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

app.post('/game/create', function(req, res) {
	var game_id = id++;
	games.push({
		name: req.body.game_name,
		id: game_id,
		game: _game.create(),
	});
	res.send({
		game_id: game_id,
	});
});
