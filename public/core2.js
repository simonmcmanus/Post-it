

var log = console.log;

var base = {
	init : function(selector) {
		this.domNode = $(selector);
	},
	open: function() {
		log('ui open');
		this.domNode.show();
	},
	close: function() {
		that.domNode.hide();
	},
	get: function() {
		$.get();
	},
	update: function() {
		
	},
	post: function() {
		$.post();		
	},
	listen: function(event, callback) {
		// register callback
		callback(data);
	}	
};

/* --------------------------------------- */

var overlay = function(selector) {
	var that = this;
	this.init('#overlay');
	that.open = function() {
		that.domNode.show().css({'opacity':0}).animate({'opacity': 0.8});		
	}
};
overlay.prototype = base;
overlay.constructer = base;

/* --------------------------------------- */

var header = function(selector) {
	var that = this;
	this.init('#header');
	that.open = function() {
		that.domNode.slideDown();	
	}
	that.close = function() {
		that.domNode.slideUp();	
	}
};
header.prototype = base;
header.constructer = base;

/* --------------------------------------- */


var task = function(selector) {
	var that = this;
	that.init(selector);
	
	
	that.comments = {
		open : function() {
			
		},
		close : function() {
			
		}
	};
	
	
	that.animateIn = function(task, callback) {
		
		var top = $(task).offset().top;
		var left = $(task).offset().left;
		var width = $(task).width();
		var height = $(task).height();

		task.attr('data-original-top', top);
		task.attr('data-original-left', width);
		task.attr('data-original-width', left);

		$(task).css({
			width:width,
			top:top,
			left:left,
			height:height,
			zIndex:100,
			position:'absolute'			
		});
		$(task).removeClass('tilt');
		
		$('ul.tasks li a.edit').fadeOut(100);

		$('html,body').animate({scrollTop:top-100},1000);
		var status = task.parents('ul.tasks').attr('id');
		if(status == 'notStarted'){
			var l = left;
			var w = $(window).width()-400;
		}else if(status == 'inProgress'){
			var l = 150;
			var w = $(window).width()-400;
		}else if(status == 'done'){
			var l = left- $(window).width()/1.4  +200 ;
			var w = $(window).width()/1.3;
		}

		$(task).animate({
			top:top,
			width:w,
			left:l,
		}, 1000, function() {
			$(this).css({height:'auto'});
	//				area1 = new nicEditor({fullPanel : false, buttonList:['bold','italic','underline','left','center', 'right', 'ul']}).panelInstance(textareaId,{hasPanel : true});
			setTimeout(function() {
				$(task).find('.comment').slideDown();			
	//				$(that).find('.comment').css('opacity', 0).show().animate({'opacity': 1}, 200);
			}, 500);
		});
	};
	
	that.open = function() {
	  	var task = that.domNode;
		$( "ul.tasks" ).sortable("disable" )
		task.addClass('open');
		that.animateIn(task, function() {
			
		});
	};
}
task.prototype = base;
task.constructer = base;


/* --------------------------------------- */
	
$(document).ready(function() {
/*	var view = {
		board: new task('#41'),
		overlay: new overlay()
	}
	*/	
	//console.log(board);
	
	var options = {
		task:  '#35',
		overlay: '#overlay',
		header: '#header'
		
	};
	var v = view(options);
	v.open();
	//uis.board.open();
});

/*


var templates = {
	board: {
		notStarted {
			selector: '#notStarted',
			url: ''
		}
		inProgress: {
			selector: '#inProgress',
			url: ''
		}
		done: {
			selector: '#done',
			url: ''
		}
		
	},
	task: {
		selector: '#board',
		url: '/smm/wall.html'
	}
	
};
*/

