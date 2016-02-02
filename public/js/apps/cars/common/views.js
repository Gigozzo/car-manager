CarManager.module("CarsApp.Common.Views", function(Views, CarManager, Backbone, Marionette, $, _){
	Views.Form = Marionette.ItemView.extend({
		template: "#car-form",

		events: {
			"click button.js-submit": "submitClicked"
		},

		triggers:{
			"click button.js-cancel": "dialog:close"
		},

		submitClicked: function(e){
			e.preventDefault();
			var data = Backbone.Syphon.serialize(this);
			this.trigger("form:submit", data);
		},

		onFormDataInvalid: function(errors){
			var $view = this.$el;

			var clearFormErrors = function(){
				var $form = $view.find("form");
				$form.find(".help-block").each(function(){
					$(this).remove();
				});
				$form.find(".form-group.has-error").each(function(){
					$(this).removeClass("has-error");
				});
			}

			var markErrors = function(value, key){
				var $controlGroup = $view.find("#car-" + key).parent();
				var $errorEl = $("<span>", { class: "help-block", text: value });
				$controlGroup.append($errorEl).addClass("has-error");
			}

			clearFormErrors();
			_.each(errors, markErrors);
		}
	});

	Views.Confirm = Marionette.ItemView.extend({
		template: "#alert-confirm",
		title: "Car already exist. Would you like to open it?",

		triggers: {
			"click button.js-yes": "dialog:yes",
			"click button.js-no": "dialog:close"
		}
	});
});
