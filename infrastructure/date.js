define(["infrastructure/pad"], function (pad) {
	return {
		monthFormat: function () {
			var d = new Date();

			return pad(d.getFullYear(), "0000") 
				+ "-"
				+ pad(d.getMonth(), "00");
		},
		dateFormat: function () {
			var d = new Date();

			return pad(d.getFullYear(), "0000") 
				+ "-"
				+ pad(d.getMonth(), "00")
				+ "-"
				+ pad(d.getDate() , "00");
		}
	};
});