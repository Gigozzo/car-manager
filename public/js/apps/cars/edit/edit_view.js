CarManager.module("CarsApp.Edit", function(Edit, CarManager, Backbone, Marionette, $, _){
	Edit.Car = CarManager.CarsApp.Common.Views.Form.extend({
		initialize: function(){
			this.title = "Edit " + this.model.get("vin");
		},

		onRender: function(){
			if(this.options.generateTitle){
				var $title = $('<h1>', { text: this.title });
				this.$el.prepend($title);
			}

			this.$(".js-submit").text("Update car details");
		}
	});
});
