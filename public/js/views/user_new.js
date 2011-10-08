
pi.views.user_new = function() {
	var that = this;
	var id = null;
	
	var init = function() {
		that.domNode = $('.papers');
		$('input[name="username"]').keyup(change);
	};
	
	var change = function() {
		
		var node = this;
		$.getJSON( 
			pi.urls.get('USER_TAKEN', {'user': $(node).val()}),
			function(data) {
				if(data.taken === false){
					$(node).removeClass('unavailable');
					$(node).addClass('available');					
					that.domNode.find('input[type="submit"]').removeAttr('DISABLED', 'DISABLED');
					that.domNode.find('.error').fadeOut();
				}else {
					$(node).addClass('unavailable');
					$(node).removeClass('available');
					that.domNode.find('input[type="submit"]').attr('DISABLED', 'DISABLED');		
					that.domNode.find('.error').fadeIn();
				}
			}
		);
	};
	


	that.open = function(id) {

	};
	
	

	
	init();
	return this;
};

pi.views.user_new.prototype = base;
pi.views.user_new.constructer = base;

$(document).ready(function() {
	pi.views.user_new = new pi.views.user_new();
});