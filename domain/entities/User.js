define(['ko-data/entity/Entity', 'ko-data/type/String', 'ko-data/type/Collection', 'domain/entities/PebbleTemplate'], function (Entity, String, Collection, PebbleTemplate) {
	return Entity.extend({
		email: String({ value: undefined }),
		password: String,
		pebbleTemplates: Collection(PebbleTemplate),
		uniqKey: "email"
	});
});