var WebSocketServer = require("ws").Server
var http = require("http")
var express = require("express")
var app = express()
var jade = require('jade')
var port = process.env.PORT || 5000
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use( bodyParser.urlencoded() ); // to support URL-encoded bodies

app.use(express.static(__dirname + "/"))

var fn_signin = jade.compileFile('signin.jade');
var fn_lobbies = jade.compileFile('lobbies.jade');

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
	var data = {
		lobby: get_by_id(lobbies, lobby_id),
	}
	res.send(data.lobby.name); //needs a jade
	
});


//POSTS
app.post('/user/create', function(req, res) {
	var user_id = id++;
	users.push({
		name: req.body.user_name,
		id: user_id,
	});
	res.send({
		user_id: user_id,
	});
});

app.post('/lobby/create', function(req, res) {
	var lobby_id = id++;
	lobbies.push({
		name: req.body.lobby_name,
		id: lobby_id,
		players: {},
	});
	res.send({
		lobby_id: lobby_id,
	});
});


var server = http.createServer(app)
server.listen(port)

console.log("http server listening on %d", port)

var wss = new WebSocketServer({server: server})
console.log("websocket server created")

wss.on("connection", function(ws) {
	console.log("websocket connection open");

	ws.on("close", function() {
		console.log("websocket connection close");
	})

	ws.on('message', function(message){
		console.log("websocket hit");
	})
});
