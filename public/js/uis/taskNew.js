pi.ui.taskNew = function() {
	var that = this;
	var init = function() {
		$('#header a.newTask').click(showNewTask);
	};

	var getNewTask = function(url) {
		$.ajax({
			type:'GET',
			url:url,
			success: function(data){
				var $task = $(data);
				$('#notStarted').prepend($task);
				$('#notStarted .new_task').hide();
			}
		})
	}

	var showNewTask = function(e) {
		e.preventDefault();
		var nt = $('li.new_task:first').clone();
		nt.removeClass('new_task');
		nt.find('form.new').submit(submitNewTask);
		var node = $(nt).prependTo('#notStarted');
		var $textarea = node.find('textarea');
		$textarea.attr('id', Math.random());
		editor = CKEDITOR.replace( $textarea.get(0).id, ckEditorConfig);	
		node.find('input').focus();
		$('html,body').animate({scrollTop:$('input#title').position().top+50},1500);

	};
	
	var submitNewTask = function(e) {
		e.preventDefault();
		var $form = $(this);
		var list = $('.wall').html();
		$.ajax({
			type:"POST",
			url:$form.attr('action'),
			data:'list='+list+'&title='+$form.find('#title').val()+'&text='+encodeURIComponent(editor.getData())+'',
			success: function(data, textStatus, jqXHR) {
				$form.parent('li').remove();
				getNewTask(data);
			}
		})
		return false;	
	}

	init();
	return that;
}

pi.ui.taskNew.prototype = pi.base;
pi.ui.taskNew.contstructor = pi.constructor;

$(document).ready(function() {
	pi.ui.taskNew = pi.ui.taskNew();	
});
