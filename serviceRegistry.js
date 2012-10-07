var serviceRegistry = module.exports;

var data = {};

serviceRegistry.register = function(record) {
	
	if (!data[record.path]) {
		data[record.path] = new Array();
	}

	data[record.path][record.client.name] = record.client;

	console.log("Relay client registered for '" + record.path +  "'");
};

serviceRegistry.unregister = function(client) {

	for(var key in data) {

		if(data[key][client.name]) {
			delete data[key][client.name];
			console.log("Relay client '" + client.name +  "' has been removed.");
			return;
		}
	}
};

serviceRegistry.getRecords = function() {
	return data;
};

serviceRegistry.getRecord = function(path) {
	return data[path];
};