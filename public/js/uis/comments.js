
pi.ui.comments = function(id) {
	var that = this;
	var init = function(id) {
		that.id = id;
		$('ul.tasks li.open .comments').hide();			
		get();
	};
	
	var gotComments = function(data) {
		$('ul.tasks li.open .comments').html(data);
		$('.new-comment button').click(submitNewComment)
	};

	var submitNewComment = function(e) {
		e.preventDefault();
		var $form = $(this).parent();
		$.ajax({
			type:"POST",
			url:"/lists/smm/tasks/"+that.id+"/comments/new",
			data:$form.serialize(),
			success: function(data) {
				get(id);
			}
		})
		return false;
	};
	
	var get = function() {
		$.get('/lists/smm/tasks/'+that.id+'/comments/', gotComments);
	};
	init(id);
};
pi.ui.comments.prototype = pi.base;
pi.ui.comments.contstructor = pi.constructor;

