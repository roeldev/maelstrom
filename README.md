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
> Before installing maelstrom, make sure you have globally installed both gulp and browser-sync: `npm install -g gulp browser-sync`.

##How to use
After installation you can configure maelstrom by creating a `maelstrom.json` file in your project root (same folder as where your `package.json` and `gulpfile.js` files are located).

####Using all default plugins and tasks
If you would like maelstrom to add all of it's default tasks to gulp you only have to have the following two lines in your gulpfile:

```js
var gulp      = require('gulp'),
    maelstrom = require('maelstrom')(gulp);
```
> Note that gulp is directly passed to the maelstrom function wich is returned by `require('maelstrom')`. Without this, maelstrom will not work.

####Using a specific plugin/task
When you only want to use a certain plugin and/or task, you'll have to add a little more code. First `require` both the gulp and maelstrom packages. Then pass gulp to maelstrom's initializer: `maelstrom.init(gulp)`.
You are now ready to use all of the default maelstrom plugins with `maelstrom.pluginName()`, add tasks with `maelstrom.task()` and/or watch tasks with `maelstrom.watch()`.

```js
var gulp      = require('gulp'),
    maelstrom = require('maelstrom');

// init maelstrom
maelstrom.init(gulp);
// add one of maelstrom's default tasks to gulp
maelstrom.task('some-default-maelstrom-task');

// use a maelstrom plugin in your own task
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

##Available default tasks
###Sass
```
gulp sass
```
> `--dev`
> Type: `boolean`
> Default: `1`
> Values: `0` or `1`

This flag indicates if the compiled CSS file should not be minified. The default value is `1`, an optional value of `0` can be used, wich disables minifying the output file.


###Images
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
> Default:
> Format: `width`x`height`

Resizes the images to the specified width and height values. This can be either a pixel value like `300x200` to resize to a fixed size. Or a percentage like `50%` or `60%x40%` to scale the width and height according to the given percentag.

> `--quality`
> Type: `number`
> Default: `1`
> Values: either number from 1 to 100.

Specify the image quality. A higher number means better quality, but also a larger file size.


###Icons###
```
gulp icons
```
<table>
<thead><td>Parameter</td><td>Default</td><td>Example</td></thead>
<tr><td>`--create`</td><td>font</td><td>sprite</td></tr>
</table>

Combineert SVGs en maakt of font bestanden, of een grote SVG sprite. In beide gevallen wordt een Sass import bestand aangemaakt in de `assets/scss/` map. Vervolgens wordt een evt. gegenereerd SVG bestand geoptimaliseerd.
