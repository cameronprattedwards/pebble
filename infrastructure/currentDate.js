define(["knockout"], function (ko) {
	return function (interval) {
		var start = new Date(),
			output = ko.observable(start);

		if (!arguments.length)
			interval = 1000;

		setTimeout(function () {
			output(new Date());
			setInterval(function () {
				output(new Date());
			}, interval);
		}, 1000 - start.getMilliseconds());

		return output;
	}
});