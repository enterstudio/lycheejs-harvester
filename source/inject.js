
var _BOOTUP  = true;
var _PROFILE = {
	"host": "localhost",
	"port": 8080
};

var _print_help = function() {

	console.log('                                                               ');
	console.info('lychee.js ' + lychee.VERSION + ' Harvester');
	console.log('                                                               ');
	console.log('Usage: lycheejs-harvester [Flags]                              ');
	console.log('                                                               ');
	console.log('                                                               ');
	console.log('Available Flags:                                               ');
	console.log('                                                               ');
	console.log('   --host           Bind server to specific host               ');
	console.log('   --port           Bind server to specific port               ');
	console.log('   --debug          Debug Mode with verbose debug messages     ');
	console.log('   --sandbox        Sandbox Mode without software bots         ');
	console.log('                                                               ');
	console.log('                                                               ');
	console.log('Examples:                                                      ');
	console.log('                                                               ');
	console.log('    cd /path/to/project;                                       ');
	console.log('                                                               ');
	console.log('    lycheejs-harvester --host=artificial.engineering --port=80;');
	console.log('    lycheejs-harvester --debug --sandbox;                      ');
	console.log('                                                               ');

};


(function(lychee, global) {

	var root = process.cwd();
	if (root.substr(0, lychee.ROOT.lychee.length) === lychee.ROOT.lychee) {
		root = root.substr(lychee.ROOT.lychee.length);
	}

	if (root !== __dirname) {
		lychee.ROOT.project = root;
	}


	var flags = [].slice.call(process.argv, 2);
	if (flags.length > 0) {

		flags.forEach(function(flag) {

			if (flag.substr(0, 2) === '--') {

				var key = flag.substr(2).split('=')[0] || '';
				var val = flag.substr(2).split('=')[1] || '';
				var boo = val === 'true';
				var num = parseInt(val, 10);

				if (val.charAt(0) === '"' && val.charAt(val.length - 1) === '"') {
					val = val.substr(1, val.length - 2);
				} else if (val.charAt(0) === '\'' && val.charAt(val.length - 1) === '\'') {
					val = val.substr(1, val.length - 2);
				}


				switch (key) {

					case 'help':
						_BOOTUP = false;
						break;

					case 'host':
						_PROFILE['host'] = val;
						break;

					case 'port':
						if (isNaN(num) === false) {
							_PROFILE['port'] = num;
						}
						break;

					case 'sandbox':
						_PROFILE['sandbox'] = boo;
						break;

					case 'debug':
						_PROFILE['debug'] = boo;
						break;

					default:
						break;

				}

			} else if (flag === '-h') {
				_BOOTUP = false;
			}

		});

	}

})(lychee, typeof global !== 'undefined' ? global : this);

if (_BOOTUP === false) {
	_print_help();
	process.exit(1);
	return;
}

