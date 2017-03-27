#!/usr/local/bin/lycheejs-helper env:node

const _fs   = require('fs');
const _ROOT = process.env.LYCHEEJS_ROOT || '/opt/lycheejs';

require(_ROOT + '/libraries/lychee/build/node/core.js')(__dirname.split('/').slice(0, -1).join('/'));



/*
 * IMPLEMENTATION
 */

let index  = _fs.readFileSync(lychee.ROOT.project + '/build/node/main/index.js').toString('utf8');
let inject = _fs.readFileSync(lychee.ROOT.project + '/source/inject.js').toString('utf8');
let tmp    = index.split('\n');
let check  = tmp.find(line => line.trim().startsWith('lychee.envinit(environment, _PROFILE);'));
if (check === undefined) {

	if (tmp[0] === '') {
		tmp[0] = '#!/usr/bin/env node\n';
	}

	let i1 = tmp.findIndex(line => line.trim().startsWith('(function(lychee, global) {'));
	if (i1 !== -1) {
		tmp.splice(i1, 0, inject);
	}

	let i2 = tmp.findIndex(line => line.trim().startsWith('lychee.envinit(environment,'));
	if (i2 !== -1) {
		tmp[i2] = tmp[i2].substr(0, tmp[i2].indexOf('lychee')) + 'lychee.envinit(environment, _PROFILE);';
	}


	_fs.writeFileSync(lychee.ROOT.project + '/build/node/main/index.js', tmp.join('\n'));

}

