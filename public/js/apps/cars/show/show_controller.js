CarManager.module("CarsApp.Show", function(Show, CarManager, Backbone, Marionette, $, _){
	Show.Controller = {
		showCar: function(carVin){
			var loadingView = new CarManager.Common.Views.Loading({
				title: "Artificial Loading Delay",
				message: "Data loading is delayed to demonstrate using a loading view."
			});

			CarManager.regions.main.show(loadingView);

			var fetchingCar = CarManager.request("car:entity", carVin);

			$.when(fetchingCar).done(function(car){
				var carView;

				if(car !== undefined){
					carView = new Show.Car({model: car});

					carView.on("car:edit", function(car){
						CarManager.trigger("car:edit", car.get("vin"));
					});
				}
				else{
					carView = new Show.MissingCar();
				}

				CarManager.regions.main.show(carView);
			});
		}
	}
});
