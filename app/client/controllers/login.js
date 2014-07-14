define(['viewModels/User',
	'domain/entities/User',
	'infrastructure/Cookie',
	'plugins/router',
	'controllers/shell',
	'persistence/repos/PebbleRepo',
	'infrastructure/date'], function (UserVm, User, Cookie, router, shell, PebbleRepo, date) {
	return {
		activate: function () {
			if (Cookie.get("accessCode")) {
				var pebbles = PebbleRepo.where(),
					d;

				pebbles
					.promise
					.done(function () {
						if (pebbles().length)
							router.navigate("/day/" + date.dateFormat());
						else
							router.navigate("/pebbles");
					})
					.fail(function (error) {
						if (error == "Forbidden")
							Cookie.set("accessCode", "", -365);	
					});

				return pebbles.promise;
			}

			shell.nav('partials/unlogged.html');

			this.viewModel = new UserVm(new User());
		}
	};
});