/*
 * grunt-attractions
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
			demo: 'demo',
		},


		// Before generating any new files, remove any previously-created files.
		clean: {
			test: [
				'<%= proj.temp %>',
				'<%= proj.test %>/result'
			]
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


		// Start a connect web server for testing
		connect: {
			server: {
			}
		},


		// Configuration to be run (and then tested).
		attract: {

			// Tests
			Files: {
				src: '<%= proj.test %>/src/*.html',
				dest: '<%= proj.test %>/result',
				options: {
					filename: '_attract_Files',
				}
			},
			Base: {
				src: '<%= proj.test %>/src/*.html',
				dest: '<%= proj.test %>/result',
				options: {
					httpBase: 'http://localhost:8000',
					filename: '_attract_Base',
					extension: 'scss'
				}
			},
			URLs: {
				dest: '<%= proj.test %>/result',
				options: {
					urls: [
						'http://www.google.com'
					],
					filename: '_attract_URLs',
					extension: 'scss'
				}
			},
			FilesAndURLs: {
				src: '<%= proj.test %>/src/*.html',
				dest: '<%= proj.test %>/result',
				options: {
					urls: [
						'http://www.google.com'
					],
					filename: '_attract_FilesAndURLs',
					extension: 'scss'
				}
			},
			BaseAndURLs: {
				src: '<%= proj.test %>/src/*.html',
				dest: '<%= proj.test %>/result',
				options: {
					urls: [
						'http://www.google.com'
					],
					httpBase: 'http://localhost:8000',
					filename: '_attract_BaseAndURLs',
					extension: 'scss'
				}
			},

			// Demos
			sass:	{
				src: '<%= proj.demo %>/sass/*.html',
				dest: '<%= proj.demo %>/sass/scss',
			}
		},

		// Compiles Sass to CSS for tests
		compass: {
			demo: {
				options: {
					sassDir: '<%= proj.demo %>/sass/scss',
					cssDir: '<%= proj.demo %>/sass/css',
					outputStyle: 'compact',
					require: ['breakpoint', 'sassy-strings']
				},
			}
		},

		// Unit tests.
		nodeunit: {
			tests: ['<%= proj.test %>/*_test.js']
		}

	});

	// Actually load this plugin's task(s).
	grunt.loadTasks('tasks');

	// Whenever the "test" task is run, first clean the dir, then run this
	// plugin's task(s), then test the result.
	grunt.registerTask('test', ['clean', 'connect', 'attract', 'nodeunit']);

	// Whenever the "test" task is run, first clean the dir, then run this
	// plugin's task(s), then test the result.
	grunt.registerTask('demo', ['clean', 'connect', 'attract', 'compass:demo']);

	// By default, lint and run all tests.
	grunt.registerTask('default', ['jshint', 'test']);

};
