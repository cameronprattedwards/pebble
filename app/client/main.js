requirejs.config({
	paths: {
		'text': '../vendor/requirejs-text/text',
		"durandal": "../vendor/durandal/js",
		'plugins' : '../vendor/durandal/js/plugins',
		'transitions' : '../vendor/durandal/js/transitions',
		'jquery': '../vendor/jquery/jquery.min',
		'bootstrap': '../vendor/bootstrap/dist/js/bootstrap.min',
		'wysihtml5': '../vendor/wysihtml5/dist/wysihtml5-0.3.0.min',
		'bootstrap-wysihtml5': '../vendor/bootstrap-wysihtml5/dist/bootstrap-wysihtml5-0.0.2.min',
		'jquery-ui': '../lib/jquery-ui.min',
		"knockout": "../vendor/knockout.js/knockout.debug",
		"ko-data": "../vendor/ko-data",
		"domain": "../domain",
		"persistence": "../persistence",
		"infrastructure": "../infrastructure",
		"ko-data/repo": "../vendor/ko-data/repos/ajax"
	}
});

require(['ko-data/config', 'knockout', 'infrastructure/bindings/edit', 'bindings/date'], function (config, ko) {
	window.ko = ko;

	require(['durandal/app', 'durandal/viewLocator', 'durandal/system'], function (app, viewLocator, system) {
			system.debug(true);

			app.configurePlugins({
				router: true
			});

			app.start().then(function () {
				viewLocator.useConvention('controllers', 'views'); 
				app.setRoot('controllers/shell', 'entrance');
			});
	});
});



