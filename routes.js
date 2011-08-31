var ds = require('./mysql_store.js'); // set datastore

exports.home = function(req, res){
	res.send('<a href="/lists/smm/wall.html">see demo list</a>');
};

exports.login = function(req, res){
	res.render('login.html');
};

exports.wall = function(req, res){
	var params = {};
	params.list = req.params.list;
	
//    req.session.redirectTo =  '/'+params.list; // redirect back to this url after login.
	ds.getList(params, function(result, params) {
		var c = result.length;
		var status = {
			notStarted:[],
			inProgress:[],
			done:[]
		};
		while(c--) {
			if(status[result[c].status]){
				status[result[c].status].push(result[c]);
			}
		}
		var user = (req.user) ? req.user : '';
		var image = (req.image) ? req.image : '';

		res.render("wall.html", {	
			selectors: {
				'title': 'lst.ee - your lists',
				'#header': (user === "") ? {
						partial: 'login.html',
					} : {
						partial: 'loggedIn.html',
						classifyKeys: false,
						data: [{
							'.username': user,
							'img src': image
						}]
					},
				'#notStarted': {
					partial: 'task.html',
					data: [{text: 'dfdf'}], 
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
	ds.updateList({
		status:req.params.status,
		ids:req.body.ids
	}, function() {
		res.send('ok');
	});
};

exports.taskNew = function(req, res) {
	ds.newTask(req.body.list, req.body.title, req.body.text, function(data) {
		var url = '/'+req.body.list+'/task/'+data.insertId;
		res.send(url, { 
			'Content-Type': 'text/plain'
		 }, 201);
	});
};

exports.POST_taskEdit = function(req, res){
	ds.updateTask({
		id:req.params.taskId,
		task:req.body
	}, function() {
		res.redirect('/'+req.params.wall);
	});
};

exports.GET_taskEdit = 	function(req, res){
	ds.getTask({
		id:req.params.taskId
	}, function(data) {
		res.render('edit_task.html', {
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
		id:req.params.taskId
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
		id:req.params.taskId
	}, function(data) {
		res.render('comments', {
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
/*	if(!req.loggedIn){
		res.end('permission denied');
		return false;
	}
*/
	ds.newComment({
		id: req.params.taskId,
		username: req.user, 
		comment: req.body
	}, function(data) {
		res.render('comments', {			
			layout:false,
			locals: {
				wall: req.params.wall,
				id: req.params.taskId,
				task: data[0]
			}
		});		
	});
};