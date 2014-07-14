define(["domain/entities/PebbleTemplate", "persistence/repos/BaseRepo"], function (PebbleTemplate, BaseRepo) {
	var PebbleTemplateRepo = BaseRepo.extend({
		entity: PebbleTemplate,
		entityName: "pebbleTemplate",
		pluralEntityName: "pebbleTemplates"
	});

	return new PebbleTemplateRepo();
});