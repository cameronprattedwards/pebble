define(['persistence/repos/PebbleRepo', 
	'ko-data/repo/where', 
	'viewModels/Pebble',
	'controllers/shell',
	'infrastructure/currentDate'], function (PebbleRepo, where, PebbleVm, shell, currentDate) {
	return {
		activate: function (day) {
			shell.nav("partials/logged.html");
			this.pebbles = PebbleRepo
				.where(where("day").is(day))
				.extend({ 
					map: function (pebble) { return new PebbleVm(pebble); }
				});
		},
		currentDate: currentDate()
	};
});