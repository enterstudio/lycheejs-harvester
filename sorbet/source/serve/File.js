
lychee.define('sorbet.serve.File').requires([
	'sorbet.data.Filesystem'
]).exports(function(lychee, sorbet, global, attachments) {

	/*
	 * HELPERS
	 */

	var _public_filesystem = new sorbet.data.Filesystem('./sorbet/public');


	var _get_response = function(info, mime) {

		var response = {
			status:  200,
			headers: {
				'e-tag':           '"' + info.length + '-' + Date.parse(info.time) + '"',
				'last-modified':   new Date(info.time).toUTCString(),
				'content-control': 'no-transform',
				'content-type':    mime.type,
				'expires':         new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toUTCString(),
				'vary':            'Accept-Encoding'
			},
			payload: null
		};


		if (mime.type.substr(0, 4) === 'text') {
			response.headers['content-type'] = mime.type + '; charset=utf-8';
		}


		return response;

	};

	var _serve_public = function(url, mime, ready) {

		var public_info = _public_filesystem.info(url);
		if (public_info !== null && public_info.type === 'file') {

			_public_filesystem.read(url, function(buffer) {

				var response;

				if (buffer !== null) {

					response = _get_response(public_info, mime);
					response.payload = buffer;
					ready(response);

				} else {
					ready(null, mime.type);
				}

			}, this);

		} else {

			ready(null, mime.type);

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var _MIME = {

		'default': { binary: true, type: 'application/octet-stream'       },

		'css':     { binary: false, type: 'text/css'                      },
		'env':     { binary: false, type: 'application/json'              },
		'eot':     { binary: false, type: 'application/vnd.ms-fontobject' },
		'gz':      { binary: true,  type: 'application/x-gzip'            },
		'fnt':     { binary: false, type: 'application/json'              },
		'html':    { binary: false, type: 'text/html'                     },
		'ico':     { binary: true,  type: 'image/x-icon'                  },
		'jpg':     { binary: true,  type: 'image/jpeg'                    },
		'js':      { binary: false, type: 'application/javascript'        },
		'json':    { binary: false, type: 'application/json'              },
		'md':      { binary: false, type: 'text/x-markdown'               },
		'mf':      { binary: false, type: 'text/cache-manifest'           },
		'mp3':     { binary: true,  type: 'audio/mp3'                     },
		'ogg':     { binary: true,  type: 'application/ogg'               },
		'pkg':     { binary: false, type: 'application/json'              },
		'store':   { binary: false, type: 'application/json'              },
		'tar':     { binary: true,  type: 'application/x-tar'             },
		'ttf':     { binary: false, type: 'application/x-font-truetype'   },
		'txt':     { binary: false, type: 'text/plain'                    },
		'png':     { binary: true,  type: 'image/png'                     },
		'svg':     { binary: true,  type: 'image/svg+xml'                 },
		'woff':    { binary: false, type: 'application/font-woff'         },
		'xml':     { binary: false, type: 'text/xml'                      },
		'zip':     { binary: true,  type: 'application/zip'               }

	};


	var Module = {

		can: function(host, url) {

			var path = url;
			var info = host.filesystem.info(path);

			if (info !== null && info.type === 'file') {
				return true;
			}


			var public_info = _public_filesystem.info(url);
			if (public_info !== null && public_info.type === 'file') {
				return true;
			}


			return false;

		},

		process: function(host, url, data, ready) {

			var mime = _MIME[url.split('.').pop()] || _MIME['default'];


			var path = url;
			var info = host.filesystem.info(path);

			if (info !== null && info.type === 'file') {

				var timestamp = data.headers['if-modified-since'] || null;
				if (timestamp !== null) {

					var diff = new Date(info.time) > new Date(timestamp);
					if (diff === false) {

						ready({
							status: 304,
							headers: {
								'last-modified': new Date(info.time).toUTCString()
							},
							payload: ''
						});

						return;

					}

				}


				host.filesystem.read(path, function(buffer) {

					var response;

					if (buffer !== null) {

						response = _get_response(info, mime);
						response.payload = buffer;
						ready(response);

					} else {
						ready(null, mime.type);
					}

				}, this);

			} else {

				_serve_public(url, mime, ready);

			}

		}

	};


	return Module;

});

