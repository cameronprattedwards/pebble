define(["persistence/repos/PebbleTemplateRepo", 
	"domain/entities/PebbleTemplate",
	"viewModels/PebbleTemplate",
	"plugins/router",
	"controllers/shell"], function (PebbleTemplateRepo, PebbleTemplate, PebbleTemplateVm, router, shell) {
	return {
		activate: function () {
			shell.nav("partials/logged.html");
			var models = PebbleTemplateRepo.where();
			this.viewModels = models.extend({
				map: function (pt) { return new PebbleTemplateVm(pt); } 
			});

			models.promise.fail(function (e) {
				if (e === "Forbidden")
					router.navigate("/login");
			});
		},
		addNew: function () {
			this.viewModels.push(new PebbleTemplate());
		}
	};
});