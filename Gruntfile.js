/*
 * grunt-unsilence
 *
 *
 * Copyright (c) 2014 Chris Jones
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
	// load all npm grunt tasks
	require('load-grunt-tasks')(grunt);

	// Project configuration.
	grunt.initConfig({

		// Project settings
		proj: {
			temp: '.tmp',
			test: 'test',
		},


		jshint: {
			all: [
				'Gruntfile.js',
				'tasks/*.js',
				'<%= nodeunit.tests %>'
			],
			options: {
				jshintrc: '.jshintrc',
				reporter: require('jshint-stylish')
			}
		},

		// Before generating any new files, remove any previously-created files.
		clean: {
			tests: ['<%= proj.temp %>', '<%= compass.options.cssDir %>']
		},

		// Configuration to be run (and then tested).
		unsilence: {
			default_options: {
				src: '<%= proj.test %>/html/*.html',
				dest: '<%= proj.test %>/scss/test',
				options: {
				}
			},
			custom_options: {
				src: '<%= proj.test %>/html/*.html',
				dest: '<%= proj.test %>/scss/test',
				options: {
					filename: 'custom_unsilence',
					stylesheet: 'scss'
				}
			}
		},

		// Compiles Sass to CSS for tests
		compass: {
			options: {
				sassDir: '<%= proj.test %>/scss',
				cssDir: '<%= proj.test %>/css',
				outputStyle: 'compact',
				require: ['breakpoint', 'sassy-strings']
			},
			test: {}
		},

		// Unit tests.
		nodeunit: {
			tests: ['test/*_test.js']
		}

	});

	// Actually load this plugin's task(s).
	grunt.loadTasks('tasks');

	// Whenever the "test" task is run, first clean the dir, then run this
	// plugin's task(s), then test the result.
	grunt.registerTask('test', ['clean', 'unsilence', 'compass', 'nodeunit']);

	// By default, lint and run all tests.
	grunt.registerTask('default', ['jshint', 'test']);

};
