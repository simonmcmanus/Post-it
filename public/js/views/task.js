
pi.views.task = function() {
	var that = this;
	var id = null;
	
	var init = function() {
		$(document).keyup(keyBindings);
	};
	
	
	var keyBindings = function(e) {
		if (e.keyCode == 27) {   // esc
			pi.events.trigger('closeTask');
		} 
	};
	
	

	that.open = function(id) {
			that.domNode = $('#'+id);
			if(that.domNode.hasClass('open')){
				return false;
			}
			$( "ul.tasks" ).sortable("disable" )
			that.domNode.addClass('open');
			var textareaId = that.domNode.attr('id')+'Text';
		//	console.log('ef', editForm);
			if(!that.editForm){
				that.editForm = new pi.ui.taskEdit(id);		
			}else {
				that.editForm.show();
			}
			var comments = new pi.ui.comments(id);
			
			pi.events.trigger('overlayOpen');
			that.domNode.find('.read').hide();
//			var top = that.domNode.offset().top;
			var left = that.domNode.offset().left;
			var width = $(that.domNode).width();
			var height = $(that.domNode).height();
			that.domNode.attr('data-original-top', top);
			that.domNode.attr('data-original-left', width);
			that.domNode.attr('data-original-width', left);
			that.domNode.css({
				width:width,
				left:left,
				height:height,
				zIndex:100,
				position:'absolute'			
			});
			that.domNode.removeClass('task');
			$('ul.tasks li a.edit').fadeOut(100);
			$('html,body').animate({scrollTop:top-100},1500);
			var status = that.domNode.parents('ul.tasks').attr('id');
			if(status == 'notStarted'){
				var l = left;
				var w = $(window).width()-300;
			}else if(status == 'inProgress'){
				var l = 150;
				var w = $(window).width()-400;

			}else if(status == 'done'){
				var l = left- $(window).width()/1.4  +200 ;
				var w = $(window).width()/1.3;

			}
			that.domNode.css({height:'auto'});


			that.domNode.animate({
				width:w,
				left:l,
			}, 400, function() {
				$(this).find('.edit').animate({opacity:1}, 100);

				setTimeout(function() {
					that.domNode.find('.comments').show();
					that.domNode.find('.comment').hide().fadeIn();			
				}, 240);
			});
	};
	
	
	var close = function() {
		closeTask();
		pi.events.trigger('overlayClose');
		
	};
	
	var closeTask = function() {
		$('.comments').hide();
		that.domNode.addClass('tilt').css({
			top:0,
			left:0,
			zIndex:1,
			width:'250px',
			position:'relative'
		});
		$('div.edit').hide();
		$('ul.tasks li a.edit').fadeIn(100);
		$('#header').slideDown(900);
		that.domNode.find('.read').show();
		that.domNode.removeClass('open');
		$('ul.tasks li.open .edit').fadeOut(100);
		$('ul.tasks li.open .read').show();
		$( "ul.tasks" ).sortable({"disabled": false});
		
	};

	pi.events.bind('closeTask', function() {
		close();
	});
	
	pi.events.bind('overlayClose', function() {
		closeTask();
	});
	
	init();
	return this;
};

pi.views.task.prototype = base;
pi.views.task.constructer = base;

$(document).ready(function() {
	pi.views.task = new pi.views.task();
});