var ricochet = require('ricochet'),
	express = require('express'),
	socketIO = require('socket.io');

var config = require('./config.json'),
	app = express(),
	server = require('http').Server(app),
	io = socketIO(server);

server.listen(23220, function(err){
	if(err){
		console.error('Failed to start server', err);
		process.exit();
	}
	console.log('Server is online!');
});
app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket){
	socket.join('matrix');
});

var client = new ricochet.Client();
client.connect(config);
client.on('ready', function(data){
	console.log('Connected to server!', data);
	io.to('matrix').emit('pattern', [
		"01111110",
		"10000001",
		"10000001",
		"10000001",
		"10000001",
		"10000001",
		"10000001",
		"01111110",
	]);
});
client.on('disconnected', function(data){
	console.log('Disconnected from server!', data);
	io.to('matrix').emit('pattern', [
		"10000010",
		"01000100",
		"00101000",
		"00010000",
		"00101000",
		"01000100",
		"10000010",
		"00000000",
	]);
});
client.on('reconnected', function(data){
	console.log('Reconnected from server!', data);
	io.to('matrix').emit('pattern', [
		"01111110",
		"10000001",
		"10000001",
		"10000001",
		"10000001",
		"10000001",
		"10000001",
		"01111110",
	]);
});
client.on('end', function(data){
	console.log('server closed connection!', data);
	io.to('matrix').emit('pattern', [
		"11111111",
		"10000000",
		"10000000",
		"11111111",
		"10000000",
		"10000000",
		"11111111",
		"00000000",
	]);
});
client.on('authFail', function(){
	console.log('Auth failed when connecting to server!');
	process.exit();
});
client.on('error', function(err){
	console.log('Ricochet error!', err);
});
client.handles.on('pattern', function(data){
	//console.log('got pattern', data);
	io.to('matrix').emit('pattern', data);
});