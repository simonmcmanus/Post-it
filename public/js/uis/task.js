

pi.ui.task = function(selector) {
	var that = this;
	that.id = null;
	var init = function(selector) {
		that.domNode = $(selector);
		that.id = that.domNode.attr('id');
		that.domNode.find('.delete').click(confirmDelete);
		that.domNode.find('.edit').click(that.open);
		that.domNode.find('.close').click(closeClick);
		// listfor(taskUpdate, newComment, edit);
	};

	
	var url = function() {
		return pi.urls.task.replace('$id', that.id).replace('$board', $('.wall').html());
	};
	
	that.get = function(callback) {
		$.ajax({
			url: url(),
			success: callback
		});	
	};
	
	that.update = function() {
		that.get(function(data) {
			that.domNode.replaceWith(data);
		});	
	};
	
	var doDeleteClick = function(e){
			e.preventDefault();
			that.doDelete();	
			return false;
	};
	
	that.doDelete = function() {
		var width = that.domNode.width();
		var pos = width / 2;
		var $img = $('<img src="/public/img/smoke.png" class="smokePuff" />');
		$img.css({
			left:pos,
			position:'absolute',
			'margin-left': '53px',
		    'margin-top': '-10px'
		});
		that.domNode.children().fadeOut();
		pi.ui.overlay.close();
		vtip2.close();
		that.domNode.animate({
			width:20,
			'margin-left':pos,
			height: 20
		}, 130, function() {
			that.domNode.parent().append($img);

			$img.css({
				position:'absolute',
				'margin-left':pos,
				top:that.domNode.position().top,
				left: that.domNode.position().left
			});
			that.domNode.hide();
			$img.animate({
				width:'+=60',
				height:'+=60',
				top:'-=40',
				left:'-=60',
			}, 400)
			.animate({
				top:$('#bin').offset().top	
			}, 400, function() {
				$(this).fadeOut('fast');
				that.domNode.appendTo('#bin').fadeIn().css({width:'auto'}).find('section').show();;
			})

		//	that.domNode.hide();
		});
		pi.views.board.postTasks('deleted', that.domNode.attr('id'));
		return false;			

	};
	

	var cancelDeleteClick = function(e) {
		e.preventDefault();
		cancelDelete();
	};

	var cancelDelete = function() {
		pi.ui.overlay.close();
		vtip2.close();
	};
	
	var confirmDelete = function(e) {
		e.preventDefault();
		$('#vtip').append('<hr/><p>are you sure? </p> <button href="#" class="no">no</button> <button href="#" class="yes">yes</button>');
		$('#vtip').addClass('enabled');
		$('#vtip .yes').click(doDeleteClick); 
		$('#vtip .no').click(cancelDeleteClick); 
		pi.ui.overlay.open();
	};
	
	
	that.open = function(e) {
		e.preventDefault();
		pi.events.trigger('openTask', [$(this).parents('li').attr('id')]);
	};
	
	
	var closeClick = function(e)  {
		e.preventDefault();
		pi.events.trigger('closeTask');
		return false;
	};
	
	that.post = function() {
		var title = that.domNode.find('[name=title]')[0].value;
		$.ajax({
			type: "POST",
			url: url(),
			data: 'list="'+$('.wall').html()+'"&title="'+title+'"&text="'+encodeURIComponent(editor.getData())+'"',
			success: function(data) {
				that.domNode.find('.saving').html('Saved').fadeOut(1000, function() {
					$(this).remove();
				});
			}
		})		
	};
	that.save = function() {
		e.preventDefault();
		that.domNode = $('li.open');
		that.domNode.append('<div class="saving">Saving...</div>');
		that.post();
	};
	init(selector);
	return that;
}

pi.ui.task.prototype = pi.base;
pi.ui.task.contstructor = pi.constructor;

