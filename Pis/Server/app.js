var ricochet = require('ricochet'),
	_ = require('lodash');

var server = new ricochet.Server(),
	config = require('./config.json'),
	patterns = require('./patterns.js')(config);

var channels = {},
	reverseChannels = ['r3', 'r4'];
config.db.forEach(function(results){
	channels[results.channel] = false;
});

server.authCallback = function(data, callback){
	var client = false;
	config.db.forEach(function(results){
		if(data.publicKey == results.publicKey){ client = results; }
	});
	if(!client){ return callback("Bad auth");}
	return callback(null, client);
};
_.each(['clientAuthFail', 'clientReady', 'clientError', 'messageError', 'error'], function(event){
	server.on(event, function(){
		console.log('EVENT [%s]', event);
		console.log.apply(console, arguments);
	});
});

server.on('clientReady', function(data){
	channels[server.clients[data.id].channel] = true;
	patterns.updateStatus(channels);
});
server.on('clientDisconnected', function(data){
	channels[server.clients[data.id].channel] = false;
	patterns.updateStatus(channels);
});

var client = new ricochet.Client(config.serverClient);
client.handles.on('pattern.input', function(data){
	// run input
});

var broadcast = null;

patterns.ready(function(err){
	if(err){ return console.error('Failed to start matrix board'); }
	server.listen(config.server.port, config.server.host, function(err){
		if(err){ return console.error('Failed start server: ', err); }
		patterns.set('server.ready');
		console.log('Server is online!');

		setTimeout(function(){
			client.connect(_.merge(config.serverClient, config.server), function(err){
				if(err){ return console.error('Failed to connect to server', err); }
				console.log('Server client is connected!');

				broadcast = setInterval(function(){
					var pattern = patterns.random(),
						reversePattern = patterns.reverse(pattern);
					_.each(channels, function(online, channel){
						if(online && channel != 'server'){
							if(reverseChannels.indexOf(channel) !== -1){
								return client.message(channel, 'pattern', reversePattern)
							}
							client.message(channel, 'pattern', pattern)
						}
					});
				}, 100);
			});
		}, 1500);
	});
});