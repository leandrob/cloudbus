module.exports = function TcpClient(socket) {

	this.name = socket.remoteAddress + ":" + socket.remotePort;

	this.send = function(data, successCallback) {

		socket.on('data', function(data) {
			successCallback(data)
		});

		socket.write(JSON.stringify(data)); 
	}
}