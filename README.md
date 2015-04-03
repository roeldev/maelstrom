<p align="center">
  <a href="https://github.com/roeldev/maelstrom-js">
    <img width="200" src="https://raw.githubusercontent.com/roeldev/maelstrom-js/develop/imgs/maelstrom.svg">
  </a>
</p>

#maelstrom
**A collection of Gulp tasks. Work in progress.**

##Installation
```
npm install --save maelstrom
```
> Before installing maelstrom, make sure you have installed both gulp and browser-sync with the `-g` or `--global` flag: `npm install -g gulp browser-sync`.

##How to use
After installation you can configure maelstrom by creating a `maelstrom.json` file in your project root (same folder as where your `package.json` and `gulpfile.js` files are located).

####Using all default plugins and tasks
If you would like maelstrom to add all of it's default tasks to gulp. you only have to have the following two lines in your `gulpfile.js`:

```js
var gulp      = require('gulp'),
    maelstrom = require('maelstrom')(gulp);
```
> Note that gulp is directly passed to the maelstrom function wich is returned by `require('maelstrom')`. Without this, maelstrom will not work.

####Using a specific plugin/task
When you only want to use a certain plugin and/or task, you'll have to add a little more code. First require both the gulp and maelstrom packages. Then pass gulp to maelstrom's initializer: `maelstrom.init(gulp)`.
You are now ready to use all of the default maelstrom plugins with `maelstrom.pluginName()` (replace _pluginName_ with the name of the plugin you'd like to use), add tasks with `maelstrom.task()` and/or watch tasks with `maelstrom.watch()`.

```js
var gulp      = require('gulp'),
    maelstrom = require('maelstrom');

// init maelstrom
maelstrom.init(gulp);
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
> Note that gulp is passed to `maelstrom.init()` unlike the first example. By initializing maelstrom this way, all default tasks will not be added to gulp.

> When using `maelstrom.watch()`, don't forget to add the task with `maelstrom.task()`.

Ofcourse you can combine the above examples by requiring maelstrom so it'll add all default tasks, and still be able to use the plugins in your own custom tasks!

##Config

##API
```
maelstrom()
```
Initializing maelstrom by calling this function passes all arguments to the `maelstrom.init()` function, and adds all default tasks to gulp.

```
maelstrom.init(gulp[, customConfig])
```
Maelstrom initializer wich allows you to use the default plugins inside your own gulp tasks.

> `gulp`

    > Type: `object`

A reference to the required gulp module.

> `customConfig`

    > Type: `object`

An optional custom config object. This will overrule both the default maelstrom config and the options loaded from `maelstrom.json`.

```
maelstrom.task(taskName[, options...])
```
This function adds a default maelstrom task to `gulp.task()`. The result from the `gulp.task()` function is returned. If for some reason `gulp.task()` is not called, the default value of `false` is returned.

> `taskName`

    > Type: `string`

Name of the maelstrom task to add to gulp.

> `options`

    > Type: `mixed`

All other arguments are passed along to the task function. Check the documentation for the task you would like to use to see wich extra options are available.


```
maelstrom.watch(taskName[, extraFiles][, extraTasks])
```
This function adds a file watcher with `gulp.watch()` for the given task. The files to watch are taken from the plugin wich defined the task. The default result from the `gulp.watch()` function is returned. If for some reason `gulp.watch` is not called, the default value of `false` is returned.

> `taskName`

    > Type: `string`

Name of the maelstrom task to watch.

> `extraFiles`

    > Type: `array` or `string`

Optional extra files to pass to `gulp.watch()`.

> `extraTasks`

    > Type: `array` or `string`

Optional extra tasks to pass to `gulp.watch()`.

```
maelstrom.extend(name, plugin)
```
Extend maelstrom by adding your own functions, objects or arrays. To load a plugin from a file pass the filename as a string. The results from the file (`module.exports`) will be added as the plugin.

> `name`

    > Type: `string`

The name to call the plugin: `maelstrom._name_`.

> `plugin`

    > Type: `function` or `object` or `string`

A plugin to add to maelstrom.

##Available plugins

##Available tasks
####Sass
```
gulp sass
```
> `--dev`

    > Type: `boolean`
    > Default: `0`
    > Values: `0` or `1`

This flag indicates if the compiled CSS file should not be minified. The default value is `1`, an optional value of `0` can be used, wich disables minifying the output file.

> `--prod`

    > Type: `boolean`
    > Default: `0`
    > Values: `0` or `1`

####Images
```
gulp images
```
> `--optimize`

    > Type: `boolean`
    > Default: `1`
    > Values: `0` or `1`

Optimize images with _imagemin_.

> `--resize`

    > Type: `number`
    > Default: 0
    > Format: `width`x`height`

Resizes the images to the specified width and height values. This can be either a pixel value like `300x200` to resize to a fixed size. Or a percentage like `50%` or `60%x40%` to scale the width and height according to the given percentag.

> `--quality`

    > Type: `number`
    > Default: `1`
    > Values: either number from 1 to 100.

Specify the image quality. A higher number means better quality, but also a larger file size.


####Icons
```
gulp icons
```
Combineert SVGs en maakt of font bestanden, of een grote SVG sprite. In beide gevallen wordt een Sass import bestand aangemaakt in de `assets/scss/` map. Vervolgens wordt een evt. gegenereerd SVG bestand geoptimaliseerd.
