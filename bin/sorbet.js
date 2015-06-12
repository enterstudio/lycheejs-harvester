#!/usr/bin/env iojs


var root = require('path').resolve(__dirname, '../');
var fs   = require('fs');
var path = require('path');


if (fs.existsSync(root + '/lychee/build/iojs/core.js') === false) {
	require(root + '/lychee/configure.js');
}


var lychee = require(root + '/lychee/build/iojs/core.js')(root);



/*
 * USAGE
 */

var _print_help = function() {

	console.log('                                                      ');
	console.info('lycheeJS ' + lychee.VERSION + ' Sorbet');
	console.log('                                                      ');
	console.log('Usage: sorbet [Command] [Profile]                     ');
	console.log('                                                      ');
	console.log('                                                      ');
	console.log('Commands:                                             ');
	console.log('                                                      ');
	console.log('    start               Starts a Sorbet Instance.     ');
	console.log('    stop                Stops a Sorbet Instance.      ');
	console.log('    restart             Restarts the Sorbet Instance. ');
	console.log('    status              Status of Sorbet Instance.    ');
	console.log('                                                      ');
	console.log('Examples:                                             ');
	console.log('                                                      ');
	console.log('    sorbet start /path/to/sorbet.profile              ');
	console.log('    sorbet status                                     ');
	console.log('    sorbet stop                                       ');
	console.log('    sorbet start /path/to/sorbet.profile              ');
	console.log('                                                      ');

};



var _DEFAULT_PROFILE = {
	port:  8080,
	hosts: { localhost: null }
};

var _settings = (function() {

	var settings = {
		command: null,
		profile: null
	};


	var args = [ process.argv[2] || '', process.argv[3] || '' ];
	if (args[0].match(/start|stop/)) {

		settings.command = args[0];
		settings.profile = args[1] || null;

	}



	if (settings.profile !== null) {

		var tmp = settings.profile.split('/');
		if (tmp[0] === '.') {
			tmp[0] = root;
		}


		var file = tmp.pop();
		var dir  = tmp.join('/');


		try {

			if (fs.existsSync(dir + '/' + file)) {
				settings.profile = JSON.parse(fs.readFileSync(dir + '/' + file, 'utf8'));
			} else {
				settings.profile = _DEFAULT_PROFILE;
			}

		} catch(e) {
			settings.profile = _DEFAULT_PROFILE;
		}


		if (settings.profile instanceof Object) {

			if (settings.profile.hosts instanceof Object) {

				for (var id in settings.profile.hosts) {

					var path = settings.profile.hosts[id];
					if (path.substr(0, 2) === './') {
						settings.profile.hosts[id] = dir + '/' + path.substr(2);
					}

				}

			}

		}

	} else {

		settings.profile = _DEFAULT_PROFILE;

	}


	return settings;

})();



(function(command, profile) {

	/*
	 * HELPERS
	 */

	var _clear_pid = function() {

		try {

			fs.unlinkSync(root + '/sorbet/.pid');
			return true;

		} catch(e) {

			return false;

		}

	};

	var _read_pid = function() {

		var pid = null;

		try {

			pid = fs.readFileSync(root + '/sorbet/.pid', 'utf8');

			if (!isNaN(parseInt(pid, 10))) {
				pid = parseInt(pid, 10);
			}

		} catch(e) {
			pid = null;
		}

		return pid;

	};

	var _write_pid = function() {

		try {

			fs.writeFileSync(root + '/sorbet/.pid', process.pid);
			return true;

		} catch(e) {

			return false;

		}

	};



	if (command === 'start') {

		if (profile === null) {

			console.error('Invalid Profile');
			process.exit(1);

			return false;

		} else {

			console.info('Starting Instance (' + process.pid + ') ... ');

			lychee.setEnvironment(new lychee.Environment({
				id:      'sorbet',
				debug:   false,
				sandbox: false,
				build:   'sorbet.Main',
				timeout: 10000, // 10 seconds bootup time, because we also ship lycheeOS
				packages: [
					new lychee.Package('lychee', '/lychee/lychee.pkg'),
					new lychee.Package('sorbet', '/sorbet/lychee.pkg')
				],
				tags:     {
					platform: [ 'iojs' ]
				}
			}));


			lychee.init(function(sandbox) {

				if (sandbox !== null) {

					var lychee = sandbox.lychee;
					var sorbet = sandbox.sorbet;


					// Show more debug messages
					lychee.debug = true;


					// This allows using #MAIN in JSON files
					sandbox.MAIN = new sorbet.Main(profile);
					sandbox.MAIN.init();
					sandbox.MAIN.bind('destroy', function() {
						process.exit(0);
					});
					_write_pid();


					process.on('SIGHUP',  function() { sandbox.MAIN.destroy(); _clear_pid(); this.exit(1); });
					process.on('SIGINT',  function() { sandbox.MAIN.destroy(); _clear_pid(); this.exit(1); });
					process.on('SIGQUIT', function() { sandbox.MAIN.destroy(); _clear_pid(); this.exit(1); });
					process.on('SIGABRT', function() { sandbox.MAIN.destroy(); _clear_pid(); this.exit(1); });
					process.on('SIGTERM', function() { sandbox.MAIN.destroy(); _clear_pid(); this.exit(1); });
					process.on('error',   function() { sandbox.MAIN.destroy(); _clear_pid(); this.exit(1); });
					process.on('exit',    function() {});

				} else {

					_clear_pid();
					process.exit(1);

				}

			});

		}

	} else if (command === 'stop') {

		var pid = _read_pid();
		if (pid !== null) {

			console.info('Stopping Instance (' + pid + ') ... ');

			var killed = false;

			try {

				process.kill(pid, 'SIGTERM');
				killed = true;

			} catch(err) {

				if (err.code === 'ESRCH') {
					killed = true;
				} else {
					console.error('Invalid process rights (try with sudo?)');
				}

			}

			if (killed === true) {
				_clear_pid();
			}

			process.exit(0);

		} else {

			process.exit(1);

		}

	} else {

		_print_help();

		process.exit(0);

	}

})(_settings.command, _settings.profile);

