var raspi = require('raspi-io');
var five = require('johnny-five');

var board = new five.Board({
	io: new raspi()
});

var gpio = function(id){
	return 'GPIO'+String(id);
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

	var done = function(){
		matrix.draw(' ');
		process.exit()
	};

	var phrase = "HelloWorld";
	var speed = 350;
	
	var i = 0;
	var int = setInterval(function(){
		if(!phrase[i]){
			clearInterval(int);
			return done();
		}
		matrix.draw(phrase[i]);
		setTimeout(function(){
			matrix.draw(' ');
		}, speed-50);
		i++;
	}, speed);

});
