document.addEventListener("DOMContentLoaded", function(){
	var socket = io('192.168.1.200:23220');
	socket.on('connection', function(){
		console.log('Connected to server');
		drawPattern([
			"01111110",
			"10000001",
			"10000001",
			"10000001",
			"10000001",
			"10000001",
			"10000001",
			"01111110"
		]);
	});
	socket.on('reconnected', function(){
		console.log('Reconnected to server');
		drawPattern([
			"01111110",
			"10000001",
			"10000001",
			"10000001",
			"10000001",
			"10000001",
			"10000001",
			"01111110"
		]);
	});
	socket.on('disconnected', function(){
		console.log('Disconnected from server');
		drawPattern([
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
	socket.on('pattern', function(pattern){
		//console.log('pattern', pattern);
		drawPattern(pattern);
	});

	var rows = [
		document.getElementById('r0'),
		document.getElementById('r1'),
		document.getElementById('r2'),
		document.getElementById('r3'),
		document.getElementById('r4'),
		document.getElementById('r5'),
		document.getElementById('r6'),
		document.getElementById('r7')
	];

	var drawPattern = function(input){
		for(var i = 0; i < input.length; i++){
			var html = '';
			var items = input[i].split('');
			for(var t = 0; t < items.length; t++){
				if(items[t] == 1){
					html += '<div class="dot active"></div>';
				}else{
					html += '<div class="dot"></div>';
				}
			}
			rows[i].innerHTML = html;
		};
	}
});