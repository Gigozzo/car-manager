CarManager.module("CarsApp.List", function(List, CarManager, Backbone, Marionette, $, _){
	List.Controller = {
		listCars: function(criterion){
			var loadingView = new CarManager.Common.Views.Loading();
			CarManager.regions.main.show(loadingView);

			var fetchingCars = CarManager.request("car:entities");

			var carsListLayout = new List.Layout();
			var carsListPanel = new List.Panel();

			$.when(fetchingCars).done(function(cars){
				var filteredCars = CarManager.Entities.FilteredCollection({
					collection: cars,

					// Set filter function for common FilteredCollection
					filterFunction: function(filterCriterion){
						var criterion = filterCriterion.toLowerCase();
						return function(car){
							if(car.get("make").toLowerCase().indexOf(criterion) !== -1
								|| car.get("model").toLowerCase().indexOf(criterion) !== -1){
									return car;
							}
						};
					}
				});

				if(criterion){
					filteredCars.filter(criterion);
					carsListPanel.once("show", function(){
						carsListPanel.triggerMethod("set:filter:criterion", criterion);
					});
				}

				var carsListView = new List.Cars({collection: filteredCars});

				// Listener for adding new car
				carsListPanel.on("car:add", function(carVin){
					if(!cars.get(carVin)){
						// Fetch from Edmunds
						var fetchingNewCar = CarManager.request("car:entity:from:edmunds", carVin);
						// Add new car
						$.when(fetchingNewCar).done(function(carData){
							var newCar = new CarManager.Entities.Car();

							if(newCar.save(carData)){
								cars.add(newCar);
							}
						})
						.fail(function(error){ carsListPanel.triggerMethod("wrong:vin", error.statusText); });
					} else {
						// Show modal window
						var confirmView = new CarManager.CarsApp.Common.Views.Confirm();

						confirmView.on("dialog:yes", function(){
							confirmView.trigger("dialog:close");
							CarManager.trigger("car:show", carVin);
						});

						CarManager.regions.dialog.show(confirmView);
					}

				});

				carsListPanel.on("cars:filter", function(filterCriterion){
					filteredCars.filter(filterCriterion);
					CarManager.trigger("cars:filter", filterCriterion);
				});

				carsListLayout.on("show", function(){
					carsListLayout.panelRegion.show(carsListPanel);
					carsListLayout.carsRegion.show(carsListView);
				});

				carsListView.on("childview:car:show", function(childView, args){
					CarManager.trigger("car:show", args.model.get("vin"));
				});

				carsListView.on("childview:car:edit", function(childView, args){
					var model = args.model;
					var view = new CarManager.CarsApp.Edit.Car({ model: model });

					view.on("form:submit", function(data){
						if(model.save(data)){
							childView.render();
							view.trigger("dialog:close");
							childView.flash("success");
						}
						else{
							view.triggerMethod("form:data:invalid", model.validationError);
						}
					});

					CarManager.regions.dialog.show(view);
				});

				carsListView.on("childview:car:delete", function(childView, args){ args.model.destroy(); });

				CarManager.regions.main.show(carsListLayout);
			});
		}

	}
});
