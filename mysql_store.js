var sql = require('./mysql_base.js');

exports.getList = function(params, callback) {
	sql.query('SELECT * FROM items', params, callback);
}


exports.newList = function(title, text, callback) {
	sql.query('INSERT INTO items VALUES ("null", "'+title+'", "'+text+'", "")', callback);
}


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