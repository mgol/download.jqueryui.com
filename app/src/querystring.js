/* eslint-env jquery, browser */
/*!
 * jQuery UI helper JavaScript file for QueryString support
 *
 * Copyright OpenJS Foundation and other contributors
 * Released under the MIT license.
 * https://jquery.org/license
 */
( function( exports, $ ) {
	"use strict";

	var QueryString = exports.QueryString = {};

	QueryString.encode = function( obj ) {

		// Replace s/+/%20 to become similar to Node's QueryString result.
		return $.param( obj ).replace( /\+/g, "%20" );
	};

	// Parse 1-depth key=val pairs string. No Arrays supported.
	QueryString.decode = function( querystring ) {
		var obj = {};

		if ( typeof querystring !== "string" || querystring.length === 0 ) {
			return obj;
		}

		$.each( querystring.replace( /\+/g, "%20" ).split( "&" ), function( i, pair ) {
			pair = pair.split( "=" );
			obj[ decodeURIComponent( pair[ 0 ] ) ] = decodeURIComponent( pair[ 1 ] );
		} );

		return obj;
	};
} )( this, jQuery );
