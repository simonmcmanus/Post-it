exports.home = '/';
exports.login = '/login';
exports.lists = '/lists',
 exports.list = '/:list',
 exports.list_new = '/lists/new',
 exports.tasks = '/lists/$0/tasks',
 exports.task = '/lists/$0/tasks/$1',
 exports.users = '/users',
 exports.users_new =  '/users/new',
 exports.user = '/users/$0';



/**
 * returns the url
 * params: 
 * type - string - 
 */

exports.get = function(type, tokens) {
	console.log(exports[type], tokens);
	return exports.build(exports[type], tokens);	
};

exports.build = function(str, tokens) {
	for(token in tokens){
		str = str.replace(':'+token, tokens[token]);
	}
	return str;
}

