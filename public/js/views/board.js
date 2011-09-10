
pi.views.board = function() {
	var that = this;
	var init = function() {
		findTasks();
		$( "ul.tasks" ).sortable({
			connectWith: ".tasks",
			placeholder: "placeholder",
			forcePlaceholderSize: true,
			update: changeTasks 
		}).disableSelection();
		

		var down = function($node) {
			$node.animate({
				top:'+=13em'
			}, 300);
			$node.addClass('down');
		};
		
		var up = function($node) {
			$node.animate({
				top:'-=13em'
			}, 300);
			$node.removeClass('down');
		};


		up($('li.user .sublinks'));
		
		$('li.user').click(function(e) {
			e.preventDefault();
			if($(this).find('.sublinks.down').length == 0){
				down($(this).find('.sublinks'));
			}else {
				up($(this).find('.sublinks'));
			}
		})
		
		/*
		$('.sublinks').mouseleave(function() {
			up($(this));
		});
		*/
		
		
		
	};
	var changeTasks = function(event, ui) {
		var s = $(this).sortable('toArray').join(', ');
		that.postTasks($(this).attr('id'), s);
	};
	var findTasks = function() {
		$('.tasks li').each(function() {
			that.uis.push(new pi.ui.task(this));
			
		});
	};
	that.postTasks = function(status, ids) {
		$.ajax({
			type:"POST",
			url:"/lists/smm/status/"+status+"/edit/",
			data:'ids='+ids,
			success: function(data) {
			}
		})
	};
	
	pi.events.bind('openTask', function(e, id) {
		pi.views.task.open(id);
	});
	
	
	init();
	return this;
};

pi.views.board.prototype = base;
pi.views.board.constructer = base;



$(document).ready(function() {
	pi.views.board = new pi.views.board();
});