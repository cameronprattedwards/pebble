define(["ko-data/entity/Entity", 
	"ko-data/type/String", 
	"ko-data/type/Number"], function (Entity, String, Number) {
	return Entity.extend({
		id: Number,
		message: String,
		type: String
	});
});