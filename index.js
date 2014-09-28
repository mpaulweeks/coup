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
var fn_lobby = jade.compileFile(jade_dir + 'lobby.jade');
var fn_game = jade.compileFile(jade_dir + 'game.jade');

var users = []
var games = []
var id = 0

//Helpers
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

var get_by_id = function(arr, id){
	var result;
	arr.forEach(function(elm){
		if(String(elm.id) === String(id)){
			result = elm;
		}
	});
	return result;
}

function interpret_action(ws, message){
	var game = get_by_id(games, ws.game_id).game;	
	var player = game.getPlayer(ws.user_id);
	var log = player.user.name;

	switch(message.action){
		case 'cash':
			var cash = player.addCash(message.value);
			game.log.push(log + ' added (' + message.value
				+ ') cash and now has ' + cash);
			break;
		case 'draw':
			player.draw();
			game.log.push(log + ' drew a card');
			break;
		case 'returnToDeck':
			player.returnToDeck(message.value);
			game.log.push(log + ' returned a card to the deck');
			break;
		case 'revealAndReturn':
			var card = player.returnToDeck(message.value);
			game.log.push(log + ' revealed ' + card.name
				+ ' and shuffled it into the deck');
			break;
		case 'discard':
			var card = player.discard(message.value);
			game.log.push(log + ' discarded ' + card.name);
			break;
	}
}

//Websocket
var server = http.createServer(app)
server.listen(port)
console.log("http server listening on %d", port)
var wss = new WebSocketServer({server: server})
wss.broadcast = function(game_id) {
	var data = get_by_id(games, game_id).game.getJSON();
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
			console.log('doing start');
			ws.game_id = message.game_id;
			ws.user_id = message.user_id;
			var game = get_by_id(games, ws.game_id).game;
			var user = get_by_id(users, ws.user_id);
			game.addPlayer(user);
		}
		if(message.header == 'action'){
			console.log('doing action');
			interpret_action(ws, message);
		}
		wss.broadcast(ws.game_id);
	})
});

//GETS
app.get('/', function(req, res){
	var data = {
		games: games,
	}
	res.send(fn_lobby(data));
})

app.get('/signin', function(req, res) {
	res.send(fn_signin());
});

app.get('/game/:game_id', function(req, res){
	var game_id = req.params.game_id;
	var game = get_by_id(games, game_id);
	res.send(fn_game(game));
});

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

//for debug
function debug(){
	var user_id = id++;
	users.push({
		name: 'Paul',
		id: user_id,
	});
	var game_id = id++;
	games.push({
		name: 'farge',
		id: game_id,
		game: _game.create(),
	});
}
debug();
