var twitterConsumerKey= 'KRNeR4aJ9wzs6sjQxwyjg';
var twitterConsumerSecret= 'ZqaTxE7c591HusVZlAO9lfPjWYjQ3ngZEroJulQw0pU';
var facebookId= "180068492046726";
var facebookSecret= "d0100e9902dfbed25eb3e92a2671ad0b";
var facebookCallbackAddress= "http://localhost:8080/"
var express= require('express');
var connect= require('connect');
var auth= require('connect-auth');
var app = express.createServer();
app.configure(function(){
app.use(connect.cookieParser());
app.use(connect.session({ secret: 'foobar' }));
app.use(auth( [
	auth.Facebook({appId : facebookId, appSecret: facebookSecret, callback: facebookCallbackAddress}),
 	auth.Twitter({consumerKey: twitterConsumerKey, consumerSecret:    twitterConsumerSecret})]) );
});



app.get('/', function(req, res){
	
    req.authenticate(['facebook', 'twitter'], function(error, authenticated) {
	res.end('homepage');
	});
});



app.get('/facebook', function(req, res){
    req.authenticate(['facebook'], function(error, authenticated) {
		if( authenticated ) {
	      res.end("<html><h1>Hello Facebook user:" + JSON.stringify( req.getAuthDetails().user ) + ".</h1></html>")
	    }
	    else {
	      res.end("<html><h1>Facebook authentication failed :( </h1></html>")
	    }
    });
});

app.get('/twitter', function(req, res){
    req.authenticate(['twitter'], function(error, authenticated) {
        res.end('Hello World: ' + JSON.stringify( req.session.auth.user ) );
    });
});

app.get ('/logout', function(req, res, params) {
    req.logout();
    res.writeHead(303, { 'Location': "/" });
    res.end('');
  })
app.listen(8080);