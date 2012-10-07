var net = require('net');

// keeps the connections
var pool = {};

var server = net.createServer(function (newSocket) {

  newSocket.addListener("data", function(d) {

    var data;

    try {
      data = JSON.parse(d);
    }
    catch (e) {
      newSocket.end('invalid input.\n\r');
      return;
    }

    if (data.action != 'register') {
      return;
    }

    if(data.key != '2e796f85308dbbeeb6ec7bbefcbcbae3571c5bf34c499b52') {
      newSocket.end('Invalid key.');
      return;      
    }

    if (pool[data.url]) {
      newSocket.end('The address "' + data.url + '" is in use.');
      return;
    }

    newSocket.relayUrl = data.url;
    pool[data.url] = newSocket;

    console.log("Relay endpoint registered for '" + data.url +  "'");

  });

  newSocket.addListener("end", function () {

    if (pool[newSocket.relayUrl]) {
      delete pool[newSocket.relayUrl];
      console.log("Relay endpoint '" + newSocket.relayUrl +  "' has been removed.");
    }

  });

});

server.listen(7000);

console.log("TCP server listening on port 7000.");

//-----------------------------------

var http      = require('http'),
express   = require('express'),
app       = express(),
httpServer    = http.createServer(app);

httpServer.listen(80);

app.configure(function(){
  app.use(express.bodyParser());
});

app.use('/feed', function(req, res) {

  res.write("<h1>Available services...</h1>")

  for (var key in pool) {
    res.write(key);
    res.write('\n');
  };

  res.end();
});

app.use(function(req, res) {

  var socket = pool[req.path];

  if (socket) { 

    console.log('Relaying call to ' + socket.remoteAddress + ":" + socket.remotePort);

    socket.on('data', function (data){
      
      var response = JSON.parse(data).response;

      if (typeof response == 'string') {
        res.send(response);
        return;
      };

      res.send(JSON.stringify(response));
    });

    var requestData = {
      path: req.path,
      method: req.method,
      body: req.body,
      headers: req.headers,
      query: req.query
    };

    socket.write(JSON.stringify(requestData)); 
    return;
  }

  res.send(404);
});

console.log("HTTP server listening on port 8080.");

