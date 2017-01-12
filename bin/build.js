#!/usr/local/bin/lycheejs-helper env:node



/*
 * BOOTSTRAP
 */

const _fs   = require('fs');
const _ROOT = '/opt/lycheejs';

require(_ROOT + '/libraries/lychee/build/node/core.js')(__dirname.split('/').slice(0, -1).join('/'));



/*
 * IMPLEMENTATION
 */

let index  = _fs.readFileSync(lychee.ROOT.project + '/build/node/main/index.js').toString('utf8');
let inject = _fs.readFileSync(lychee.ROOT.project + '/source/inject.js').toString('utf8');


let tmp = '';
let i1  = 0;
let i2  = 0;


tmp   = inject;
i1    = index.indexOf('(function(lychee, global) {');
i2    = 0;
index = '#!/usr/bin/env node\n\n' + index.substr(0, i1) + tmp + index.substr(i1);

tmp   = '_PROFILE';
i1    = index.lastIndexOf('lychee.envinit(environment,') + 28;
i2    = index.indexOf(');', i1);
index = index.substr(0, i1) + tmp + index.substr(i2);


_fs.writeFileSync(lychee.ROOT.project + '/build/node/main/index.js', index);

