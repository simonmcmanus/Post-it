
var view = function(options) {
	var that = this;
	var scope = {};
	new overlay();
	scope.init = function() {
		for(option in options){
			console.log([option]);
			scope[option] = new window[option](options[option]);
		}
	}
	
	scope.open = function() {
		console.log('sc', scope.task.domNode);
		scope.overlay.open();
		scope.task.open();
		scope.header.close();
	}
	scope.init();	
	return scope;
}
view.prototype = base;
view.constructer = base;

/*------------------------------------------*/

/*

var views = {};
views.editTask = function(options) {
	console.log();
	var that = this;
	this.init();
	that.open = function() {
		alert('f');
	}
};


views.editTask.prototype = view;
views.editTask.constructer = view;

*/