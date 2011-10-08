var sql = require('./mysql_base.js');

exports.getList = function(params, callback) {
	sql.query("SELECT * FROM items where list='"+params.list+"' ORDER BY 'order' ASC", params, callback);
}

exports.getComments = function(params, callback) {
	var q = 'SELECT * FROM comments WHERE TASK_ID = "'+params.id+'"';
	sql.query(q, params, callback);
};

exports.newComment = function(params, callback) {
//	console.log('parasm', params);
	if(params.comment.text !== ""){
		var date = new Date;
		var q = 'INSERT INTO comments  VALUES ("null", "'+params.comment.text+'", "'+params.username+'", "'+date+'", "'+params.id+'")';
		//console.log(q);
		sql.query(q, params, callback);
	}else {
		callback(null, 'no text');
	}
};

exports.newTask = function(list, title, text, callback) {
	var q = 'INSERT INTO items VALUES ("null", "'+title+'", "'+text+'", "", "notStarted",  "1", "", "'+list+'")';
	//console.log(q);
	sql.query(q, {}, callback);
}

exports.getTask = function(params, callback) {
	sql.query('SELECT * FROM items where id="'+params.id+'"', params, callback);	
};

exports.updateTask = function(params, callback) {
	var title = params.task.title.slice(1, -1); //strip quotes;
	var text = params.task.text.slice(1, -1);
	var query = 'UPDATE ITEMS SET text="'+text+'", title="'+title+'", tags="'+params.task.tags+'" where id="'+params.id+'"';
	sql.query(query, params, callback);
};


exports.userGet = function(params, callback) {
	sql.query('SELECT * FROM users where username="'+params.username+'"', params, callback);	
	
};

exports.user_new = function(params, callback) {
	sql.query('insert into users values ("", "'+params.username+'", "user description")', params, function(data, params) {
		sql.query('insert into userLogin values ("", "'+data.insertId+'", "'+params.login +'")', params, callback);		
	});

	
	// username avaiable, lets make it for them.
	
	
};

// Is this login known on the system?
exports.knownLogin = function(login, knownCallback, unknownCallback) {
	console.log('select * from userLogin, users where userLogin.login="'+login+'" and  userLogin.users_id=users.id');
 	sql.query('select * from userLogin, users where userLogin.login="'+login+'" and  userLogin.users_id=users.id', {}, function(data, params) {

 		console.log('in here', data.length);
 		
 		if(data.length === 0){
 			unknownCallback(data);
 		}else {
 			knownCallback(data);
 		}
 	});
};


exports.newUserLogin = function(params, callback) {
	sql.query('insert into userLogin values ("", "'+params.username+'", "simonmcmanus@twitter")');
};

/*

Accepts a list of ids seperated by a comma.
@param - id
@param - status
*/
exports.updateList = function(params, callback) {
	var ids = params.ids.split(',');
	var c = ids.length;
	var ids_sql = [];
	while(c--) {
		if(ids[c]!="" && ids[c]!=" ") {
			if(c != ids.length-1 && c!=-1) {
				ids_sql.push(' OR ');		
			}
			ids_sql.push('items.id="');
			ids_sql.push(ids[c]);
			ids_sql.push('"');
			var q = 'UPDATE items set items.order="'+c+'" where items.id="'+ids[c]+'"';
			console.log(q);
			sql.query(q);
		}
	}

	if(ids_sql.length==0) {
		return false;
	}
	var query = 'UPDATE items SET status="'+params.status+'" WHERE  '+ids_sql.join('');
	
	
	
	
	console.log(query);
	sql.query(query, callback);
};



exports.taskNew = function(params, callback) {
	
};


exports.getAllList = function() {
	sql.query('SELECT * FROM lists', callback);
}

exports.createList = function() {
	sql.query('INSERT INTO * FROM lists', callback);
}


/*
// outcome : 

var model = function() {
	this.lists 
	
}

list.addItem();
list.new();
 

*/