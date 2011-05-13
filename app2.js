var express = require('express')
  ,	fs = require('fs')
  ,	http = require('http')
  , url = require('url')
  , jqtpl = require('jqtpl')
  , io = require('socket.io')
  , sys = require(process.binding('natives').util ? 'util' : 'sys')
  , server;


var ds = require('./mysql_store.js'); // set datastore

var app = module.exports = express.createServer();

app.set( "view engine", "html" );
app.register( ".html", jqtpl); // use jQuery templating to render html files. 

app.use(express.bodyParser()); // recieve post requests

app.configure( function(){
    app.use(express.static(__dirname));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	// allow forms to be posted
	app.use( express.bodyParser() );
});

app.get('/', function(req, res){
	res.send('<a href="/lists/smm/wall.html">see demo list</a>');
});

app.get('/lists/:file(*wall.html)', function(req, res){
	var params = {};
	params.list = req.params.file.replace('/wall.html', '');
	ds.getList(params, function(result, params) {
		res.render("wall.html", {
			locals:{
				title:params.list,
				list:result
			}
		});		
	}, params);
});



// Edit form
app.get('/lists/:wall/tasks/:taskId/edit', function(req, res){
	ds.getTask({
		id:req.params.taskId
	}, function(data) {
		res.render('edit_task', {
			
			layout:false,
			locals: {
				wall: req.params.wall,
				id: req.params.taskId,
				task: data[0]
			}
		});		
	});
});


// Edit form
app.post('/lists/:wall/tasks/:taskId/edit', function(req, res){
	ds.updateTask({
		id:req.params.taskId,
		task:req.body
	}, function() {
		res.redirect('/lists/'+req.params.wall+'/wall.html#'+req.params.taskid);
	});
});




app.post('/lists/:file(*new)', function(req, res){
	var params = {};
	params.list = req.params.file.replace('new', '');
	ds.newList(req.body.title, req.body.text, function() {
		// callback.
	});
	res.redirect('/lists/'+params.list+'/wall.html');
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


app.listen(8000);
console.log('Server running at: http://simonmcmanus.com:8000/');
