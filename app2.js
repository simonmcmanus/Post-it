/**



| - client - | - server - |
url > routes - data ->  views - uis - 
**/
var express = require('express');
var fs = require('fs');
var	http = require('http');
var url = require('url');
var jqtpl = require('jqtpl');
var io = require('socket.io');
var sys = require(process.binding('natives').util ? 'util' : 'sys');
var server;


var app = module.exports = express.createServer();

app.set( "view engine", "html" );
app.register( ".html", jqtpl); // use jQuery templating to render html files. 


var routes = require('./routes.js');

app.configure( function(){
    app.use(express.static(__dirname));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	// allow forms to be posted
	app.use( express.bodyParser() );
});

app.get('/', function(req, res){
	res.send('<a href="/lists/smm/wall.html">see demo list</a>');
});

app.get('/lists/:file(*wall.html)', routes.wall);


// Edit form
app.post('/lists/:wall/tasks/new', routes.taskNew);

// Edit form
app.get('/lists/:wall/tasks/:taskId/edit', routes.taskEdit);

// show comments
app.get('/lists/:wall/tasks/:taskId/comments', routes.comments);


// Accept comment posts
app.post('/lists/:wall/status/:status/edit/', routes.saveStatus);


// Accept comment posts
app.post('/lists/:wall/tasks/:taskId/comments/new', routes.newComment);



var io = io.listen(app), buffer = [];
  
io.on('connection', function(client){
	client.send({ buffer: buffer });
	client.broadcast({ announcement: client.sessionId + ' connected' });
	client.on('message', function(message){
		var msg = { message: [client.sessionId, message] };
		//console.log('recieved', sys.inspect(client));
		buffer.push(msg);

		if (buffer.length > 15) buffer.shift();
			client.broadcast(msg);
		});
	client.on('disconnect', function(){
		client.broadcast({ announcement: client.sessionId + ' disconnected' });
	});
});

app.listen(8000);
console.log('Server running at: http://simonmcmanus.com:8000/');