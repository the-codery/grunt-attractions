/*
 * grunt-attractions
 *
 *
 * Copyright (c) 2014 Chris Jones
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt)
{
	// External lib.
	var phantomjs = require('grunt-lib-phantomjs').init(grunt);
	var _ = require('lodash');


	// Nodejs libs.
	var path = require('path');
	var url = require('url');

	// Get an asset file, local to the root of the project.
	var asset = path.join.bind(null, __dirname, '..');

	// Task Handlers
	var urls,
			files,
			pages,
			contentComplete;


	// Content received event.
	phantomjs.on('attract.content', function(content)
	{
		pages.push(content);
		grunt.event.emit('attract.phantomComplete');
	});

	// Built-in error handlers.
	phantomjs.on('fail.load', function(url) {
		phantomjs.halt();
		grunt.warn('PhantomJS unable to load URL.');
	});

	phantomjs.on('fail.timeout', function() {
		phantomjs.halt();
		grunt.warn('PhantomJS timed out.');
	});


	// Task listeners
	grunt.event.on('attract.phantomComplete', function()
	{
		contentComplete++;
		phantomjs.halt();
	});



	grunt.registerMultiTask('attract', 'Act on your attributes', function ()
	{
		pages = [];
		contentComplete = 0;

		// Ensure required properties are supplied
		['dest'].forEach(function(name) {
			this.requiresConfig([this.name, this.target, name].join('.'));
		}.bind(this));


		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options(
		{
			// Output file (default: sass file)
			filename: '_attract',
			extension: 'scss',
			// Attributes to examine (default: 'class', 'data-attract')
			attributes: [
				'class',
				'data-attract'
			],
			// Use PhantomJS. True if httpBase is set (default: false)
			usePhantomJS: false,
			// HTTP base (default: none)
			httpBase: false,
			// Manual URLs to process (default: empty set)
			urls: [],
			// How attributes should be filtered (default: valid class names)
			termFilter: /^[_a-zA-Z]+[\w\-]*$/,
			// How to output the terms (default: scss list variable)
			outputFunction: function(terms)
			{
				var output = "$attract: (";
				_.each(terms, function(thisTerm)
				{
					output += "\n\t'" + thisTerm + "',";
				});
				output = output.replace(/,*$/, ""); // Trim trailing comma
				output += "\n);";
				return output;
			}
		});

		// Validate options
		options.usePhantomJS = options.httpBase !== false || options.usePhantomJS;


		// This task is async.
		var done = this.async();

		// If URLs are explicitly referenced, use them still
		urls = options.urls;
		files = [];


		// Iterate over all specified file groups.
		this.files.forEach(function (file)
		{
			// If local files src's were supplied
			if(file.src)
			{
				// Filter out missing files ...
				file.src.filter(function (filepath)
				{
					// Warn on and remove invalid source files (if nonull was set).
					if (!grunt.file.exists(filepath)) {
						grunt.log.warn('Source file "' + filepath + '" not found.');
						return false;
					} else {
						return true;
					}
				})
				// ... and loop through the rest generating URLs
				.map(function (filepath)
				{
					if(options.usePhantomJS)
					{
						urls.push((options.httpBase ? options.httpBase + '/' : '') + filepath);
					} else
					{
						files.push(filepath);
					}
				});
			}


			// Process each file in-order.
			_.each(files, function(file)
			{
				grunt.verbose.writeln("Reading " + file);

				// Store file content
				pages.push(grunt.file.read(file));
			});


			// Process each url in-order.
			grunt.util.async.forEachSeries(urls, function(url, next)
			{
				grunt.verbose.writeln("Loading " + url);

				// Launch PhantomJS.
				phantomjs.spawn(url, {
					// Additional PhantomJS options.
					options: {
						inject: asset('phantomjs/bridge.js')
					},
					// Do stuff when done.
					done: function(err) {
						if (err) { done(); } else { next(); }
					},
				});
			},
			// All tests have been run.
			function()
			{
				// Collect terms
				var terms = _.map(pages, function(contents)
				{
					var thisTerms = [];

					// Find all attribute words
					var attrMatch = options.attributes.join("|");
					var attrPattern = new RegExp('(' + attrMatch + ')=("|\')([^"\']+)', 'gi');
					var match = attrPattern.exec(contents);
					while (match != null)
					{
						// If found, construct an array of attributes
						thisTerms.push(match[3].split(/[\s,]+/));

						// Find the next
						match = attrPattern.exec(contents);
					}

					return thisTerms;
				});


				// Filter unique, valid terms and sort
				terms = (_.filter(_.unique(_.flatten(terms)), function(thisTerm)
				{
					return options.termFilter.test(thisTerm);
				}).sort());

				// Generate our output
				var output = options.outputFunction(terms);

				// Write the destination file.
				var dest = file.dest + "/" + options.filename + "." + options.extension;
				grunt.file.write(dest, output);

				// Print a success message.
				grunt.log.ok('File "' + dest + '" created.');


				// All done!
				done();
			});

		});

	});

};
