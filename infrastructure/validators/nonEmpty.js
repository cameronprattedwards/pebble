define([], function () {
	return function (message) {
		return function (target) {
			if (!target() || !target().length)
				target.errors.push(message);
		}
	};
});