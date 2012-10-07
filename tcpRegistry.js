var serviceRegistry = require('./serviceRegistry.js'),
	TcpClient 		= require('./tcpClient.js'),
	net 			= require('net');

var server = net.createServer(function (socket) {

	var client = new TcpClient(socket);

	socket.addListener("data", function(d) {

		var data;

		try {
			data = JSON.parse(d);
		}
		catch (e) {
			socket.end('Invalid input.\n\r');
			return;
		}

		if (data.action != 'register') {
			return;
		}

		if(data.key != '2e796f85308dbbeeb6ec7bbefcbcbae3571c5bf34c499b52') {
			socket.end('Invalid key.');
			return;      
		}

		serviceRegistry.register({
			path: data.path,
			client: client
		});
	});

	socket.addListener("end", function () {
		serviceRegistry.unregister(client);
	});

});

server.listen(7000);

console.log("TCP server listening on port 7000.");