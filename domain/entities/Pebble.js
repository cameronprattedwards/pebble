define(["ko-data/entity/Entity", 
	"ko-data/type/Dynamic", 
	"ko-data/type/String", 
	"ko-data/type/Number"], function (Entity, Dynamic, String, Number) {

	return Entity.extend({
		id: Number,
		message: String,
		value: Dynamic,
		type: String,
		templateType: String
	});
});