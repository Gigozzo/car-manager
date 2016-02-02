var CarManager = new Marionette.Application();

CarManager.navigate = function(route,	options){
	options || (options = {});
	Backbone.history.navigate(route, options);
};

CarManager.getCurrentRoute = function(){
	return Backbone.history.fragment
};

// Set main Layout and regions before app started
CarManager.on("before:start", function(){
	var RegionContainer = Marionette.LayoutView.extend({
		el: "#app-container",

		regions: {
			main: "#main-region",
			dialog: "#dialog-region"
		}
	});

	CarManager.regions = new RegionContainer();
	CarManager.regions.dialog.onShow = function(view){
		var self = this;
		var closeDialog = function(){
			self.stopListening();
			self.empty();
			self.$el.dialog("destroy");
		};

		this.listenTo(view, "dialog:close", closeDialog);

		this.$el.dialog({
			modal: true,
			title: view.title,
			width: "auto",
			close: function(e, ui){
				closeDialog();
			}
		});
	};
});

CarManager.on("start", function(){
	if(Backbone.history){
		Backbone.history.start();

		if(this.getCurrentRoute() === ""){
			CarManager.trigger("cars:list");
		}
	}
});
