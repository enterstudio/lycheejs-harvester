
lychee.define('sorbet.Main').requires([
	'sorbet.data.Host',
	'sorbet.net.Server',
	'sorbet.serve.File',
	'sorbet.serve.Redirect'
]).includes([
	'lychee.event.Emitter'
]).exports(function(lychee, sorbet, global, attachments) {

	/*
	 * HELPERS
	 */

	var _PUBLIC_IPS = (function() {

		var os = null;

		try {
			os = require('os');
		} catch(e) {
		}


		if (os !== null) {


			var candidates = [];


			Object.values(os.networkInterfaces()).forEach(function(iface) {

				iface.forEach(function(alias) {

					if (alias.internal === false) {

						if (alias.family === 'IPv6' && alias.scopeid === 0) {
							candidates.push(alias.address);
						} else if (alias.family === 'IPv4') {
							candidates.push(alias.address);
						}

					}

				});

			});


			return candidates.unique();

		}


		return [];

	})();

	var _process_server = function(data, ready) {

		var identifier = (data.headers.host || '');
		if (identifier.match(/\[.*\]+/g)) {
			identifier = identifier.match(/([0-9a-f\:]+)/g)[0];
		} else if (identifier.indexOf(':')) {
			identifier = identifier.split(':')[0];
		}


		var host = this.hosts[identifier] || null;
		var url  = data.headers.url || null;

		if (host !== null && url !== null) {

			var parameters = {};

			var tmp = data.headers.url.split('?')[1] || '';
			if (tmp.length > 0) {

				url = data.headers.url.split('?')[0];
				tmp.split('&').forEach(function(value) {

					var key = value.split('=')[0];
					var val = value.split('=')[1];


					if (!isNaN(parseInt(val, 10))) {
						parameters[key] = parseInt(val, 10);
					} else if (val === 'true') {
						parameters[key] = true;
					} else if (val === 'false') {
						parameters[key] = false;
					} else if (val === 'null') {
						parameters[key] = null;
					} else {
						parameters[key] = val;
					}

				});

			}


			if (Object.keys(parameters).length > 0) {
				data.headers.parameters = parameters;
			}


			if (sorbet.serve.File.can(host, url) === true) {

				sorbet.serve.File.process(host, url, data, ready);
				return true;

			} else if (sorbet.serve.Redirect.can(host, url) === true) {

				sorbet.serve.Redirect.process(host, url, data, ready);
				return true;

			}

		}


		ready(null);

		return false;

	};



	/*
	 * FEATURE DETECTION
	 */

	var _defaults = {

		port:   null,
		hosts:  null,

		server: {
			host: null,
			port: 8080
		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(settings) {

		this.settings = lychee.extendunlink({}, _defaults, settings);
		this.defaults = lychee.extendunlink({}, this.settings);

		this.hosts     = {};
		this.modules   = {};
		this.server    = null;


		if (settings.hosts instanceof Object) {

			for (var id in settings.hosts) {
				this.setHost(id, settings.hosts[id]);
			}


			if (settings.hosts['localhost'] === null) {

				_PUBLIC_IPS.forEach(function(ip) {
					this.setHost(ip, null);
				}.bind(this));

			}

		}


		if (typeof settings.port === 'number') {
			this.settings.server.port = (settings.port | 0);
		}


		lychee.event.Emitter.call(this);


		/*
		 * INITIALIZATION
		 */

		this.bind('load', function() {

		}, this, true);

		this.bind('init', function() {

			var settings = this.settings.server || null;
			if (settings !== null) {

				this.server = new sorbet.net.Server(settings);
				this.server.bind('serve', function(data, ready) {
					_process_server.call(this, data, ready);
				}, this);


				var connections = 0;

				this.server.bind('connect', function(remote) {

					connections++;

				});

				this.server.bind('disconnect', function(remote) {

					connections--;

					if (typeof global.gc !== 'undefined') {

						if (connections === 0) {
							gc();
						}

					}

				});


				this.server.connect();


				var port  = this.server.port;
				var hosts = Object.keys(this.hosts).map(function(host) {

					if (host.indexOf(':') !== -1) {
						return 'http://[' + host + ']:' + port;
					} else {
						return 'http://' + host + ':' + port;
					}

				});

				console.log('\n\n');
				console.log('Open your web browser and surf to one of the following hosts:');
				console.log('\n');
				hosts.forEach(function(host) {
					console.log(host);
				});
				console.log('\n\n');

			}

		}, this, true);

	};


	Class.VERSION = 'lycheeJS ' + lychee.VERSION + ' Sorbet (running on NodeJS ' + process.version + ')';


	Class.prototype = {

		/*
		 * MAIN API
		 */

		init: function() {

			this.trigger('load', []);
			this.trigger('init', []);

		},

		destroy: function() {

			if (this.server !== null) {
				this.server.disconnect();
				this.server = null;
			}


			this.trigger('destroy', []);

		},



		/*
		 * CUSTOM API
		 */

		setHost: function(identifier, root) {

			identifier = typeof identifier === 'string' ? identifier : null;
			root       = typeof root === 'string'       ? root       : null;


			if (identifier !== null) {

				this.hosts[identifier] = new sorbet.data.Host(identifier, root);

				return true;

			}


			return false;

		}

	};


	return Class;

});

