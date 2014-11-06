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

Array of source files. These are scanned for attribute values.

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

A string value specifying the output file extension.

#### options.attributes
Type: `Array`  
Default value: `['class', 'data-attract']`

An array of attributes to search.

#### options.usePhantomJS
Type: `Boolean`  
Default value: `false`

A boolean indicating whether to use PhantomJS to render the src files. Useful for dynamically generated attributes (e.g through PHP, JavaScript, etc...). Results in a slower build as each file is loaded asynchronously.

#### options.httpBase
Type: `Mixed`  
Default value: `false`

A string value specifying the base URL to prepend to the src files. If set, `options.usePhantomJS` is automatically set to `true`. By default, src files are read directly from the file system.

#### options.urls
Type: `Array`  
Default value: `[]`

An array of URLs to load and test. URLs are always loaded via PhantomJS. Providing URLs does not automatically change the value of options.usePhantomJS. Similarly, the value of options.usePhantomJS does not affect how the URLs are loaded.

#### options.termFilter
Type: `Reg Ex`  
Default value: `/^[_a-zA-Z]+[\w\-]*$/`

Expression used to split matching attributes into terms. By default, the expression splits attributes into valid class names.

#### options.outputFunction
Type: `function(terms) { return "output string"; }`  

Function used to convert the array of terms into a string for outputting. By default, the ouput function builds a SASS map variable listing each attribute term matching the filter.

## The Problem

The task isn't limited to solving a particular problem. In fact, it's a generic approach to solving several. The task simply accesses specific attributes used throughout your site / application. It's the actions you perform based on these terms that's powerful.

As a build tool, Grunt runs early in the development lifecycle - often at a point where we don't have all the information at our disposal. Increasingly, we run our core tasks (sass compilation, JavaScript concatenation / minification) and subsequently run additional tasks to streamline the output. Grunt Attractions aims to provide extra information before these core tasks execute to improve the output. 

### Example: SASS

Let's take CSS, and SASS in particular as an example. It's not uncommon to have a library of SASS utility classes but as projects grow so does the library and streamlining the CSS output requires a careful audit of the selectors used throughout the site. Tasks, such as *uncss*, are useful tools for automating the process but wouldn't it be simpler if we knew all the classes used on a site prior to processing our SASS? With this information we can convert all our utility classes into placeholder classes and only @extend those used within the site. SASS still has access to all our utility classes but the compiled CSS only contains those that are used. We don't need to retrospectively strip back our stylesheet or wonder whether any definitions were removed that shouldn't have been.

We can take this a step further though. How many times have you defined a utility class and then needed a slight variant. For those of you adopting BEM in your stylesheets, you've probably found yourself doing the following to quickly solve the odd layout issue:

    .spaced-under {
        margin-bottom: 20px;
    }

    .spaced-under--small {
        margin-bottom: 15px;
    }

Before long, you look back and realise this has grown:

    .spaced-under--smaller {
        margin-bottom: 10px;
    }

    .spaced-under--tiny {
        margin-bottom: 5px;
    }

    .spaced-under--micro {
        margin-bottom: 2px;
    }
    
    ...

Or what about:

    .content-block {
        padding: 20px;
        background-color: white;
    }
    
    .content-block--tight {
       padding: 10px;
    }
    
    .content-block--christmas {
        background-color: red;
    }
    
    .content-block--insert-one-off-campaign-name-here {
        background-color: #0000CC;
        color: white;
    }
    
    ...
    
If we can access our classes earlier in the build phase, we can establish naming conventions for our utility classes and dynamically generate the output without even having to define the helper in the first place. Imagine dropping the class `bg--FF0000` on an element and SASS automatically generating the appropiate CSS:

    .bgc--FF0000 {
        background-color: #FFFFFF;
    }
    
or having adding `mb--20` and getting:

    .mb--20
    {
        margin-bottom: 20px;
    }

Has that one-off campaign ended now? Simply remove the campaign page's src file from the task config and all those dynamically generated utility classes just drop out of your CSS output. Magic!

I don't advocate this over proper semantic class names, but it helps for those small styling tweaks that are so often needed. Or even as a tool for quick prototype builds.

OK, let's consider another use case. You have a `.hide` class that you use from time to time but you need it for all your breakpoints too:

    .hide {
        display: none;
    }
    
    @media (max-width: 30em) {
        .hide--mob {
            display: none;
        }
    }
    
    @media (min-width: 30.06253em) and (max-width: 64em) {
        .hide--tab {
            display: none;
        }
    }
    
    ...

This quickly grows as you apply your breakpoint modifiers to more and more utility functions. More often than not, you define modifiers for all the possible breakpoints too ... just incase you need them further down the road. 

By knowing which are used ahead of your SASS task, you can define them once and, by following a common naming convention, generate all the breakpoint variants at run time - only those that are actually used too. You'll find sample code in the demo folder but, as an example, you could add the following classes to an element:

    <div class="fs--12--mob fs--14--tab fs--16--desk">...</div>

and the following styles will be generated ... without ever explicitly declaring the `fs--xxx` utility class or mixin:

    @media (max-width: 30em) {
        .fs--12--mob {
            font-size: 12px;
            font-size: 1.2rem;
        }
    }
    
    @media (min-width: 30.06253em) and (max-width: 64em) {
        .fs--14--mob {
            font-size: 14px;
            font-size: 1.4rem;
        }
    }

    @media (min-width: 64.0625em) {
        .fs--16--mob {
            font-size: 16px;
            font-size: 1.6rem;
        }
    }
    
The minimum amount of output but without the headache of maintaining that internal SASS library.

### Example: JavaScript

A JavaScript example is coming soon but, for now, let me just sell the idea. You have a folder somewhere in your project full of libraries & plug-ins. These feed into your concatenation & minification task but realistically some of these probably aren't used any more. Or maybe, you have that one-off script that adds a Google Map to your contact page but nowhere else. You want to streamline your build into one core script file containing common functions and a few smaller scripts for those single-use functions. Your worried about the maintenance side though.

By having access to your attributes in advance you can dynamically generate config files and feed those into your concat/minify task. Any files contain elements with a `.slider` class? OK, include our carousel plugin. Any data-lightbox attributes, include the plugin. Any animatable SVGs ... you get the idea.


## Demo
If you have a great use for this plugin, please send a demo and I'll gladly add it.

Currently the demo folder only contains the SASS example discussed above.

To run it:

    bundle install
    npm install
    grunt demo

The SCSS folder contains the following files:
 - `_attract.scss` - file outputted by the grunt-attractions task. It is recreated on every run.
 - `_cross-media-extends.scss` - a file that allows you to define classes once but use them across all your breakpoints (see `_settings.scss for breakpoint definitions). For more information, see the link at the top of this file.
 - `_helpers.scss` a library of utility classes (e.g. .clearfix, .hide, etc...). They are declared using the `define-extend()` mixin and wrapped in the `cross-media-extends()` mixin. This isn't inline with the typical @extend approach but is required by the aforementioned `_cross-media-extends.scss` file. The benefits are worth the awkward declarations!
 - `_helper-builder.scss` - a file that let's you dynamically generate classes as long as they follow a naming convention. The class names consist of up to 4 parts separated by `--` (BEM Modifier syntax). Part one is a property shorthand - see the `$helper-shorthands` variable defined at the top. The second is a value with an optional unit shorthand (see `$helper-units`). The third is optional and only accepts the string "imp" for setting a property to !important. The fourth is a breakpoint modifier. For example, adding the class `pt--2e--imp--desk` to an element in the src index.html file will automatically create the matching **desktop-only** style: `padding-top: 2em !important`. Similarly, `max-w--70p` would generate `max-width: 70%`.
 - `_mixins.scss` a couple of generic mixins. Just to illustrate how these can be used with dynamic helpers (e.g font-size).
 - `_settings.scss` - a map of breakpoints

This is an extreme example illustrating a number of uses. You may like the cross media extends but hate the idea of a helper builder. That's fine, the focus of this demo is to illustrate how powerful the 'action' part of the task is. Remember, the task only gives you access to attribute terms - it's up to you how you use them.


## Maintainers
- [@thisischrisj](http://twitter.com/thisischrisj)

## Release History
Date | Release | Notes
--- | --- | ---
2014-11-05 | v0.1.0 | Initial release

## Roadmap
- Improve, document & extend the demos
- Allow sitemaps as an alternative to options.urls

## License
Copyright (c) 2014 Chris Jones. Licensed under the MIT license.
