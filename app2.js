var express = require('express');
var fs = require('fs');
var	http = require('http');
var url = require('url');
var sizlate = require('../sizlate');

//var io = require('socket.io');
var sys = require(process.binding('natives').util ? 'util' : 'sys');
var everyauth = require('everyauth');
var ds = require('./mysql_store.js'); // set datastore


var server;



var config = require('./config.js');
var routes = require('./routes.js');



everyauth.debug = true;

var usersById = {};


var sendResponse = function(res, data) {
//	var session = data.session;
//	var redirectTo = session.redirectTo;
//	delete session.redirectTo;
	res.redirect('/'+data.user.id+'');
};

everyauth
  .twitter
    .myHostname('http://local.host:3000')
    .consumerKey(config.auth.twitter.cKey)
    .consumerSecret(config.auth.twitter.consumerSecret)
	.findOrCreateUser( function (sess, accessTok, accessTokExtra, twitUser) {
		id = twitUser.name;
		var user = {
			id: id,
			twitterUser: twitUser,
			username: twitUser.name,
			image: twitUser.profile_image_url
		};
		usersById[id] = user;
		return user;
	})
  .sendResponse(sendResponse);


everyauth
  .facebook
    .myHostname('http://localhost:3000')
    .appId(config.auth.facebook.appId)
    .appSecret(config.auth.facebook.appSecret)
   	.findOrCreateUser( function (sess, accessTok, accessTokExtra, fbUser) {
		var id = fbUser.username+"@facebook";
		var user = {
			id: id,
			facebookUser: fbUser,
			username: fbUser.username
		};
		usersById[id] = user;
		return user;
	})
  .sendResponse(sendResponse);

  

everyauth.google
  .myHostname('http://localhost:3000')
  .appId('3335216477.apps.googleusercontent.com')
  .appSecret('HQ3dXWfmxMoJSZC987N6SeUn')
  .scope('https://www.google.com/m8/feeds/')
  .findOrCreateUser( function (sess, accessToken, extra, googleUser) {
	var id = googleUser.id
	var user = {
		id: id,
		googleUser: googleUser,
		username: id
	}
	return user;
  })
  .sendResponse(sendResponse);


var app =  express.createServer(
	express.bodyParser(),
	express.static(__dirname + "/public"),
	express.cookieParser(),
	express.static(__dirname),
	express.session({ secret: 'htuayreve'}),
	everyauth.middleware(),
	everyauth.everymodule.findUserById( function (userId, callback) {
		callback(null, userId);
	})
);

//everyauth.helpExpress(app);

app.configure( function () {
  app.set('view engine', 'html');
  app.set('dirname', __dirname);
});

/*

/users/

users/1

users/1/create
users/1/update
users/1/delete
*/
app.register('.html', sizlate);

app.get('/', routes.home);
app.get('/login', routes.login);

app.get('/:list', routes.wall);
app.post('/:wall/tasks/new', routes.taskNew);	// Edit form

app.get('/:wall/task/:taskId', routes.GET_task);

app.get('/lists/:wall/tasks/:taskId/edit', routes.GET_taskEdit);	// Edit form
app.post('/lists/:wall/tasks/:taskId/edit', routes.POST_taskEdit);
app.get('/lists/:wall/tasks/:taskId/comments', routes.comments);	// show comments
app.post('/lists/:wall/status/:status/edit/', routes.saveStatus);	// Accept comment posts
app.post('/lists/:wall/tasks/:taskId/comments/new', routes.newComment);  // Accept comment posts

//app.listen(config.port);

sizlate.startup(app, function(app) {
	app.listen(config.port);	
	console.log('Server running at: http://simonmcmanus.com:'+config.port);
});
