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
		attract: {
			options:
			{
			},
			defaults: {
				src: '<%= proj.test %>/html/*.html',
				dest: '<%= proj.test %>/scss/attract',
				options: {
				}
			},
			withBase: {
				src: '<%= proj.test %>/html/*.html',
				dest: '<%= proj.test %>/scss/attract',
				options: {
					httpBase: 'http://grunt-attractions.dev',
					filename: '_attract_WithBase',
					extension: 'scss'
				}
			},
			urls: {
				dest: '<%= proj.test %>/scss/attract',
				options: {
					urls: [
						'http://www.google.com'
					],
					filename: '_attract_Urls',
					extension: 'scss'
				}
			},
			filesAndUrls: {
				src: '<%= proj.test %>/html/*.html',
				dest: '<%= proj.test %>/scss/attract',
				options: {
					urls: [
						'http://www.google.com'
					],
					filename: '_attract_FilesAndURLs',
					extension: 'scss'
				}
			},
			baseAndUrls: {
				src: '<%= proj.test %>/html/*.html',
				dest: '<%= proj.test %>/scss/attract',
				options: {
					urls: [
						'http://www.google.com'
					],
					httpBase: 'http://grunt-attractions.dev',
					filename: '_attract_BaseAndURLs',
					extension: 'scss'
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
	grunt.registerTask('test', ['clean', 'attract', 'compass', 'nodeunit']);

	// By default, lint and run all tests.
	grunt.registerTask('default', ['jshint', 'test']);

};
