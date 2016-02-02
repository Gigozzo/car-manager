CarManager.module("CarsApp", function(CarsApp, CarManager, Backbone, Marionette, $, _){
	CarsApp.Router = Marionette.AppRouter.extend({
		appRoutes: {
			"cars(/filter/criterion::criterion)": "listCars",
			"cars/:carVin": "showCar",
			"cars/:carVin/edit": "editCar"
		}
	});

	var API = {
		listCars: function(criterion){
			CarsApp.List.Controller.listCars(criterion);
		},

		showCar: function(carVin){
			CarsApp.Show.Controller.showCar(carVin);
		},

		editCar: function(carVin){
			CarsApp.Edit.Controller.editCar(carVin);
		}
	};

	CarManager.on("cars:list", function(){
		CarManager.navigate("cars");
		API.listCars();
	});

	CarManager.on("cars:filter", function(criterion){
		if(criterion){
			CarManager.navigate("cars/filter/criterion:" + criterion);
		}
		else{
			CarManager.navigate("cars");
		}
	});

	CarManager.on("car:show", function(carVin){
		CarManager.navigate("cars/" + carVin);
		API.showCar(carVin);
	});

	CarManager.on("car:edit", function(carVin){
		CarManager.navigate("cars/" + carVin + "/edit");
		API.editCar(carVin);
	});

	CarsApp.on("start", function(){
		new CarsApp.Router({
			controller: API
		});
	});
});
