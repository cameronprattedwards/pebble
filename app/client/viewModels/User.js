define(["persistence/repos/UserRepo", 
	"knockout", 
	"infrastructure/validators/nonEmpty", 
	"plugins/router", 
	"ko-data/utils/stackedPromise",
	"ko-data/repo/where",
	"infrastructure/date"], function (UserRepo, ko, nonEmpty, router, stackedPromise, where, date) {
	function User(model) {
		var _self = this,
			validate;
		this.model = model;
		this.email = ko.observable(model.email()).extend({ 
			validate: function (target) {
				if (!/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/i.test(target())) {
					target.errors.push("Please provide a valid email.");
				}
			}
		});
		this.password = ko.observable(model.password()).extend({ validate: nonEmpty("Please provide a password.") });
		this.confirmPassword = ko.observable(model.password()).extend({ 
			validate: function (target) {
				if (target() !== _self.password())
					target.errors.push("Passwords don't match.");
				else if (!target())
					target.errors.push("Please provide a password.");
			}
		});

		this.email.subscribe(function () {
			_self.validate();
		});

		this.password.subscribe(function () {
			_self.validate();
		});

		this.confirmPassword.subscribe(function () {
			_self.validate();
		});

		this.emailMode = ko.observable(false);
		this.passMode = ko.observable(false);
		this.confirmMode = ko.observable(false);

		this.errors = ko.observableArray();

		this.validateCallback = this.fakeValidate;

		this.loginVm = {
			email: ko.observable(),
			password: ko.observable()
		};

		this.loginErrors = ko.observableArray();
	};

	User.prototype = {
		properties: ["email", "password", "confirmPassword"],
		login: function () {
			var _self = this;
			this.loginErrors.removeAll();

			UserRepo
				.where(
					where("email").is(this.loginVm.email()),
					where("password").is(this.loginVm.password)
				)
				.promise
				.done(function (users) {
					var user = users()[0];
					router.navigate(user.pebbleTemplates().length ? "#day/" + date.dateFormat() : "#pebbles");
				})
				.fail(function () {
					if (arguments.length == 3)
						_self.loginErrors.push(arguments[2]);
					else
						_self.loginErrors.push("Login failed for the following reason: " + arguments[0]);
				});
		},
		validateEmail: function () {
			this.emailMode(true);
			this.email.validate();
		},
		validatePassword: function () {
			this.passMode(true);
			this.password.validate();
		},
		validateConfirm: function () {
			this.confirmMode(true);
			this.confirmPassword.validate();
		},
		save: function () {
			this.validateCallback = this.realValidate;

			var _self = this;
			this.validate().done(function () {
				if (_self.errors().length)
					return;

				_self.writeModel();
				UserRepo.add(_self.model);
				UserRepo
					.save()
					.done(function () {
						router.navigate("/pebbles");
					})
					.fail(function (error) {
						var message = ".";
						if (error instanceof Error)
							message = " because: " + error.message + ".";
						else if (error)
							message = " because: " + error + ".";
						_self.errors.push('Save failed' + message);
					});
			});
		},
		writeModel: function () {
			this.model.email(this.email());
			this.model.password(this.password());
		},
		validate: function () {
			return this.validateCallback.apply(this, arguments);
		},
		fakeValidate: function () {
			var _self = this;
			this.properties.forEach(function (prop) {
				if (typeof _self[prop].validate == "function")
					_self[prop].validate();
			});
		},
		realValidate: function () {
			var _self = this,
				promises = [];

			this.errors.removeAll();

			this.properties.forEach(function (prop) {
				if (typeof _self[prop].validate !== "function")
					return;

				var promise = _self[prop].validate();
				promise.done(function () {
					_self.errors.push.apply(_self.errors, _self[prop].errors());
				});
				promises.push(promise);
			});

			return stackedPromise(promises);
		}
	};

	return User;
});