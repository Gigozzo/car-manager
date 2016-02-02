CarManager.module("CarsApp.Show", function(Show, CarManager, Backbone, Marionette, $, _){
  Show.MissingCar = Marionette.ItemView.extend({
    template: "#missing-car-view"
  });

  Show.Car = Marionette.ItemView.extend({
    template: "#car-view",

    events: {
      "click a.js-edit": "editClicked"
    },

    editClicked: function(e){
      e.preventDefault();
      console.log(this.model);
      this.trigger("car:edit", this.model);
    }
  });
});
