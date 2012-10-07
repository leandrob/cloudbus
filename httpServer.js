var serviceRegistry = require('./serviceRegistry.js'),
	http      		= require('http'),
	express   		= require('express'),
	app       		= express(),
	httpServer    	= http.createServer(app);

app.configure(function(){
	app.use(express.bodyParser());
});

app.use('/feed', function(req, res) {

	var records = serviceRegistry.getRecords();

	var feed = new Array();

	for(var key in records)
	{
		feed.push(key);
	}

	res.send(feed);
});

app.use('/services', function(req, res) {

	var record = serviceRegistry.getRecord(req.path);

	if (!record) {
		res.send(404);
		return;
	}

	for(var clientName in record) {
		
		console.log('Relaying call to ' + clientName);

		var client = record[clientName];

		client.send({
			path: req.path,
			method: req.method,
			body: req.body,
			headers: req.headers,
			query: req.query
		}, function(data) {

			var response = JSON.parse(data).response;

			if (typeof response == 'string') {
				res.send(response);
				return;
			};

			res.send(response);
		});
	}
});

httpServer.listen(80);

console.log("Webserver started!");

