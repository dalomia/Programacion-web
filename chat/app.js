var express = require('express'), http = require('http'), path = require('path');

// variable que contiene el puerto de coneccion al socket
var app = express();
app.configure(function() {
	app.set('port', process.env.PORT || 8124);
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});
app.get('/', function(req, res) {
	res.send('hello');
});



//
app.configure('development', function() {
	app.use(express.errorHandler());
});

//variable para crear el servidor
var server = http.createServer(app).listen(app.get('port'), function() {
	console.log("Express server listening on port " + app.get('port'));
});

//variable que hace el llamdo al socket.io
var io = require('socket.io').listen(server);
io.configure(function() {
	
});

// funcion que conecta al servidor socket
io.sockets.on('connection', function(socket) {

	socket.on('addme', function(username) {
		socket.username = username;
		socket.emit('chat', 'SERVER', 'You have connected');
		socket.broadcast.emit('chat', 'SERVER', username + ' is on deck');
	});
	// funcion para enviar chat como usuario
	socket.on('sendchat', function(data) {
		io.sockets.emit('chat', socket.username, data);
	});

		// funcion para desconectarse del servidor 
	socket.on('disconnect', function() {
		io.sockets.emit('chat', 'SERVER', socket.username + ' has left the building');
	});

});

