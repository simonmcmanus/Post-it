var pi = {
	urls: {
		workspace: '/$workspace/',
		task: '/$board/task/$id/',	
		taskEdit: '/lists/smm/tasks/$id/edit/',
		comment: '/task/$id/comment/$id/',
		comments: '/task/$idcomments/'
	},
	base: {
		init : function(selector) {
		},
		open: function() {
			this.domNode.show();
		},
		close: function() {
			that.domNode.hide();
		},
		update: function() {

		},
		bind: function(selector) {
			this.domNode = $(selector);			
		},
		listen: function(event, callback) {
			// register callback
			callback(data);
		}
	}
};

var ckEditorConfig = {
	extraPlugins : 'autogrow',
	removePlugins : 'resize elementspath',
	toolbar: 'Basic',
	toolbar_Basic: [   [ 'Bold', 'Italic' ] ],
	autoUpdateElement: true /* TODO: use textarea */

};

$(window).bind('popstate', function(event) {
    // if the event has our history data on it, load the page fragment with AJAX
    var state = event.originalEvent.state;
	console.log(state);
    if (state) {
		var path = state.path.replace(window.location.host , "");
		
		if(path == 'http:///test/'){
			alert('load: '+path);
			close();
		}
    }
});


history.replaceState({ path: window.location.href }, '');