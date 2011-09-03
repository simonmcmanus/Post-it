
pi.views = {};

var base = {
	uis: [],
	open : function(uis) {
		scope.uis = uis;
		var c = this.uis.length;
		while(c--) {
			this.uis[c].open();
		}
	},
	close: function() {
		var c = this.uis.length;
		while(c--) {
			this.uis[c].close();
		}
	},
	update: function() {
		var c = this.uis.length;
		while(c--) {
			this.uis[c].update();
		}		
	},
	delete: function() {
		var c = this.uis.length;
		while(c--) {
			this.uis[c].doDelete();
		}
	},
	add: function(ui) {
		this.uis.push(ui);
	}
};
