define([], function () {
	return function (str, paddingValue) {
	   return String(paddingValue + str).slice(-paddingValue.length);
	};	
});