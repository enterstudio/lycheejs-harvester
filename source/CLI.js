#!/usr/local/bin/lycheejs-helper env:node



/*
 * BOOTSTRAP
 */

var root   = process.cwd();
var fs     = require('fs');
var lychee = null;

try {

	lychee = require('./core.js')(root);

} catch(e) {

} finally {

	if (lychee === null) {
		lychee = require('/opt/lycheejs/libraries/lychee/build/node/core.js')(process.cwd());
	}

}



/*
 * USAGE
 */

var _print_help = function() {

	console.log('                                                ');
	console.info('lychee.js ' + lychee.VERSION + ' Harvester');
	console.log('                                                ');
	console.log('Usage: lycheejs-harvester [Action] [Profile]    ');
	console.log('                                                ');
	console.log('                                                ');
	console.log('Action:                                         ');
	console.log('                                                ');
	console.log('   start, stop                                  ');
	console.log('                                                ');
	console.log('Profile:                                        ');
	console.log('                                                ');
	console.log('    /path/to/profile.json                       ');
	console.log('                                                ');
	console.log('Examples:                                       ');
	console.log('                                                ');
	console.log('    lycheejs-harvester start ./development.json;');
	console.log('    lycheejs-harvester stop;                    ');
	console.log('                                                ');

};



var _settings = (function() {

	var settings = {
		action:  null,
		debug:   false,
		profile: null,
		sandbox: false
	};


	var raw_arg0 = process.argv[2] || '';
	var raw_arg1 = process.argv[3] || '';
	var raw_arg2 = process.argv[4] || '';
	var raw_arg3 = process.argv[5] || '';
	var raw_flag = raw_arg2 + ' ' + raw_arg3;


	if (raw_arg0 === 'start') {

		settings.action = 'start';


		try {

			var stat1 = fs.lstatSync(raw_arg1);
			if (stat1.isFile()) {

				var json = null;
				try {
					json = JSON.parse(fs.readFileSync(raw_arg1, 'utf8'));
				} catch(e) {
				}

				if (json !== null) {
					settings.profile = json;
					settings.debug   = json.debug   === true;
					settings.sandbox = json.sandbox === true;
				}

			}

		} catch(e) {
		}


	} else if (raw_arg0 === 'stop') {

		settings.action = 'stop';

	}


	if (/--debug/g.test(raw_flag) === true) {
		settings.debug = true;
	}

	if (/--sandbox/g.test(raw_flag) === true) {
		settings.sandbox = true;
	}


	return settings;

})();



var _clear_pid = function() {

	try {

		fs.unlinkSync(root + '/lycheejs-harvester.pid');
		return true;

	} catch(e) {

		return false;

	}

};

var _read_pid = function() {

	var pid = null;

	try {

		pid = fs.readFileSync(root + '/lycheejs-harvester.pid', 'utf8');

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

		fs.writeFileSync(root + '/lycheejs-harvester.pid', process.pid);
		return true;

	} catch(e) {

		return false;

	}

};



/*
 * INITIALIZATION
 */

(function(settings) {

	/*
	 * IMPLEMENTATION
	 */

	var action      = settings.action;
	var has_action  = settings.action !== null;
	var has_profile = settings.profile !== null;


	if (action === 'start' && has_profile) {

		_write_pid();

		lychee.pkginit('node/main', {
			debug:   settings.debug   === true,
			sandbox: settings.sandbox === true
		}, settings.profile);

	} else if (action === 'stop') {

		var pid = _read_pid();
		if (pid !== null) {

			console.info('SHUTDOWN (' + pid + ')');

			var killed = false;

			try {

				process.kill(pid, 'SIGTERM');
				killed = true;

			} catch(err) {

				if (err.code === 'ESRCH') {
					killed = true;
				}

			}

			if (killed === true) {

				_clear_pid();

			} else {

				console.info('RIGHTS FAILURE (OR PROCESS ' + pid + ' ALEADY DEAD?)');

			}


			process.exit(0);

		} else {

			console.info('PROCESS ALREADY DEAD!');

			process.exit(1);

		}

	} else {

		console.error('PARAMETERS FAILURE');

		_print_help();

		process.exit(1);

	}

})(_settings);

