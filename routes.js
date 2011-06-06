var ds = require('./mysql_store.js'); // set datastore
	

exports.wall = function(req, res){
	var params = {};
	params.list = req.params.file.replace('/wall.html', '');
	ds.getList(params, function(result, params) {
		
		
		console.log('result', result);
		var c = result.length;
		var status = {
			notStarted:[],
			inProgress:[],
			done:[]
		};
		while(c--) {
			status[result[c].status].push(result[c]);
		}
		
		res.render("wall.html", {
			locals:{
				title:params.list,
				list:result,
				status:status
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

exports.POST_taskEdit = 	function(req, res){
	console.log(req);
	ds.updateTask({
		id:req.params.taskId,
		task:req.body
	}, function() {
		res.redirect('/lists/'+req.params.wall+'/wall.html#'+req.params.taskid);
	});
};



exports.GET_taskEdit = 	function(req, res){
	ds.getTask({
		id:req.params.taskId
	}, function(data) {
		console.log('in here', data);
		res.render('edit_task.html', {
			layout:false,
			locals: {
				task:data[0]
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
			locals: {
				wall: req.params.wall,
				id: req.params.taskId,
				comments: data
			}
		});		
	});
};


exports.newComment = function(req, res){
	ds.newComment({
		id:req.params.taskId,
		comment:req.body
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