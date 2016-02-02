CarManager.module("Entities", function(Entities, CarManager, Backbone, Marionette, $, _){
	Entities.Car = Backbone.Model.extend({
		urlRoot: "cars",

		idAttribute: "vin",

		defaults: {
			vin: "",
			make: "",
			model: "",
			year: "",
			trim: "",
			bodyType: "",
			grossWeight: ""
		},

		validate: function(attrs, options) {
			var errors = {}

			if (! attrs.make) { errors.make = "can't be blank"; }
			if (! attrs.model) { errors.model = "can't be blank"; }

			if (! attrs.year) { errors.year = "can't be blank"; }
			else if (! new RegExp(/^(19[8,9]\d|20\d\d)$/).test(attrs.year)) {
				errors.year = "should be from 1980 to 2099";
			}

			if (! new RegExp(/^\d*$/).test(attrs.grossWeight)) {
				errors.grossWeight = "should be a number";
			}

			if( ! _.isEmpty(errors)){ return errors; }
		}
	});

	Entities.configureStorage("CarManager.Entities.Car");

	Entities.CarCollection = Backbone.Collection.extend({
		url: "cars",
		model: Entities.Car,
		comparator: "vin" // Default sorted field
	});

	Entities.configureStorage("CarManager.Entities.CarCollection");

	var API = {
		getCarEntities: function(){
			var cars = new Entities.CarCollection();
			var defer = $.Deferred();
			cars.fetch({
				success: function(data){
					defer.resolve(data);
				}
			});
			var promise = defer.promise();

			return promise;
		},

		getCarEntity: function(carVin){
			var car = new Entities.Car({vin: carVin});
			var defer = $.Deferred();

			car.fetch({
				success: function(data){ defer.resolve(data); },
				error: function(data){ defer.resolve(undefined); }
			});

			return defer.promise();
		},

		getCarEntityFromEdmunds: function(carVin){
			var defer = $.Deferred();

			// get car data from Edmunds
			$.getJSON( "http://api.edmunds.com/v1/api/toolsrepository/vindecoder?fmt=json&api_key=9ez3tx9ms6tunncyvyah9pbr&vin=" + carVin)
				.done(function(data) {
					console.log( "second success" );
					console.log(data);
					defer.resolve({
						vin:		carVin,
						make:		data.styleHolder[0].makeName,
						model:		data.styleHolder[0].modelName,
						year:		data.styleHolder[0].year,
						trim:		data.styleHolder[0].trim.name,
						bodyType:	data.styleHolder[0].categories.PRIMARY_BODY_TYPE.value,
						// WARN! Sometimes Edmunds returns data without gross weight information! And bottom we catch this.
						grossWeight: (function() {
										try {
											return data.styleHolder[0].attributeGroups.SPECIFICATIONS.attributes.GROSS_VEHICLE_WEIGHT.value
										}catch(error) {
											return undefined }
									 })()
					});
				})
				.fail(function(error) { defer.reject(error); });

			return defer.promise();
		}
	};

	CarManager.reqres.setHandler("car:entities", function(){
		return API.getCarEntities();
	});

	CarManager.reqres.setHandler("car:entity", function(carVin){
		return API.getCarEntity(carVin);
	});

	CarManager.reqres.setHandler("car:entity:from:edmunds", function(carVin){
		return API.getCarEntityFromEdmunds(carVin);
	});
});