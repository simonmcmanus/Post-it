

pi.ui.taskEdit = function(id) {
	var that = this;
	that.id = null;
	var init = function(id) {
		that.id = id;
		if(!that.domNode){
			get();			
		}
	};

	var url = function() {
		return pi.urls.task.replace('$id', that.id).replace('$board', $('.wall').html());
	};
	
	var get = function(callback) {
		$.get('/lists/smm/tasks/'+that.id+'/edit/', gotData);
	};
	
	var gotData = function(data) {
			that.domNode = $('ul.tasks li.open div.edit');
			that.domNode.append(data).fadeIn(200);
			var $textarea = that.domNode.find('textarea');
			var html = $textarea.html();
			$textarea.hide();
			editor = CKEDITOR.replace( $textarea.attr('id'), $.extend(ckEditorConfig, {
				autoGrow_maxHeight: 600,
				removePlugins : 'resize',
			}));
			that.domNode.find('button').click(saveTask);
			that.domNode.find('read').hide();
	};
	
	that.show = function() {
		that.domNode.show()
	};
	
	that.update = function() {
		that.get(function(data) {
			that.domNode.replaceWith(data);
		});	
	};
	
	
	
	var saveTask = function(e) {
		e.preventDefault();
		var $task = $('li.open');
		$task.append('<div class="saving">Saving...</div>');
		var $form = $task.find('form').eq(0);
		var title = $task.find('[name=title]')[0].value;
		var list = $('.wall').html();
		var data = 'list="'+list+'"&title="'+title+'"&text="'+encodeURIComponent(editor.getData())+'"';
		var url = "/lists/smm/tasks/"+$task.attr('id')+"/edit/";
		$.ajax({
			type:"POST",
			url:url,
			data:data,
			success: function(data) {
				$task.find('.saving').html('Saved...').fadeOut(1000, function() {
					$(this).remove();
				});
				//getComments(id);
			}
		})
	};
	

	that.post = function() {
		var title = that.domNode.find('[name=title]')[0].value;
		$.ajax({
			type: "POST",
			url: url(),
			data: 'list="'+$('.wall').html()+'"&title="'+title+'"&text="'+encodeURIComponent(editor.getData())+'"',
			success: function(data) {
				that.domNode.find('.saving').html('Saved...').fadeOut(1000, function() {
					$(this).remove();
				});
			}
		})		
	};

	init(id);
	return that;
}

pi.ui.taskEdit.prototype = pi.base;
pi.ui.taskEdit.contstructor = pi.constructor;

