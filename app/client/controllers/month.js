define(['plugins/router', 'infrastructure/pad', 'controllers/shell'], function (router, pad, shell) {
	return {
		activate: function (month) {
			shell.nav("partials/logged.html");
			var split = month.split("-").map(function (num) { return parseInt(num) });
			this.date = new Date(split[0], split[1], 1);
		},
		goToDay: function (string, datePicker) {
			router.navigate('#day/' 
				+ datePicker.selectedYear 
				+ "-" 
				+ pad(datePicker.selectedMonth, "00") 
				+ "-" 
				+ pad(datePicker.selectedDay, "00")
			);
		}
	};
});