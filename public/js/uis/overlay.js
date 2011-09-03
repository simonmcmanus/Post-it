
pi.ui.overlay = {
	open: function() {
		$('#overlay').show().css({'opacity':0}).animate({'opacity': 0.8}, 100);	
		$('#overlay').click(function() {
			pi.events.trigger('overlayClose');
		});	
	},
	closeOther: function() {
		
	},
	close: function(callback) {
		$('#overlay').fadeOut(200, function() {
			if(callback)
				callback();
		});
	}
}


pi.events.bind('overlayOpen', function() {
	pi.ui.overlay.open();
});

pi.events.bind('overlayClose', function() {
	pi.ui.overlay.close();
});
