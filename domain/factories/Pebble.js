define([], function () {
	return {
		fromTemplate: function (template, date) {
			return {
				type: template.type,
				value: template.value,
				updated: false,
				templateType: "",
				date: date,
				message: template.message,
				id: parseInt(Math.random() * 100000)
			};
		}
	};
});