#!/usr/local/bin/lycheejs-helper env:node



/*
 * BOOTSTRAP
 */

var _fs   = require('fs');
var _root = __dirname.split('/').slice(0, 3).join('/');

require(_root + '/libraries/lychee/build/node/core.js')(__dirname.split('/').slice(0, -1).join('/'));



/*
 * IMPLEMENTATION
 */

var index  = _fs.readFileSync(lychee.ROOT.project + '/build/node/main/index.js').toString('utf8');
var inject = _fs.readFileSync(lychee.ROOT.project + '/source/inject.js').toString('utf8');


var tmp = '';
var i1  = 0;
var i2  = 0;


tmp   = inject;
i1    = index.indexOf('(function(lychee, global) {');
i2    = 0;
index = '#!/usr/bin/env node\n\n' + index.substr(0, i1) + tmp + index.substr(i1);

tmp   = '_PROFILE';
i1    = index.lastIndexOf('lychee.envinit(environment,') + 28;
i2    = index.indexOf(');', i1);
index = index.substr(0, i1) + tmp + index.substr(i2);


_fs.writeFileSync(lychee.ROOT.project + '/build/node/main/index.js', index);

