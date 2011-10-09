var ds = require('./mysql_store.js'); // set datastore
var urls = require('./urls.js');



var checkPerm = function() {
	
};

var header = function(req) {
	var user = (req.user) ? req.user : '';
	var image = (req.image) ? req.image : '';
	user = 'simon';
	if(user === "") {
		return {partial: 'login.html'}
	}else {
		return {
			partial: 'loggedIn.html',
			classifyKeys: false,
			data: [{
				'.username': user,
				'img src': image
			}]
		}
	}
};

exports.home = function(req, res){
	
	res.render(__dirname+'/views/home.html', {
		selectors : {
			'.wall': 'Home',
			'#header': header(req),
			'#lights': {
				className: 'off'
			}
		}
	});
};



exports.urls = function(req, res) {
	res.download('./urls.js');
};

exports.login = function(req, res){
	res.render('login.html');
};

exports.wall = function(req, res){
	var params = {};
	params.list = req.params.list;
	
//    req.session.redirectTo =  '/'+params.list; // redirect back to this url after login.
	ds.getList(params, function(result, params) {
		var status = {
			notStarted:[],
			inProgress:[],
			done:[],
			deleted: []
		};
		
		var addLinks = function(task) {
			task.edit =  { href: '/lists/'+task.list+'/tasks/'+task.id+'/edit' };
			task.delete =  { href: '/lists/'+task.list+'/tasks/'+task.id+'/confirmDelete' };
			task.close =  { href: '/'+task.list+'/' };
			return task;
		};
		
		var c =  result.length;
		while(c--) {
			if(status[result[c].status]){
				var task = addLinks(result[c]);
				status[result[c].status].push(task);
			}
//			console.log(status[result[c].status]);
		}
		res.render(__dirname+"/views/wall.html", {	
			selectors: {
				'title': 'dappado.com - your lists',
				'#header': header(req),
				'#notStarted': {
					partial: 'task.html',
					data: status.notStarted,
				},
				'#inProgress': {
					partial: 'task.html', 
					data: status.inProgress
				},
				'#done': {
					partial: 'task.html', 
					data: status.done
				},
				'#hideaway': {
					partial: 'bin.html'
				},
				'#deleted': {
					partial: 'task.html', 
					data: status.deleted
				},
				'.hidden': {
					partial: 'newTask.html'
				},
				'form': {
					action: '/'+params.list+'/tasks/new'
				},
				'.wall': params.list,
				'input#list': {
					value: params.list
				}
			}
		});
	}, params);
};

exports.saveStatus = function(req, res){
/*	if(!req.loggedIn){
		 res.send('text', { 'Content-Type': 'text/plain' }, 401);
			return false;
	}
	*/
	ds.updateList({
		status:req.params.status,
		ids:req.body.ids
	}, function() {
		res.send('ok');
	});
};

exports.taskNew = function(req, res) {
	if(!req.loggedIn){
		res.end('permission denied');
		return false;
	}
	ds.newTask(req.body.list, req.body.title, req.body.text, function(data) {
		var url = '/'+req.body.list+'/task/'+data.insertId;
		res.send(url, { 
			'Content-Type': 'text/plain'
		 }, 201);
	});
};



exports.users_new = function(req, res) {
/*
	if(!req.loggedIn){
		res.redirect('/test');
		return false;
	}
	*/
	res.render(__dirname+'/views/user_create.html', {
		selectors : {
			h1: 'Hi '+ ( req.username || ' Simon McManus' ),
			'form': {
				'.action': urls.USER_NEW
			},
			'input:[name="username"]': {
				value: 'BOB'
			},
			'#lights': {
				className: 'off'
			}
		}
	});
};

exports.users_taken = function(req, res) {
	ds.userGet({
		username: req.params.user
	}, function(data) {
		if(data.length === 0){
			res.send('{"taken": false}');
		}else {
			res.send('{"taken": true}');	
		}
	});
	
};

exports.users_new_POST = function(req, res) {
	if(!req.loggedIn){
		res.redirect('/test');
		return false;
	}
	
	// create loginUser
	// see if username is avaiable.
	// if avaiable - create it and take user to space 
	// if not available - ask user to suggest name - settings page
	// IF USER NAME IS AVAAILBLE DO THE FOLLOWING: 
	ds.user_new({
		login: req.username,
		username: req.body.username
	}, function() {
		console.log('CREATED');
		res.redirect('/'+req.body.username);
	});


};

exports.POST_taskEdit = function(req, res){
	if(!req.loggedIn){
		 res.send('text', { 'Content-Type': 'text/plain' }, 401);
		return false;
	}
	
	ds.updateTask({
		id:req.params.task,
		task:req.body
	}, function(data) {
		res.redirect('/'+req.params.list);
	});
};

exports.GET_taskEdit = 	function(req, res){
	ds.getTask({
		id:req.params.task
	}, function(data) {
		
		res.render(__dirname+'/views/edit_task.html', {
			layout:false,
			selectors: {
				'form textarea': {
					id: data[0].id+"Textarea",
					value: data[0].text
				},
				'form input[name="title"]': {
					value: data[0].title,
					placeholder: data[0].title
				},
				'form input[name="list"]': {
					value: data[0].list
				}
			}
		});
	});
};

exports.GET_task = 	function(req, res){
	ds.getTask({
		id:req.params.task
	}, function(data) {
		res.render('partials/task.html', {
			layout:false,
			selectors: {
				'.id': data[0].id,
				'.text': data[0].text,
				'.title': data[0].title
			}
		});
	});
};

exports.comments = function(req, res){
	ds.getComments({
		id:req.params.task
	}, function(data) {
		res.render(__dirname+'/views/comments', {
			layout:false,
			selectors: {
				'.commentsArea': {
					partial: 'comments.html',
					data: data
				}
			}
		});
	});
};

exports.newComment = function(req, res){
	
	
	if(!req.loggedIn){
		 res.send('text', { 'Content-Type': 'text/plain' }, 401);
		return false;
	}

	ds.newComment({
		id: req.params.task,
		username: req.user, 
		comment: req.body
	}, function(data) {
		res.render('comments', {			
			layout:false,
			locals: {
				wall: req.params.list,
				id: req.params.task,
				task: data[0]
			}
		});		
	});
};
