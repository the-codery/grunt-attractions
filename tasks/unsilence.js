/*
 * grunt-unsilence
 *
 *
 * Copyright (c) 2014 Chris Jones
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

	var _ = require('lodash');

	grunt.registerMultiTask('unsilence', 'Amplifying silent placeholders', function ()
	{
		// Ensure required properties are supplied
		['src', 'dest'].forEach(function(name) {
			this.requiresConfig([this.name, this.target, name].join('.'));
		}.bind(this));


		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
			filename: 'unsilence',
			stylesheet: 'scss'
		});

		// Iterate over all specified file groups.
		this.files.forEach(function (file)
		{
			// Filter out missing files
			var classes = file.src.filter(function (filepath)
			{
				// Warn on and remove invalid source files (if nonull was set).
				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('Source file "' + filepath + '" not found.');
					return false;
				} else {
					return true;
				}
			})
			//
			.map(function (filepath)
			{
				// Read file source and innit return
				var contents = grunt.file.read(filepath);
				var thisClasses = [];

				// Find all classes
				var patt = /class="([^"]+)"/gi;
				var match = patt.exec(contents);
				while (match != null)
				{
					// If found, construct an array of classes
					thisClasses.push(match[1].split(/[\s,]+/));

					// Find the next
					match = patt.exec(contents);
				}

				return thisClasses;
			});

			// Filter unique classes and sort
			classes = (_.unique(_.flatten(classes)).sort());

			// Generate our variable
			var output = "$unsilence: (";
			_.each(classes, function(thisClass)
			{
				output += "\n\t'" + thisClass + "',";
			});
			output = output.slice(0, -1);
			output += "\n);";

			// Generate our mixin
			// output += "\n\n";
			// output += "@each $selector in $unsilence {\n";
			// output += "\t.#{$selector} { \n";
			// output += "\t\t@extend %#{$selector} !optional;\n";
			// output += "\t}\n";
			// output += "}";

			// Write the destination file.
			var dest = file.dest + "/_" + options.filename + "." + options.stylesheet;
			grunt.file.write(dest, output);

			// Print a success message.
			grunt.log.writeln('File "' + dest + '" created.');

		});
	});

};
