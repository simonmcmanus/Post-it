
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
		
	};
	var changeTasks = function(event, ui) {
		var s = $(this).sortable('toArray').join(', ');
		postTasks($(this).attr('id'), s);
	};
	var postTasks = function(status, ids) {
		$.ajax({
			type:"POST",
			url:"/lists/smm/status/"+status+"/edit/",
			data:'ids='+ids,
			success: function(data) {
			}
		})
	};
	var findTasks = function() {
		$('.tasks li').each(function() {
			that.uis.push(new pi.ui.task(this));
			
		});
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