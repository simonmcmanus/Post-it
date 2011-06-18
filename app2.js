var express = require('express');
var fs = require('fs');
var	http = require('http');
var url = require('url');
var jqtpl = require('jqtpl');
var io = require('socket.io');
var sys = require(process.binding('natives').util ? 'util' : 'sys');
var everyauth = require('everyauth');
var ds = require('./mysql_store.js'); // set datastore
var server;

var config = require('./config.js');
var routes = require('./routes.js');



everyauth.debug = true;

var usersById = {};


var sendResponse = function(res, data) {
	var session = data.session;
    var redirectTo = session.redirectTo;
    delete session.redirectTo;
    res.redirect(redirectTo);
};


everyauth
  .twitter
    .myHostname('http://local.host:3000')
    .consumerKey(config.auth.twitter.cKey)
    .consumerSecret(config.auth.twitter.consumerSecret)
	.findOrCreateUser( function (sess, accessTok, accessTokExtra, twitUser) {
		id = twitUser.name+'@twitter';
		var user = {
			id: id,
			twitterUser: twitUser,
			username: twitUser.name
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


everyauth.helpExpress(app);

app.configure( function () {
  app.set('view engine', 'html');

});

app.register( ".html", jqtpl); // use jQuery templating to render html files. 




app.get('/', routes.home);
app.get('/login', routes.login);

app.get('/lists/:file(*wall.html)', routes.wall);
app.post('/lists/:wall/tasks/new', routes.taskNew);	// Edit form
app.get('/lists/:wall/tasks/:taskId/edit', routes.GET_taskEdit);	// Edit form
app.post('/lists/:wall/tasks/:taskId/edit', routes.POST_taskEdit);
app.get('/lists/:wall/tasks/:taskId/comments', routes.comments);	// show comments
app.post('/lists/:wall/status/:status/edit/', routes.saveStatus);	// Accept comment posts
app.post('/lists/:wall/tasks/:taskId/comments/new', routes.newComment);  // Accept comment posts

app.listen(config.port);
console.log('Server running at: http://simonmcmanus.com:'+config.port);