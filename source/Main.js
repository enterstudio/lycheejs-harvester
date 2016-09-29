
lychee.define('app.Main').requires([
	'lychee.Input',
	'harvester.net.Admin',
	'harvester.net.Server',
	'harvester.mod.Fertilizer',
	'harvester.mod.Packager',
	'harvester.mod.Server',
//	'harvester.mod.Strainer',
	'harvester.mod.Updater'
]).includes([
	'lychee.event.Emitter'
]).exports(function(lychee, global, attachments) {

	const _harvester = lychee.import('harvester');
	const _mod       = {
		Fertilizer: lychee.import('harvester.mod.Fertilizer'),
		Packager:   lychee.import('harvester.mod.Packager'),
		Server:     lychee.import('harvester.mod.Server'),
		Strainer:   lychee.import('harvester.mod.Strainer'),
		Updater:    lychee.import('harvester.mod.Updater')
	};



	/*
	 * HELPERS
	 */

	const _LIBRARIES  = {};
	const _PROJECTS   = {};
	const _PUBLIC_IPS = (function() {

		let os = null;

		try {
			os = require('os');
		} catch(e) {
		}


		if (os !== null) {


			let candidates = [];


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



	/*
	 * FEATURE DETECTION
	 */

	(function(projects) {

		let root = lychee.ROOT.project;
		if (root !== lychee.ROOT.lychee) {
			projects[root] = new _harvester.data.Project(root);
		}

	})(_PROJECTS);



	/*
	 * IMPLEMENTATION
	 */

	let Composite = function(settings) {

		this.settings = Object.assignunlink({
			host:    null,
			port:    null,
			sandbox: false
		}, settings);

		this.defaults = Object.assignunlink({}, this.settings);


		this.admin  = null;
		this.server = null;


		this._libraries = _LIBRARIES;
		this._projects  = _PROJECTS;


		settings.host    = typeof settings.host === 'string' ? settings.host       : null;
		settings.port    = typeof settings.port === 'number' ? (settings.port | 0) : 8080;
		settings.sandbox = settings.sandbox === true;


		lychee.event.Emitter.call(this);



		/*
		 * INITIALIZATION
		 */

		this.bind('load', function() {

			this.admin  = new _harvester.net.Admin({
				host: 'localhost',
				port: 4848
			});

			this.server = new _harvester.net.Server({
				host: settings.host === 'localhost' ? null : settings.host,
				port: settings.port
			});

		}, this, true);

		this.bind('init', function() {

			this.admin.connect();
			this.server.connect();


			console.log('\n\n');
			console.log('Open your web browser and surf to one of the following hosts:');
			console.log('\n');
			this.getHosts().forEach(function(host) {
				console.log(host);
			});
			console.log('\n\n');

		}, this, true);

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		deserialize: function(blob) {

			let admin = lychee.deserialize(blob.admin);
			if (admin !== null) {
				this.admin = admin;
			}


			let server = lychee.deserialize(blob.server);
			if (server !== null) {
				this.server = server;
			}

		},

		serialize: function() {

			let data = lychee.event.Emitter.prototype.serialize.call(this);
			data['constructor'] = 'harvester.Main';


			let settings = Object.assignunlink({}, this.settings);
			let blob     = data['blob'] || {};


			if (this.admin !== null)  blob.admin  = lychee.serialize(this.admin);
			if (this.server !== null) blob.server = lychee.serialize(this.server);


			data['arguments'][0] = settings;
			data['blob']         = Object.keys(blob).length > 0 ? blob : null;


			return data;

		},



		/*
		 * MAIN API
		 */

		init: function() {

			this.trigger('load');
			this.trigger('init');

		},

		destroy: function() {

			for (let identifier in _PROJECTS) {

				let project = _PROJECTS[identifier];
				if (project.server !== null) {

					if (typeof project.server.destroy === 'function') {
						project.server.destroy();
					}

				}

			}


			if (this.admin !== null) {
				this.admin.disconnect();
				this.admin = null;
			}

			if (this.server !== null) {
				this.server.disconnect();
				this.server = null;
			}


			this.trigger('destroy');

		},



		/*
		 * CUSTOM API
		 */

		getHosts: function() {

			let hosts  = [];
			let server = this.server;

			if (server !== null) {

				let host = server.host || null;
				let port = server.port;

				if (host === null) {
					hosts.push.apply(hosts, _PUBLIC_IPS);
					hosts.push('localhost');
				} else {
					hosts.push(host);
				}


				hosts = hosts.map(function(host) {

					if (host.indexOf(':') !== -1) {
						return 'http://[' + host + ']:' + port;
					} else {
						return 'http://' + host + ':' + port;
					}

				});

			}


			return hosts;

		}

	};


	return Composite;

});

