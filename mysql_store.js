var sql = require('./mysql_base.js');

exports.getList = function(params, callback) {
	sql.query('SELECT * FROM items', params, callback);
}


exports.newList = function(title, text, callback) {
	sql.query('INSERT INTO items VALUES ("null", "'+title+'", "'+text+'", "")', callback);
}


exports.getTask = function(params, callback) {
	var query = 'SELECT * FROM items where id="'+params.id+'"';
	console.log(query);
	sql.query(query, params, callback);	
};



exports.updateTask = function(params, callback) {
	console.log('wpoppa', params);
	var query = 'UPDATE ITEMS SET text="'+params.task.text+'", title="'+params.task.title+'", tags="'+params.task.tags+'" where id="'+params.id+'"';
	console.log(query);
	sql.query(query, params, callback);	
};

exports.getAllList = function() {
	sql.query('SELECT * FROM lists', callback);
}

exports.createList = function() {
	sql.query('INSERT INTO * FROM lists', callback);
}


exports.updateList = function() {
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