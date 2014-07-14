define(["persistence/repos/PebbleRepo"], function (PebbleRepo) {
	function Pebble(model) {
		var _self = this;

		this.model = model;
		this.message = model.message();
		this.value = ko.observable(model.value());
		this.type = ko.observable(model.type());
		this.templateType = ko.observable(model.templateType());

		model.templateType.subscribe(function (value) {
			_self.templateType(value);
		});

		this.value.subscribe(function () {
			_self.save();
		});
	};

	Pebble.prototype = {
		takeTemplateType: function () {
			this.type(this.templateType());
			this.value(undefined);
			this.save();
		},
		save: function () {
			this.writeToModel();
			PebbleRepo.add(this.model);
			PebbleRepo.save();
		},
		writeToModel: function () {
			this.model.type(this.type());
			this.model.value(this.value());
		}
	};

	return Pebble;
});