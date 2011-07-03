var ds = require('./mysql_store.js'); // set datastore
	


exports.home = function(req, res){
		res.send('<a href="/lists/smm/wall.html">see demo list</a>');
};

exports.login = function(req, res){
		res.render('login.html');
};


exports.wall = function(req, res){
	var params = {};
	params.list = req.params.file.replace('/wall.html', '');
    req.session.redirectTo =  '/lists/'+params.list+'/wall.html'; // redirect back to this url after login.
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
		res.render("wall.html", {	
			selectors: {
				'title': 'lst.ee - your lists',
				'#header': (user === "") ? {
						partial: 'login.html',
					} : {
						partial: 'loggedIn.html',
						data: [{
							username: user
						}]
					},
				'#notStarted': {
					partial: 'task.html', 
					data: status.notStarted
				},
				'#inProgress': {
					partial: 'task.html', 
					data: status.inProgress
				},
				'#done': {
					partial: 'task.html', 
					data: status.done
				},
				'.wall': 'List: '+params.list
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
}


exports.taskNew = function(req, res) {
	ds.newTask(req.body.title, req.body.text, function() {
		res.send('ok');
	});
};

exports.POST_taskEdit = function(req, res){
	//	(req);
	ds.updateTask({
		id:req.params.taskId,
		task:req.body
	}, function() {
		console.log('CALLBACK', arguments);
		res.redirect('/lists/'+req.params.wall+'/wall.html#'+req.params.taskid);
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
				}
				
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