'use strict';
var connect = require('connect'),
	serveStatic = require('serve-static'),
	open = require('open');

var server = connect();
server.use(serveStatic('./', {
	index: ['index.html']
}));
server.listen(18888, function(err){
	if(err){
		return console.error("Failed to setup server!", err)
	}
	console.log('Server is online at http://localhost:18888');
	open('http://localhost:18888');
});