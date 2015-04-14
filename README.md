<p align="center">
  <a href="https://github.com/roeldev/maelstrom-js">
    <img width="200" src="https://raw.githubusercontent.com/roeldev/maelstrom-js/develop/imgs/maelstrom.svg">
  </a>
</p>

#maelstrom
[![NPM version][npm-img]][npm-url] [![Build Status][travis-img]][travis-url] [![Dependency Status][david-img]][david-url]

**A collection of gulp tasks. Work in progress.**

##Installation
```sh
npm install --save maelstrom
```
> Before installing maelstrom, make sure you have installed all the [required software, packages and gems][docs-requirements].


##How to use
After installation you can configure maelstrom by creating a `maelstrom.json` file in your project root (same folder as where your `package.json` and `gulpfile.js` files are located). See [config][docs-config] for all available options.

####Using all default plugins and tasks
If you would like maelstrom to add all of it's default tasks to gulp. you only have to have the following two lines in your `gulpfile.js`:

```js
var gulp      = require('gulp'),
    maelstrom = require('maelstrom')(gulp);
```
> Note that you should pass gulp to the maelstrom function wich is returned by `require('maelstrom')`. Without this, maelstrom will not work.

####Using a specific plugin/task
When you only want to use a certain plugin and/or task, you'll have to add a little more code. Below you'll find an example of what is possible. For a better explanation of the used maelstrom functions, check the [API][docs-api].

```js
var gulp      = require('gulp'),
    maelstrom = require('maelstrom');

// init maelstrom
maelstrom.init(gulp, false);
// add one of maelstrom's default tasks to gulp
maelstrom.task('some-default-maelstrom-task');

// or you can use a maelstrom plugin in your own task
gulp.task('my-custom-task', function()
{
    // replace 'pluginName' with the name of the plugin you'd like to use
    gulp.src( maelstrom.pluginName.src() ) // <-- use src from plugin
        .pipe( maelstrom.pluginName() ) // <-- add plugin to the stream
        .pipe( gulp.dest('path/to/dest/') );
});

// call the plugin's default watch function
gulp.task('watch', function()
{
    maelstrom.watch('some-default-maelstrom-task');
});
```
> When using `maelstrom.watch()`, don't forget to add the task with `maelstrom.task()`.

Ofcourse you can combine the above examples by requiring maelstrom so it'll add all default tasks, and still be able to use the plugins in your own custom tasks!

##More info
- [Requirements][docs-requirements]: What software, packages and gems are required?
- [Config][docs-config]: All available config options described and explained.
- [API][docs-api]: Want to know how to use the maelstrom functions?
- [Plugins][docs-plugins]: Detailed descriptions for all default maelstrom plugins.
- [Tasks][docs-tasks]: More info about maelstrom's default gulp tasks.

[npm-img]: https://badge.fury.io/js/maelstrom.svg
[npm-url]: https://www.npmjs.com/package/maelstrom
[travis-img]: https://travis-ci.org/roeldev/maelstrom.svg?branch=master
[travis-url]: https://travis-ci.org/roeldev/maelstrom
[david-img]: https://david-dm.org/roeldev/maelstrom.svg
[david-url]: https://david-dm.org/roeldev/maelstrom

[docs-requirements]: docs/requirements.md
[docs-config]: docs/config.md
[docs-api]: docs/api.md
[docs-plugins]: docs/plugins.md
[docs-tasks]: docs/tasks.md
