var express = require('express');
var app = express.createServer();

var sizlate = require('sizlate');
console.log(sizlate);
app.register('.html', sizlate);



var app =  express.createServer(
	express.bodyParser(),
	express.static(__dirname + "/public"),
	express.cookieParser(),
	express.static(__dirname),
	express.session({ secret: 'htuayreve'})
);



app.get('/', function(req, res) {
	res.render('wall.html', {
		selectors: {
			'h1:eq(1)': 'Page 1',
			'h2': 'Welcome to page 1',
			'ul li': 'You made it to page one',
			'footer a': {
				innerHTML: 'link text',
				href: 'alt text',
				title: 'title text',
				className: 'bob'
			},
			'#notStarted': {
				partial: 'task.html', 
				data: {
					['boo', 'tosh']
				}
			}				
		}
	});
});

sizlate.startup(app, function(app) {
	app.listen(8000);	
});
