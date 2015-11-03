var raspi = require('raspi-io');
var five = require('johnny-five');

var board = new five.Board({
	io: new raspi()
});

var gpio = function(id){
	return 'GPIO'+String(id);
}
var static = function(){
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
	console.log(results);
	return results;
}
var onOff = function(){
	return Math.round(Math.random());
}

board.on('ready', function(err){
	if(err){
		return console.error('ERROR', err);
	}

	var matrix = new five.Led.Matrix({
		pins: {
			data: gpio(10),
			clock: gpio(11),
			cs: gpio(8)
		}
	});

	matrix.draw([
		"00100100",
		"00100100",
		"11111111",
		"00100100",
		"00100100",
		"11111111",
		"00100100",
		"00100100"
	]);
	var int = setInterval(function(){
		matrix.draw(static());
	}, 1);

	setTimeout(function(){
		clearInterval(int);
		matrix.draw(['00000000', '00000000', '00000000', '00000000', '00000000', '00000000', '00000000', '00000000']);
		process.exit()
	}, 5000);
});
