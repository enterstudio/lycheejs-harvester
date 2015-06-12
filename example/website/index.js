
(function(global) {

	var image      = document.querySelector('#wrapper img');
	var wrapper    = document.querySelector('#wrapper');
	var statistics = document.querySelector('#statistics');

	if (image !== null) {

		var width  = window.innerWidth;
		var height = window.innerHeight;

		if (width > height) {
			image.setAttribute('width',  height / 1.2);
			image.setAttribute('height', height / 1.2);
		} else {
			image.setAttribute('width',  width  / 1.2);
			image.setAttribute('height', width  / 1.2);
		}

	}


	global.benchmark = function(amount) {

		amount = typeof amount === 'number' ? (amount | 0) : 1024;


		wrapper.innerHTML = '';


		var dm    = ((546 * amount) / 1000).toFixed(2);
		var start = null;


		for (var a = 0; a < amount; a++) {

			var img = new Image();

			img.width  = 16;
			img.height = 16;
			img.src    = '/unicorn.png?t=' + Date.now() + '-' + a;

			img.onload = function() {

				if (start === null) {
					start = Date.now();
				}

				var dt  = (Date.now() - start).toFixed(2);
				var avg = (dt / amount).toFixed(2);

				statistics.innerHTML = '&#xD8; ' + avg + 'ms | &#8721; ' + dt + 'ms | &#8721; ' + dm + 'kB';

			};

			wrapper.appendChild(img);

		}

	};

})(this);

