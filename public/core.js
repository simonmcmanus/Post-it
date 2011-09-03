




/***

TODOs

tidy up mess below. 

get save working	
clean up css
perge task
get new task working ajax			
get socket IO working again. 


*
**/















/*
var changeTasks = function(event, ui) {
	var s =$(this).sortable('toArray').join(', ');
	console.log('s is : ', s);
	var $items = $(this).find('li');
	var c = $items.length;
	var list = [];
	while (c--) {
		var title = $items.eq(c).find('h3').html();
		var updated = false;
		if($items.eq(c).hasClass('updated')){	
			updated = true;
		}
		console.log($items.eq(c));
		if (typeof title !== "undefined") {
			var item = {
				id: $items.eq(c)[0].id,
				title: title,
				description: $items.eq(c).find('div').html(),
				link: $items.eq(c).find('a').html(),
				owner: "",
				updated:updated
			};
			list.push(item);
		}
	}
	var id = this.id;
	var obj = {};
	obj[id] = list;
	send(JSON.stringify(obj), this.id);
};
*/

// EVENTS


// END EVENTS







pi.views.task = function() {
//	that.add('comments', 'task', 'taskEdit');
};




$(function() {
	
});








var closeClick = function(e) {
	e.preventDefault();
	close();
	return false;
};


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


var getNewTask = function(url) {
	$.ajax({
		type:'GET',
		url:url,
		success: function(data){
			var $task = $(data);
			$task.hover(taskHoverIn, taskHoverOut);
			$('#notStarted').prepend($task);
			$('#notStarted .new_task').hide();
		}
	})
}


var cssOpenTask = function() {
	$(this).addClass('makeBig');
	setTimeout(function() {
		$('.login .note.makeBig').addClass('done');
	}, 2000);	
};




// when the users attention is focused on one area
var focus = {
	close: function() {}
}



var taskHoverIn = function() {
//	$(this).find('div.button').animate({opacity:1}, 300);
	$(this).addClass('taskHover');
};

var taskHoverOut = function() {
	//$(this).find('div.button').animate({opacity:0}, 300);	
	$(this).removeClass('taskHover');
	
};


var ckEditorConfig = {
	extraPlugins : 'autogrow',
	removePlugins : 'resize elementspath',
	toolbar: 'Basic',
	toolbar_Basic: [   [ 'Bold', 'Italic' ] ],
	autoUpdateElement: true /* TODO: use textarea */

};

$(document).ready(function() {


/*
	$('.login .note').click(cssOpenTask);
	$('ul.tasks li .edit').click(open);
	$('#overlay').click(close);
	$('ul.tasks li .close').click(closeClick);
	$('ul.tasks li').hover(taskHoverIn, taskHoverOut);
	$('#header a.newTask').click(showNewTask);
*/	
	/*
	$('ul.tasks li').hover(function() {
		$(this).find('.status li').fadeIn('fast').css({'position':'absolute'});
	}, function() {
		$(this).find('.status li').fadeOut('fast');		
	});
	*/

});
function message(obj){
	if(typeof obj.message === "undefined") return false;
	data = JSON.parse(obj.message[1]);
	for (name in data){
		var list = $('ul#'+name)
		list.empty();
		var d = data[name];
		c = d.length;
		while(c--){
			var item = d[c];
			var clazz = (item.updated) ? "updated" : "";
			if(item.id){
				list.append("<li id='"+item.id+"' class='"+clazz+"'><h3>"+item.title+"</h3><div class='desc'>"+item.description+" </div><img width='30px' src='http://www.clker.com/cliparts/c/2/I/7/X/w/male-teacher-2-th.png' /></li>");							
			}
		}		
	}
	
	$('ul.tasks li.updated').animate({
			border:"3px solid #fd1010"
		}, 2000, 
		function() {
			$(this).removeClass('updated');
			setTimeout(function() {
				//console.log(this);
			},5000)
		}
	);		
	
}
/*
function send(val){
	socket.send(val);
}

var socket = new io.Socket( $('h1').html() );
socket.connect();
socket.on('message', function(obj){
	if ('buffer' in obj){          
		for (var i in obj.buffer) {
			message(obj.buffer[i]);
		}
	} else message(obj);
});

*/