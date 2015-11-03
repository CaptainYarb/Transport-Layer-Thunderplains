'use strict';
var net = require('net');

var _ = require('lodash'),
	parse = require('json-stream');

var client = net.connect(20205, function(err){
	if(err){
		console.log(err);
		return process.exit();
	}
	console.log('Connected to the server!');
	var send = function(data){
		var msg = JSON.stringify(data);
		console.log('output', msg);
		client.write(msg);
	}

	send({
		auth: 'bob',
		secret: '123456'
	});

	var msgs = client.pipe(parse());
	msgs.on('data', function(data){
		console.log('input', data);
	});
});
client.setEncoding('utf8');
client.setNoDelay(true);
client.on('error', function(err){
	console.error('TCP server error');
	console.error(err);
});
client.on('close', function(){
	console.log('Disconnected from the server!');
})