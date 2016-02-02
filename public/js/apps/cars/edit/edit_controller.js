CarManager.module("CarsApp.Edit", function(Edit, CarManager, Backbone, Marionette, $, _){
	Edit.Controller = {
		editCar: function(carVin){
			var loadingView = new CarManager.Common.Views.Loading({
				title: "Loading ...",
				message: "Data is loading."
			});
			CarManager.regions.main.show(loadingView);

			var fetchingCar = CarManager.request("car:entity", carVin);
			$.when(fetchingCar).done(function(car){
				var view;
				if(car !== undefined){
					view = new Edit.Car({
						model: car,
						generateTitle: true
					});

					view.on("form:submit", function(data){
						if(car.save(data)){
							CarManager.trigger("car:show", car.get("vin"));
						}else{
							view.triggerMethod("form:data:invalid", car.validationError);
						}
					});
				}
				else{
					view = new CarManager.CarsApp.Show.MissingCar();
				}

				CarManager.regions.main.show(view);
			});
		}
	};
});
