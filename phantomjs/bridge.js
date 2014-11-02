/*
 * grunt-attractions
 *
 * Copyright (c) 2014 Chris Jones, contributors
 * Licensed under the MIT license.
 */

(function () {
	'use strict';

	// Send messages to the parent PhantomJS process via alert! Good times!!
	function sendMessage() {
		var args = [].slice.call(arguments);
		alert(JSON.stringify(args));
	}

	sendMessage('attract.content', document.documentElement.outerHTML);
}());
