define([
	"infrastructure/validators/nonEmpty", 
	"persistence/repos/PebbleTemplateRepo", 
	"viewModels/PebbleTemplate"], function (nonEmpty, PebbleTemplateRepo, PebbleTemplateVm) {
	function PebbleTemplate(model) {
		this.model = model;

		this.message = ko.observable(model.message());
		this.type = ko.observable(model.type());
		this.isNew = ko.computed(function () {
			return model.isNew();
		});
	}

	PebbleTemplate.prototype = {
		save: function () {
			this.writeModel();
			PebbleTemplateRepo.add(this.model);
			PebbleTemplateRepo.save();
		},
		writeModel: function () {
			this.model.message(this.message());
			this.model.type(this.type());
		}
	};

	return PebbleTemplate;
});