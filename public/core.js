




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

var events = $({});

events.bind('closeOverlay', function() {
    alert('simons eent ');
})


// END EVENTS




var pi = {
	urls: {
		workspace: '/$workspace/',
		task: '/lists/smm/tasks/$id/edit/',
		comment: '/task/$id/comment/$id/',
		comments: '/task/$idcomments/'
	},
	base: {
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
		update: function() {

		},
		listen: function(event, callback) {
			// register callback
			callback(data);
		}
	}
};

pi.ui = {};

pi.ui.task = function() {
	var that = this;
	that.id = "159";
	var init = function(selector) {
		that.domNode = $(selector);
		that.id = that.domNode.attr('id');
	};
	
	var url = function() {
		return pi.urls.task.replace('$id', that.id);
	};
	that.get = function() {
		$.ajax({
			url: url(),
			success: that.got
		});	
	};
	that.got = function(data) {
		console.log(data);
	};
	
	
	that.get();
}

pi.ui.task.prototype = pi.base;
pi.ui.task.contstructor = pi.constructor;
pi.ui.task = new pi.ui.task();



var postTasks = function(status, ids) {
	//console.log(status, ids);
		$.ajax({
			type:"POST",
			url:"/lists/smm/status/"+status+"/edit/",
			data:'ids='+ids,
			success: function(data) {
				alert('bop');
			}
		})
};

var changeTasks = function(event, ui) {
	var s = $(this).sortable('toArray').join(', ');
	postTasks($(this).attr('id'), s);
};

$(function() {
	$( "ul.tasks" ).sortable({
		connectWith: ".tasks",
		placeholder: "placeholder",
		forcePlaceholderSize: true,
		update: changeTasks 
	}).disableSelection();
});

var getComments = function(id, callback) {
	$.get('/lists/smm/tasks/'+id+'/comments/', function(data) {
		$('ul.tasks li.open .comments').html(data);
		if(callback){			
			callback(data);
		}
		$('.new-comment button').click(function(e) {
			e.preventDefault();
			var $form = $(this).parent();
			

			$.ajax({
				type:"POST",
				url:"/lists/smm/tasks/"+id+"/comments/new",
				data:$form.serialize(),
				success: function(data) {
					getComments(id);
				}
			})
			return false;
		})
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
	//console.lvog(data);
	var url = "/lists/smm/tasks/"+$task.attr('id')+"/edit/";
	console.log(url);
	console.log(data);
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

var open = function(e) {
	e.preventDefault();
	var task = $(this).parents('li');
	var id = $(task).attr('id');
	if($(task).hasClass('open')){
		return false;
	}
//	$('#header').slideUp();
	$( "ul.tasks" ).sortable("disable" )
	$(task).addClass('open');
	var textareaId = $(task).attr('id')+'Text';
	// get edit form
	$.get('/lists/smm/tasks/'+id+'/edit/', function(data) {
		
		var $edit = $('ul.tasks li.open div.edit');
		$edit.append(data).fadeIn(200);
		
		var $textarea = $edit.find('textarea');
		var html = $textarea.html();
		$textarea.hide();
		

		
		//console.log($textarea.attr('id'));
		editor = CKEDITOR.replace( $textarea.attr('id'), $.extend(ckEditorConfig, {
			autoGrow_maxHeight: 600,
			removePlugins : 'resize',
		}));
	
		$('ul.tasks li.open .edit button').click(saveTask);
	
		
		$('ul.tasks li.open .read').hide();
	});
	getComments(id, function() {
		$('ul.tasks li.open .comments').hide();			
	});
	overlay.open();
	
	var top = $(task).offset().top;
	var left = $(task).offset().left;
	var width = $(task).width();
	var height = $(task).height();
	
	
	task.attr('data-original-top', top);
	task.attr('data-original-left', width);
	task.attr('data-original-width', left);
	
	$(task).css({
		width:width,
		left:left,
		height:height,
		zIndex:100,
		position:'absolute'			
	});
	
	
	$(task).removeClass('task');
	
	$('ul.tasks li a.edit').fadeOut(100);
	$('html,body').animate({scrollTop:top-100},1500);
	var status = task.parents('ul.tasks').attr('id');
	
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
	$(task).css({height:'auto'});
	
	
	$(task).animate({
		width:w,
		left:l,
	}, 400, function() {
		$(this).find('.edit').animate({opacity:1}, 100);
		
		setTimeout(function() {
						$(task).find('.comments').show();
			$(task).find('.comment').hide().fadeIn();			
//				$(that).find('.comment').css('opacity', 0).show().animate({'opacity': 1}, 200);
		}, 240);
	});
};



var closeClick = function(e)  {
	e.preventDefaults();
	close();
	return false;
};

var close = function() {
	$('.comments').hide();
	
	var $task = $('li.open');
	
	
	$task.addClass('tilt').css({
		top:0,
		left:0,
		width:'250px',
		position:'relative'
	});
	
	$('div.edit').hide();
	//console.log($task.find('div.edit'));
	$('ul.tasks li a.edit').fadeIn(100);
	
	$('#header').slideDown(900);
	
	$task.find('.read').show();
	
	$task.removeClass('open');
	$('ul.tasks li.open .edit').fadeOut(100);
	$('ul.tasks li.open .read').show();
	overlay.close();
	 $( "ul.tasks" ).sortable({"disabled": false})
	
};


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


var keyBindings = function(e) {
	if (e.keyCode == 27) { 
		close();
	}   // esc
	//console.log('boppin');
};


var overlay = {
	open: function() {
		$('#overlay').show().css({'opacity':0}).animate({'opacity': 0.8}, 100);		
	},
	close: function(callback) {
		focus.close();
		$('#overlay').fadeOut(200, function() {
			if(callback)
			callback();
		});
	}
}

// when the users attention is focused on one area
var focus = {
	close: function() {}
}

var confirmArchieve = function() {
	$('#vtip').append('<hr/><p>are you sure? </p> <button class="no">no</button> <button href="#" class="yes">yes</button>');

var $task = $(this).parents('li');
 	$task.find('.vtip').unbind();
	focus.close = cancelArchieve;
	$('#vtip .yes').click(doArchieve); 
	overlay.open();
	$task.addClass('confirmDelete');
	return false;	
};


var cancelArchieve = function() {
	vtip2.close();
};
var doArchieve = function(e) {
	e.preventDefault();
	vtip2.close();
	var 	$task = $('.confirmDelete');
	var width = $task.width();
	overlay.close(function() {
		$task.css({zIndex:1});
	});
	
	var pos = width / 2;
	
	var $img = $('<img src="/public/img/smoke.png" class="smokePuff" />');
	$img.css({
		left:pos,
		position:'absolute',
		'margin-left': '53px',
	    'margin-top': '-10px'
	});
	$task.children().fadeOut();
	
	$task.animate({
		width:20,
		'margin-left':pos,
		height: 20
	}, 130, function() {
		$task.parent().append($img);
		
		$img.css({
			position:'absolute',
			'margin-left':pos,
			top:$task.position().top,
			left: $task.position().left
		});
		$task.hide();
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
			$task.appendTo('#bin').fadeIn().css({width:'auto'}).find('section').show();;
		})
		
	//	$task.hide();
	});
	postTasks('deleted', $task.attr('id'));
	return false;			
};



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
//	$(document).keyup(keyBindings);


	$('.login .note').click(cssOpenTask);
	$('ul.tasks li .edit').click(open);
	$('#overlay').click(close);
	$('ul.tasks li .delete').click(confirmArchieve);
	$('ul.tasks li .close').click(closeClick);
	$('ul.tasks li').hover(taskHoverIn, taskHoverOut);
	$('#header a.newTask').click(showNewTask);
	
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