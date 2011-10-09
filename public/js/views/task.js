
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
	
	var pushState = function() {
	//	var url = that.domNode.find('a.edit').attr('href');
	//	window.history.pushState({ path: url }, "Title", url);
	};
	
	var pushStateClose = function() {
	//	var url = that.domNode.find('a.close').attr('href');
	//	window.history.pushState({path: url}, "Title", url);		
	};
	
	// handle the back and forward buttons


	that.open = function(id) {
			that.domNode = $('#'+id);
			
			if(that.domNode.hasClass('open')){
				return false;
			}
			$( "ul.tasks" ).sortable("disable" )
			that.domNode.addClass('open');
			var textareaId = id+'Text';
			that.editForm = new pi.ui.taskEdit(id);		
		
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
//			$('html,body').animate({scrollTop:top-100},200);
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

			pushState();
			that.domNode.animate({
				width:w,
				left:l,
			}, 400, function() {

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
		pushStateClose();
		$('.comments').hide();
		var o=CKEDITOR.instances[that.domNode.attr('id')+'Textarea'];
		if (o) o.destroy();
		that.domNode.find('.edit').empty();
		that.domNode.addClass('tilt').css({
			top:0,
			left:0,
			zIndex:1,
			width:'250px',
			position:'relative'
		});
		$('div.edit').hide();
//		$('ul.tasks li a.edit').removeClass('hidden');
		$('#header').slideDown(900);
		
		that.domNode.removeAttr('data-original-top');
		that.domNode.removeAttr('data-original-left');
		that.domNode.removeAttr('data-original-width');
		
		that.domNode.find('.read').show();
		that.domNode.removeClass('open');
		$( "ul.tasks" ).sortable({"disabled": false});
		
	};

	pi.events.bind('closeTask', function() {
		close();
	});
	
	pi.events.bind('overlayClose', function() {
		if(that.domNode){
			closeTask();
		}else {
			vtip2.close();			
		}
	});
	
	init();
	return this;
};

pi.views.task.prototype = base;
pi.views.task.constructer = base;

$(document).ready(function() {
	pi.views.task = new pi.views.task();
});