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
