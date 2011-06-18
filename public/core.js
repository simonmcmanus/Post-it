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




var postTasks = function(status, ids) {
	console.log(status, ids);
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
			callback();
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
	$task = $('li.open');
	$task.append('<div class="saving">Saving...</div>');
	$form = $task.find('form').eq(0);
		$.ajax({
			type:"POST",
			url:"/lists/smm/tasks/"+$task.attr('id')+"/edit/",
			data:$form.serialize(),
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
	
	
	
	$('#header').slideUp();
	$( "ul.tasks" ).sortable("disable" )
	$(task).addClass('open');
	var textareaId = $(task).attr('id')+'Text';
	// get edit form
	$.get('/lists/smm/tasks/'+id+'/edit/', function(data) {
		$('ul.tasks li.open div.edit').html(data).fadeIn(200);
		$('ul.tasks li.open .edit button').click(saveTask);
		$('ul.tasks li.open .read').hide();
	});
	getComments(id, function() {
		$('ul.tasks li.open .comments .comment').hide();			
	});
	$('#overlay').show().css({'opacity':0}).animate({'opacity': 0.8});
	
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
		/*
	 	nicEditors.allTextAreas({
			iconsPath : '/public/nicEdit/nicEditorIcons.gif'
		});
		*/
		$(this).find('.edit').animate({opacity:1}, 100);
		
//				area1 = new nicEditor({fullPanel : false, buttonList:['bold','italic','underline','left','center', 'right', 'ul']}).panelInstance(textareaId,{hasPanel : true});
		setTimeout(function() {
						$(task).find('.comments').show();
			$(task).find('.comment').hide().slideDown();			
//				$(that).find('.comment').css('opacity', 0).show().animate({'opacity': 1}, 200);
		}, 500);
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
	console.log($task.find('div.edit'));
	$('ul.tasks li a.edit').fadeIn(100);
	
	$('#header').slideDown(900);
	
	$task.find('.read').show();
	
	$task.removeClass('open');
	$('ul.tasks li.open .edit').fadeOut(100);
	$('ul.tasks li.open .read').show();
	$('#overlay').fadeOut(900, function() {
		$task.css({zIndex:1});
	});
	
	 $( "ul.tasks" ).sortable({"disabled": false})
	
};


var closeClick = function(e) {
	e.preventDefault();
	close();
	return false;
};


var showNewTask = function(e) {
	e.preventDefault();
	var nt = $('li.new_task').clone();
	nt.find('form.new').submit(submitNewTask);
	$('#notStarted').prepend(nt);
	nt.focus();
	
 nicEditors.allTextAreas({
	iconsPath : '/public/nicEdit/nicEditorIcons.gif'
});

	
};

var submitNewTask = function(e) {
//	e.preventDefault();
	console.log(this);
//	return false;
	
}



$(document).ready(function() {
	
	
	$(document).keyup(function(e) {
	  if (e.keyCode == 27) { 
			close();
		 }   // esc
	});

	$('ul.tasks li .edit').click(open);
	$('#overlay').click(close);
	$('ul.tasks li .close').click(closeClick);
	$('ul.tasks li').hover(function() {
		if(postit.isLoggedIn == "true"){
			$(this).find('a.edit').animate({opacity:1}, 200);
			
		}
	}, function() {
		$(this).find('a.edit').animate({opacity:0}, 200);
		
	});

	$('#header a.newTask').click(showNewTask);
	$('ul.tasks li').hover(function() {
		$(this).find('.status li').fadeIn('fast').css({'position':'absolute'});
	}, function() {
		$(this).find('.status li').fadeOut('fast');		
	});

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
				console.log(this);
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