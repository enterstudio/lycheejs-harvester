
lychee.define('sorbet.serve.Redirect').exports(function(lychee, sorbet, global, attachments) {

	var Module = {

		can: function(host, url) {

			var path = url === '/' ? '' : url;
			var info = host.filesystem.info(path);

			if (info !== null && info.type === 'directory') {

				var file = host.filesystem.info(path + '/index.html');
				if (file !== null && info.type === 'file') {
					return true;
				}

			}


			return false;

		},

		process: function(host, url, data, ready) {

			var path = url === '/' ? '' : url;
			var info = host.filesystem.info(path);

			if (info !== null && info.type === 'directory') {

				var file = host.filesystem.info(path + '/index.html');
				if (file !== null && file.type === 'file') {

					ready({
						status:  301,
						headers: { location: path + '/index.html' },
						payload: ''
					});

				}

			}

		}

	};


	return Module;

});

