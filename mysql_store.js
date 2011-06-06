var sql = require('./mysql_base.js');

exports.getList = function(params, callback) {
	sql.query('SELECT * FROM items', params, callback);
}

exports.getComments = function(params, callback) {
	var q = 'SELECT * FROM comments WHERE TASK_ID = "'+params.id+'"';
//	console.log(q);
	sql.query(q, params, callback);
};

exports.newComment = function(params, callback) {
//	console.log('parasm', params);
	var q = 'INSERT INTO comments  VALUES ("null", "'+params.comment.text+'", "Simon McManus", "123", "'+params.id+'")';
	//console.log(q);
	sql.query(q, params, callback);
};

exports.newTask = function(title, text, callback) {
	var q = 'INSERT INTO items VALUES ("null", "'+title+'", "'+text+'", "", "notStarted")';
	console.log(q);
	sql.query(q,  callback);
}

exports.getTask = function(params, callback) {
	sql.query('SELECT * FROM items where id="'+params.id+'"', params, callback);	
};

exports.updateTask = function(params, callback) {
	console.log(params, params.task);
	var query = 'UPDATE ITEMS SET text="'+params.task.text+'", title="'+params.task.title+'", tags="'+params.task.tags+'" where id="'+params.id+'"';
	sql.query(query, params, callback);	
};


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