"use strict";

var config = require( "./config" ),
	fs = require( "node:fs" ),
	JqueryUiFiles = require( "./jquery-ui-files.js" ),
	JqueryUiManifests = require( "./jquery-ui-manifests.js" );

/**
 * JqueryUi
 */
function JqueryUi( path, options ) {
	options = options || {};
	this.dependsOn = options.dependsOn;
	this.stable = options.stable;
	this.label = options.label;

	// 1: Always with a trailing slash
	this.path = path.replace( /\/*$/, "/" );
	this.pkg = JSON.parse( fs.readFileSync( path + "/package.json" ) );

	JqueryUiManifests.apply( this, arguments );
}

JqueryUi.all = function() {
	if ( !JqueryUi._all ) {
		JqueryUi._all = config().jqueryUi.map( function( jqueryUi ) {
			var path = __dirname + "/../jquery-ui/" + jqueryUi.ref + "/";
			if ( !fs.existsSync( path ) ) {
				throw new Error( "Missing ./" + require( "path" ).relative( __dirname, path ) + " folder. Run `grunt prepare` first, or fix your config file." );
			}
			if ( !fs.existsSync( path + "package.json" ) ) {
				throw new Error( "Invalid ./" + require( "path" ).relative( __dirname, path ) + " folder. Run `grunt prepare` first, or fix your config file." );
			}
			return new JqueryUi( path, jqueryUi );
		} );
	}
	return JqueryUi._all;
};

JqueryUi.getStable = function() {
	var match = JqueryUi.all().filter( function( jqueryUi ) {
		return jqueryUi.stable;
	} );
	if ( !match.length ) {
		throw new Error( "No stable jqueryUi has been defined. Check your config file." );
	}
	return match[ 0 ];
};

JqueryUi.find = function( version ) {
	if ( !version ) {
		throw new Error( "Invalid version argument: " + version );
	}
	var match = JqueryUi.all().filter( function( jqueryUi ) {
		return jqueryUi.pkg.version === version;
	} );
	if ( !match.length ) {
		throw new Error( "Didn't find a jqueryUi for version: " + version );
	}
	return match[ 0 ];
};

JqueryUi.prototype = {
	components: function() {
		return this.manifests;
	},

	files: function() {
		if ( !this._files ) {
			this._files = new JqueryUiFiles( this );
		}
		return this._files;
	}
};

module.exports = JqueryUi;
