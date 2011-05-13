var changeTasks = function(event, ui) {
	var s =$(this).sortable('toArray').join(', ');
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
$(function() {
	$( "ul.tasks" ).sortable({
		connectWith: ".tasks",
		placeholder: "placeholder",
		forcePlaceholderSize: true,
		update: changeTasks 
	}).disableSelection();	});
	

$(document).ready(function() {
	
	$('ul.tasks li').click(function(){
//		$(this).addClass('animateOut');
		
		$(this).addClass('open');
		var textareaId = $(this).attr('id')+'Text';
		$.get('http://127.0.0.1:8000/lists/smm/tasks/1/edit/', function(data) {
			console.log(data);
			$('ul.tasks li.open .edit').html(data);
			$('ul.tasks li.open .read').hide();
			
				$('#'+textareaId).animate({
							width:$(window).width()-800			
						}, 1000);
			
		
			});
		
		
		
		$('#overlay').show().css({'opacity':0}).animate({'opacity': 0.8});
		
		
		//var rightpos = $(window).width()-400;
		var top = $(this).offset().top;
		var left = $(this).offset().left;
		var width = $(this).width();
		console.log('top is: ', top);
		
		$(this).css({
			width:width,
			top:top,
			left:left,
			rotate:"0deg",
			zIndex:100,
			position:'absolute'			
		});
		$(this).removeClass('tilt');
  		$('html,body').animate({scrollTop:top-100},1000);
		console.log(textareaId);
		
		
		$(this).animate({
			top:top,
			width:$(window).width()-400,
			left:100,
		}, 1000, function() {
				area1 = new nicEditor({fullPanel : false, buttonList:['bold','italic','underline','left','center', 'right', 'ul']}).panelInstance(textareaId,{hasPanel : true});
			var that = this;
			setTimeout(function() {
				
				$(that).find('.comment').slideDown();
				
//				$(that).find('.comment').css('opacity', 0).show().animate({'opacity': 1}, 200);
			}, 800);
		});
		
	});
	
	$('ul.tasks li').hover(function() {
		$(this).find('.status li').fadeIn('fast').css({'position':'absolute'});
	}, function() {
		$(this).find('.status li').fadeOut('fast');		
	});
	/*
	$('ul.tasks li').dblclick(function(){
		if($(this).find('textarea').length >= 0){
			var btn = $("<button>save</button>");
			btn.click(function() {
				$(this).parents('li').html($(this).prev().val());
			});
			$(btn).appendTo($(this).append("<textarea></textarea>"));		
		}
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
				console.log(item);
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