define(['plugins/router', 'knockout', 'infrastructure/Cookie', 'infrastructure/date'], function (router, ko, Cookie, date) {
	var d = new Date(),
		month = date.monthFormat(),
		day = date.dateFormat();

	router.hashTable = ko.computed(function () {
		var output = {};

		router.navigationModel().forEach(function (navModel) {
			output[navModel.hash] = navModel;
		});

		return output;
	});

	return {
		router: router,
		nav: ko.observable('partials/unlogged.html'),
		activate: function () {
			var promise;

			router.map([
				{ route: '', title: 'Log In', moduleId: 'controllers/login', nav: true },
				{ route: 'login', title: 'Log In', moduleId: 'controllers/login', nav: true },
				{ route: 'logout', title: 'Log Out', moduleId: 'controllers/logout', nav: true },
				{ route: 'pebbles', title: 'Pebbles', moduleId: 'controllers/pebbleTemplates', nav: true },
				{ route: 'month/:month', title: 'Month', moduleId: 'controllers/month', nav: true },
				{ route: 'day/:day', title: 'Day', moduleId: 'controllers/day', nav: true }
			]).buildNavigationModel();

			promise = router.activate();

			return promise;
		},
		logout: function () {
			Cookie.set("accessCode", "", -365);
			router.navigate("#login");
		},
		monthString: month,
		dayString: day
	};
});