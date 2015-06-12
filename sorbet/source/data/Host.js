
lychee.define('sorbet.data.Host').requires([
	'sorbet.data.Filesystem'
]).includes([
	'lychee.event.Emitter'
]).exports(function(lychee, sorbet, global, attachments) {



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(identifier, root) {

		identifier = typeof identifier === 'string' ? identifier : null;
		root       = typeof root === 'string'       ? root       : ('/var/www/' + identifier);


// TODO: use relative paths and absolute paths
// TODO: if root === null, use /sorbet/public


		this.identifier = identifier;
		this.filesystem = new sorbet.data.Filesystem(root);


		lychee.event.Emitter.call(this);

	};




	Class.prototype = {

	};


	return Class;

});

