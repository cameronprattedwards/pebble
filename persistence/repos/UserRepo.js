define(["persistence/repos/BaseRepo", "domain/entities/User"], function (BaseRepo, User) {
	var UserRepo = BaseRepo.extend({
		entity: User,
		entityName: "user",
		pluralEntityName: "users"
	});

	return new UserRepo();
});