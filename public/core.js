/***

TODOs

tidy up mess below. 

get save working
clean up css
get new task working			
get sort working
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
			$('.new-comment input').click(function() {
				var form = $(this).parent();
				$.ajax({
					type:"POST",
					url:"/lists/smm/tasks/"+id+"/comments/new",
					data:form.serialize(),
					success: function(data) {
						getComments(id);
					}
				})
				
			})
		});
		
	
};





var open = function(e) {
	e.preventDefault();
	
	
	
	var task = $(this).parents('li');
	var id = $(task).attr('id');
	if($(task).hasClass('open')){
		return false;
	}
	
	console.log(task);
//		 $( "ul.tasks" ).sortable("disable" )
	
	$(task).addClass('open');
	var textareaId = $(task).attr('id')+'Text';
	// get edit form
	$.get('/lists/smm/tasks/'+id+'/edit/', function(data) {
	$('ul.tasks li.open .edit').html(data);
	$('ul.tasks li.open .read').hide();
		$('#'+textareaId).aloha();		
	});
	getComments(id, function() {
		$('ul.tasks li.open .comments .comment').hide();			
	});
	$('#overlay').show().css({'opacity':0}).animate({'opacity': 0.8});
	
	
	//var rightpos = $(window).width()-400;
	var top = $(task).offset().top;
	var left = $(task).offset().left;
	var width = $(task).width();
	
	$(task).css({
		width:width,
		top:top,
		left:left,
		zIndex:100,
		position:'absolute'			
	});
	$(task).removeClass('tilt');
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
		
		
//				area1 = new nicEditor({fullPanel : false, buttonList:['bold','italic','underline','left','center', 'right', 'ul']}).panelInstance(textareaId,{hasPanel : true});
		setTimeout(function() {
			
			$(task).find('.comment').slideDown();
			
//				$(that).find('.comment').css('opacity', 0).show().animate({'opacity': 1}, 200);
		}, 800);
	});
};

var close = function() {
	$('.comments').hide();
	$('li.open').addClass('tilt').animate({
		'position':'relative',
		width:250,
		display:'list-item',
		left:'auto',
		top:'auto'
		}, 400);
		$('ul.tasks li.open .edit').fadeOut(100);
		$('ul.tasks li.open .read').show();
		$('#overlay').fadeOut(500);;
};

var showNewTask = function(e) {
	e.preventDefault();
	var nt = $('li.new_task').clone();
	nt.find('form.new').submit(submitNewTask);
	$('#notStarted').prepend(nt);
	nt.focus();
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