var express = require('express');
var fs = require('fs');
var	http = require('http');
var url = require('url');
var sizlate = require('../sizlate');
var nowjs = require('now');


//var io = require('socket.io');
var sys = require(process.binding('natives').util ? 'util' : 'sys');
var everyauth = require('everyauth');
var ds = require('./mysql_store.js'); // set datastore
var urls = require('./urls.js');

var server;

var config = require('./config.js');
var routes = require('./routes.js');



everyauth.debug = true;

var usersById = {};

var sendResponse = function(res, data) {
	var login = data.session.auth.userId;
	// get user ? check username? then do the below in a callback?

	ds.knownLogin(data.session.auth.userId, function(data) {
			// known login
			res.redirect(urls.get('list', {list: login}));
		}, 	function(data) {
			// unknown login
			res.redirect(urls.USER_NEW);
	});
};

everyauth
  .twitter
    .myHostname('http://'+config.host+':'+config.port)
    .consumerKey(config.auth.twitter.cKey)
    .consumerSecret(config.auth.twitter.consumerSecret)
	.findOrCreateUser( function (sess, accessTok, accessTokExtra, twitUser) {
		console.log('fine or create user');
		id = twitUser.name+"@twitter";
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
    .myHostname('http://'+config.host+':'+config.port)
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
  .myHostname('http://'+config.host+':'+config.port)
  .appId('3335216477.apps.googleusercontent.com')
  .appSecret('HQ3dXWfmxMoJSZC987N6SeUn')
  .scope('https://www.google.com/m8/feeds/')
  .findOrCreateUser( function (sess, accessToken, extra, googleUser) {
	var id = googleUser.id+"@google";
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
		console.log('find user by id');
		callback(null, userId);
	})
);
var everyone = require("now").initialize(app);
everyone.now.urls = urls; // share urls with the client.


//everyone.now.build = urls.build; // share urls with the client.

everyauth.helpExpress(app);

app.configure( function () {
  app.set('view engine', 'html');
  app.set('dirname', __dirname);
});

app.register('.html', sizlate);




app.get(urls.HOME, routes.home);
app.get(urls.LOGIN, routes.login);
app.get(urls.URLS, routes.urls);


app.get(urls.USER_NEW, routes.users_new);
app.post(urls.USER, routes.users_new_POST);
app.get(urls.USER_TAKEN, routes.users_taken);

app.get(urls.LIST, routes.wall);
app.post(urls.LIST_STATUS_EDIT, routes.saveStatus);	// Accept comment posts
app.post(urls.TASK_NEW, routes.taskNew);	// Edit form
app.get(urls.TASK, routes.GET_task);
app.get(urls.TASK_EDIT, routes.GET_taskEdit);	// Edit form
app.post(urls.TASK_EDIT, routes.POST_taskEdit);
app.get(urls.TASK_COMMENTS, routes.comments);	// show comments
app.post(urls.TASK_COMMENT_NEW, routes.newComment);  // Accept comment posts


sizlate.startup(app, function(app) {
	app.listen(config.port);	
	console.log('Server running at: '+config.host+':'+config.port);
});
