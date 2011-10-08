(function(exports){
	exports.HOME 					= '/';
	exports.URLS 					= '/urls.js';
	exports.LOGIN 					= '/login';

	exports.LISTS 					= '/lists';
	exports.LIST 					= '/:list';
	exports.LIST_NEW 				= '/lists/new';
	exports.LIST_STATUS_EDIT 		= '/lists/:list/status/:status/edit/';

	exports.TASKS 					= '/lists/:list/tasks';
	exports.TASK 					= '/lists/:list/tasks/:task'; // used to be '/:wall/task/:task'
	exports.TASK_NEW 				= '/:list/tasks/new';
	exports.TASK_EDIT 				= '/lists/:list/tasks/:task/edit';
	exports.TASK_COMMENTS			= '/lists/:list/tasks/:task/comments';
	exports.TASK_COMMENT_NEW		= '/lists/:list/tasks/:task/comments/new';

	exports.USERS 					= '/users';
	exports.USER_NEW				= '/users/new';
	exports.USER 					= '/users/:user';
	exports.USER_TAKEN  			= '/users/:user/taken';

	/**
	 * returns the url
	 */
	exports.get = function(type, tokens) {
		return exports.build(exports[type], tokens);	
	};
	exports.build = function(str, tokens) {
		for(token in tokens){
			str = str.replace(':'+token, tokens[token]);
		}
		return str;
	}
})(typeof exports === 'undefined'? pi.urls={}: exports);





