var raspi = require('raspi-io'),
	five = require('johnny-five'),
	_ = require('lodash');

// simple helper function
var gpio = function(id){
	return 'GPIO'+String(id);
}

// simple 1/0 function
var onOff = function(){
	return Math.round(Math.random());
}

module.exports = function(config){
	var matrix = null;
	return {
		clear: function(){
			if(!matrix){return}
			matrix.draw(' ');
		},
		ready: function(callback){
			callback = callback || function(){};
			var board = new five.Board({
				io: new raspi()
			});
			board.on('ready', function(err){
				if(err){
					return callback(err);
				}
				matrix = new five.Led.Matrix({
					pins: {
						data: gpio(10),
						clock: gpio(11),
						cs: gpio(8)
					}
				});
				return callback();
			});
		},
		set: function(pattern){
			if(!matrix){ return; }
			if(config.patterns[pattern]){
				matrix.draw(config.patterns[pattern])
			}
		},
		random: function(){
			var rows = 8;
			var cols = 8;
			var results = [];
			for(r=0; r<rows; r++){
				var line = [];
				for(c=0; c<cols; c++){
					line.push(onOff());
				}
				results.push(line.join(''));
			}
			return results;
		},
		reverse: function(input){
			return _.map(input, function(data){
				return String(data).split("").reverse().join("");
			}).reverse();
		},
		updateStatus: function(channels){
			if(!matrix){ return; }
			var code = [
				"00000000",
				"00000000",
				"00000000",
				"00000000",
				"00000000",
				"00000000",
				"00000000",
				"00000000"
			];
			_.each(config.status, function(status, channel){
				if(channels[channel] === true){
					var row = 0;
					status.forEach(function(data){
						if(data){
							code[row] = data;
						}
						row++;
					});
				}
			});
			matrix.draw(code);
		}
	}
}