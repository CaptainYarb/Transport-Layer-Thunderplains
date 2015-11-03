var config = require('./config.json');
	ricochet = require('ricochet'),
	raspi = require('raspi-io'),
	five = require('johnny-five');

var gpio = function(id){
	return 'GPIO'+String(id);
}

var board = new five.Board({
	io: new raspi()
});
var matrix = null;
board.on('ready', function(err){
	if(err){
		console.error('Failed to start board', err)
		return process.exit();
	}
	matrix = new five.Led.Matrix({
		pins: {
			data: gpio(10),
			clock: gpio(11),
			cs: gpio(8)
		}
	});
});

var client = new ricochet.Client();
client.connect(config);
client.on('ready', function(data){
	console.log('Connected to server!', data);
	matrix.draw('O');
});
client.on('disconnected', function(data){
	console.log('Disconnected from server!', data);
	matrix.draw('X');
});
client.on('reconnected', function(data){
	console.log('Reconnected from server!', data);
	matrix.draw('O');
});
client.on('end', function(data){
	console.log('server closed connection!', data);
	matrix.draw('E');
});
client.on('authFail', function(){
	console.log('Auth failed when connecting to server!');
	process.exit();
});
client.on('error', function(err){
	console.log('Ricochet error!', err);
});
client.handles.on('pattern', function(data){
	if(!matrix){
		return console.error('Matrix board not initialized');
	}
	console.log('got pattern', data);
	matrix.draw(data);
});