# grunt-attractions

> Attribute based actions

## Getting Started
This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-attractions --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-attractions');
```

## The "attract" task

### Overview
In your project's Gruntfile, add a section named `attract` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  attract: {
    src: ['index.html', 'view/*.html'],
    dest: 'scss/utilities',
    options: {
      // Task-specific options go here.
    }
  },
})
```

### Options

#### src
Type: `String|Array`

This defines which files will be read to search for attribute values.

#### dest
Type: `String`

Output file path.

#### options.filename
Type: `String`
Default value: `'attract'`

A string value specifying the output filename.

#### options.extension
Type: `String`
Default value: `'scss'`

A string value specifying the output filename.

## The Problem

The task isn't limited to solving a particular problem. In fact, it's a generic approach to solving several. Let's take CSS, and SASS in particular as an example:



The task gives access to your app's attribute values at build time. The task itself is very simple. It's how you act on your attributes that's powerful.

## Maintainers
- [@thisischrisj](http://twitter.com/thisischrisj)

## Release History
Date | Release | Notes
--- | --- | ---
2014-10-12 | v0.1.0 | Initial release

## Roadmap
- Incorporate PhantomJS for URL-based src files. Useful for dynamically created attribute values (JavaScript, PHP...)

## License
Copyright (c) 2014 Chris Jones. Licensed under the MIT license.
