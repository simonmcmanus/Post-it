var express = require('express');
var everyauth = require('everyauth');
var config = require('./config.js');

var jqtpl = require('jqtpl');
everyauth.debug = true;

var usersById = {};

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
    .redirectPath('/');

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
    .redirectPath('/');

var app = express.createServer(
	express.bodyParser(),
	express.static(__dirname + "/public"),
	express.cookieParser(),
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

app.get('/', function (req, res) {
	console.log('user is', req.user);
	res.render('login.html');
});

app.listen(3000);
