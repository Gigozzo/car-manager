CarManager.module("CarsApp.List", function(List, CarManager, Backbone, Marionette, $, _){
	List.Layout = Marionette.LayoutView.extend({
		template: "#car-list-layout",

		regions: {
			panelRegion: "#panel-region",
			carsRegion: "#cars-region"
		}
	});

	List.Panel = Marionette.ItemView.extend({
		template: "#car-list-panel",

		events: {
			"submit [data-id=filter-form]": "filterCars",
			"submit [data-id=add-car-form]": "addCar"
		},

		ui: {
			criterion: "input.js-filter-criterion"
		},

		// Add car handler, trigger
		addCar: function(e){
			// get VIN and delete all spaces. Finally ecsape this string.
			var VIN = escape(this.$(".js-car-vin").val().replace(/\s+/g, ''));
			this.clearAddFormError().trigger("car:add", VIN);

			return false;
		},

		filterCars: function(e){
			var criterion = this.$(".js-filter-criterion").val();
			this.trigger("cars:filter", criterion);
		},

		clearAddFormError: function(){
			var $form = this.$el.find("[data-id=add-car-form]");

			$form.find(".help-block.error").remove();
			$form.find(".form-group.has-error").removeClass("has-error");
			return this
		},

		onSetFilterCriterion: function(criterion){
			this.ui.criterion.val(criterion);
		},

		onWrongVin: function(error) {
			var $controlGroup = this.$el.find(".js-car-vin").parent();
			var $errorEl = $("<span>", { class: "help-block error", text: error });

			this.clearAddFormError()
			$controlGroup.prepend($errorEl).addClass("has-error");
		}
	});

	List.Car = Marionette.ItemView.extend({
		tagName: "tr",
		template: "#car-list-item",

		triggers: {
			"click td a.js-show": "car:show",
			"click td a.js-edit": "car:edit",
			"click button.js-delete": "car:delete"
		},

		flash: function(cssClass){
			var $view = this.$el;

			$view.hide().toggleClass(cssClass).fadeIn(800, function(){
				setTimeout(function(){
					$view.toggleClass(cssClass)
				}, 500);
			});
		},

		remove: function(){
			var self = this;
			this.$el.fadeOut(function(){
				Marionette.ItemView.prototype.remove.call(self);
			});
		}
	});

	var NoCarsView = Marionette.ItemView.extend({
		template: "#car-list-none",
		tagName: "tr",
		className: "alert"
	});

	List.Cars = Marionette.CompositeView.extend({
		tagName: "table",
		className: "table table-hover",
		template: "#car-list",
		emptyView: NoCarsView,
		childView: List.Car,
		childViewContainer: "tbody",

		events:{

		},

		initialize: function(){
			this.listenTo(this.collection, "reset", function(){
				this.attachHtml = function(collectionView, childView, index){
					collectionView.$el.append(childView.el);
				}
			});
		},

		onRenderCollection: function(){
			this.attachHtml = function(collectionView, childView, index){
				collectionView.$el.prepend(childView.el);
			}
		}
	});
});
