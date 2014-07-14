define(['persistence/repos/BaseRepo', 'domain/entities/Pebble'], function (BaseRepo, Pebble) {
	var PebbleRepo = BaseRepo.extend({
		entity: Pebble,
		entityName: 'pebble',
		pluralEntityName: 'pebbles'
	});

	return new PebbleRepo();
});