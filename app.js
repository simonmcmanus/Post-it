var express = require('express')
  ,	fs = require('fs')
  ,	http = require('http')
  , url = require('url')
  , jqtpl = require('jqtpl')
  , io = require('socket.io')
  , sys = require(process.binding('natives').util ? 'util' : 'sys')
  , server;

var app = module.exports = express.createServer();

app.set( "view engine", "html" );
app.register( ".html", jqtpl); // use jQuery templating to render html files. 


app.get('/', function(req, res){
	res.send('<a href="/lists/smm/wall.html">see demo list</a>');
});

app.get('/lists/:file(*wall.html)', function(req, res){
	var list = req.params.file.replace('/wall.html', '');
	res.render("lists/" + list + ".html", {
		locals:{
			title:list
		}
	});
});

// download .js/.css/.* files in static
app.get('/static/:file(*)', function(req, res){
	var file = req.params.file;
	var folder = "static/" + file;
	res.download(folder);
}); 



  
var io = io.listen(app), buffer = [];
  
io.on('connection', function(client){
	client.send({ buffer: buffer });
	client.broadcast({ announcement: client.sessionId + ' connected' });
	client.on('message', function(message){
		var msg = { message: [client.sessionId, message] };
		console.log('recieved', sys.inspect(client));
		buffer.push(msg);

		if (buffer.length > 15) buffer.shift();
			client.broadcast(msg);
		});
	client.on('disconnect', function(){
		client.broadcast({ announcement: client.sessionId + ' disconnected' });
	});
});


app.listen(8080);
console.log('Server running at: http://simonmcmanus.com:9000/');
