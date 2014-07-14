var requirejs = require('requirejs');

requirejs.config({
	nodeRequire: require,
	baseUrl: __dirname + '/../..'
});

requirejs(['express', 
	'body-parser', 
	'crypto', 
	'cookie-parser',
	'domain/entities/Pebble'], function (express, bodyParser, crypto, cookieParser, Pebble) {

	console.log("Pebble: ", Pebble);

	var router = express.Router(),
		app = express(),
		users = [];

	router.post("/api/users", function (req, res) {
		var body = req.body,
			existing = users.filter(function (user) {
				return user.email === req.body.email;
			});

		if (!existing.length) {
			body = Object.create(body);
			body.pebbleTemplates = [];
			body.pebbles = [];
			body.password = crypto.createHash('sha1').update(body.password).digest("hex");
			body.days = {};
			req.body.accessCode = parseInt(Math.random() * 100000);
			res.cookie("accessCode", req.body.accessCode);
			users.push(body);
			res.send(req.body);
		} else {
			res.send({ error: "User found for email " + req.body.email });
		}
	});

	router.get("/api/users", function (req, res) {
		var existing = users.filter(function (user) {
			return user.email === req.query.email 
				&& user.password === crypto
					.createHash('sha1')
					.update(req.query.password)
					.digest("hex");
		});

		if (existing.length) {
			var found = existing[0],
				output = {
					email: found.email,
					pebbles: found.pebbles,
					pebbleTemplates: found.pebbleTemplates
				};

			res.cookie("accessCode", found.accessCode);

			res.send([output]);
		} else {
			res.status(404).send({ error: "No user found for those credentials" });
		}
	});

	router.get("/api/users/me", function () {
		var accessCode = req.cookies.accessCode,
			user = users.filter(function (user) {
				return user.accessCode == accessCode;
			})[0];

		res.send(user || null);
	});

	router.get("/api/pebbleTemplates", function (req, res) {
		var accessCode = req.cookies.accessCode,
			user = users.filter(function (user) {
				return user.accessCode == accessCode;
			})[0];

			if (!user) {
				res.status(403).send({ error: "You aren't logged in" });
			} else {
				res.send(user.pebbleTemplates);
			}
	});

	router.post("/api/pebbleTemplates", function (req, res) {
		var accessCode = req.cookies.accessCode,
			user = users.filter(function (user) {
				return user.accessCode == accessCode;
			})[0],
			body = req.body,
			date,
			today;

			if (!user) {
				res.status(403).send({ error: "You aren't logged in" });
			} else {
				body.id = parseInt(Math.random() * 100000);
				body.pebbles = [];
				user.pebbleTemplates.push(body);

				today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

				for (var x in user.days) {
					var split = x
								.split("-")
								.map(function (num) { return parseInt(num) });
					date = new Date(split[0], split[1], split[2]);
					if (date >= today) {

					}

				}
				res.send(body);
			}
	});

	router.get("/api/pebbles", function (req, res) {
		var accessCode = req.cookies.accessCode,
			user = users.filter(function (user) {
				return user.accessCode == accessCode;
			})[0],
			day;

			if (!user) {
				res.status(403).send({ error: "You aren't logged in" });
			} else {
				day = user.days[req.query.day];
				if (!day) {
					var arr = req
								.query
								.day
								.split("-")
								.map(function (num) { return parseInt(num) }),
						today = new Date(arr[0], arr[1], arr[2]);

					day = user.days[req.query.day] = user.pebbleTemplates.map(function (pt) {
						var pebble = {};
						pebble.message = pt.message;
						pebble.type = pt.type;
						pebble.value = undefined;
						pebble.id = parseInt(Math.random() * 10000);
						pebble.templateType = "";
						pebble.updated = false;
						pebble.date = today;
						pt.pebbles.push(pebble);
						return pebble;
					});
				}
				res.send(day);
			}
	});

	router.param("pebble", function (req, res, next, id) {
		var accessCode = req.cookies.accessCode,
			user = users.filter(function (user) {
				return user.accessCode == accessCode;
			})[0],
			pebble;

		if (!user) {
			res.status(403).send({ error: "You aren't logged in" });
		} else {
			for (var x in user.days) {
				pebble = user.days[x].filter(function (pebble) {
					return pebble.id == id;
				})[0];
				if (pebble)
					break;
			}

			if (!pebble) {
				res.status(404).send({ error: "Pebble not found with ID " + id });
			} else {
				req.pebble = pebble;
				next();
			}
		}
	});

	router.put("/api/pebbles/:pebble", function (req, res) {
		for (var x in req.body) {
			if (req.pebble.hasOwnProperty(x) && x !== "updated")
				req.pebble[x] = req.body[x];
		}

		if (req.body.hasOwnProperty("type"))
			req.pebble.templateType = "";

		req.pebble.updated = true;

		res.send(req.pebble);
	});

	router.param("pebbleTemplate", function (req, res, next, id) {
		var accessCode = req.cookies.accessCode,
			user = users.filter(function (user) {
				return user.accessCode == accessCode;
			})[0],
			pebbleTemplate;

		if (!user) {
			res.status(403).send({ error: "You aren't logged in" });
		} else {
			pebbleTemplate = user.pebbleTemplates.filter(function (pt) {
				return pt.id == id;
			})[0];

			if (!pebbleTemplate) {
				res.status(404).send({ error: "Pebble template not found with ID " + id });
			} else {
				req.pebbleTemplate = pebbleTemplate;
				next();
			}
		}
	});

	router.put("/api/pebbleTemplates/:pebbleTemplate", function (req, res) {
		var real = req.pebbleTemplate,
			now;

		for (var x in req.body) {
			if (real.hasOwnProperty(x))
				real[x] = req.body[x];
		}

		if (req.body.hasOwnProperty("type")) {
			now = new Date();
			real.pebbles.forEach(function (pebble) {
				if (pebble.date >= now) {
					if (!pebble.updated) {
						pebble.type = req.body.type;
					} else {
						pebble.templateType = req.body.type;
					}
				}
			})
		}

		res.send(req.pebbleTemplate);
	});

	app.use(cookieParser());
	app.use(bodyParser.json());
	app.use("", router);
	app.use("", express.static(__dirname + "/../client"));
	app.use("", express.static(__dirname + "/../.."));

	console.log(__dirname + "/../client");
	app.listen(3000, function () {
		console.log('listening on *:3000');
	});	

});