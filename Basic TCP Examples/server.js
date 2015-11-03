'use strict';
var net = require('net');

var _ = require('lodash'),
	parse = require('json-stream');

var server = net.createServer();

var id = 0,
	clients = {};
server.on('connection', function(client){
	// track the client internally
	client.id = id++;
	clients[client.id] = client;

	// we want to send text
	client.setEncoding('utf8');
	// we aren't streaming content, we want instantly sent messages
	client.setNoDelay(true);
	
	console.log('Client %s connected!', client.id);

	var send = function(data){
		client.write(JSON.stringify(data));
	}

	var msgs = client.pipe(parse());
	msgs.on('data', function(data){
		console.log('INPUT', data);
		send(data);
	})

	client.on('error', function(err){
		console.error('TCP client %s error', client.id);
		console.error(err);
	});

	client.on('close', function(){
		console.log('client %s disconnected', client.id);
		delete clients[client.id];
	});
});

server.on('error', function(err){
	console.error('TCP server error');
	console.error(err);
});

server.listen(20205, function(){
	console.log('Server is ready!')
});

// gracefully close the server
process.on('SIGINT', function(){
	console.log("\nGracefully closing server");
	server.close(function(){
		console.log('TCP server closed!');
		process.exit();
	});
	_.each(clients, function(client){
		client.end();
	});
})