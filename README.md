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

--------------------------------------------------------------------------------
##Config
- [src][config-src]
- [dest][config-dest]
- [browserSyncWatch][config-browserSyncWatch]
- [cssConcat][config-cssConcat]
- [defaultMode][config-defaultMode]
- [iconsOutputName][config-iconsOutputName]
- [iconsType][config-iconsType]
- [imageExtensions][config-imageExtensions]
- [jsConcat][config-jsConcat]
- [sassCompiler][config-sassCompiler]

####_src_
> Type: `object`
> Default:
```js
'favicon': 'assets/favicon',
'flags':   'assets/flags',
'icons':   'assets/icons',
'images':  'assets/imgs',
'js':      'assets/js',
'sass':    'assets/scss'
```

Folders returned by the plugin's `.src()` functions. Used while adding tasks to gulp.

####_dest_
> Type: `object`
> Default:
```js
'css':    'public/css',
'fonts':  'public/fonts',
'images': 'public/imgs',
'js':     'public/js'
```

Folders returned by the plugin's `.dest()` functions. Used inside task functions wich are added to gulp.

####_browserSyncWatch_
> Type: `array`
> Default: `[]`

An array with globs wich should trigger browser-sync to reload the browsers.

####_cssConcat_
> Type: `object`
> Default: `{}`

A list of CSS files wich will be concatenated to one file. The output file will be autoprefixed, minified and saved to the `dest.css` folder.

Example: `'output-filename': ['file.css', '/files/to/concat/*.css']`

####_defaultMode_
> Type: `string`
> Default: `dev`
> Values: `dev` or `prod`

x

####_iconsOutputName_
> Type: `string`
> Default: `iconfont`

x

####_iconsType_
> Type: `string`
> Default: `font`
> Values: `font` or `sprite` (not yet available)

x

####_imageExtensions_
> Type: `array`
> Default: `['jpg', 'jpeg', 'png', 'gif', 'svg']`

x

####_jsConcat_
> Type: `object`
> Default: `{}`

x

####_sassCompiler_
> Type: `string`
> Default: `libsass`
> Values: `libsass` or `ruby` (not yet available)

x

--------------------------------------------------------------------------------
##API
- [maelstrom()][api-maelstrom]
- [maelstrom.init()][api-maelstrom-init]
- [maelstrom.task()][api-maelstrom-task]
- [maelstrom.watch()][api-maelstrom-watch]
- [maelstrom.extend()][api-maelstrom-extend]

####`maelstrom()`
Initializing maelstrom by calling this function passes all arguments to the `maelstrom.init()` function, and adds all default tasks to gulp.

####`maelstrom.init(gulp[, customConfig])`
Maelstrom initializer wich allows you to use the default plugins inside your own gulp tasks.

> ######_gulp_
> Type: `object`

A reference to the required gulp module.

> ######_customConfig_
> Type: `object`

An optional custom config object. This will overrule both the default maelstrom config and the options loaded from `maelstrom.json`.

####`maelstrom.task(taskName[, options...])`
This function adds a default maelstrom task to `gulp.task()`. The result from the `gulp.task()` function is returned. If for some reason `gulp.task()` is not called, the default value of `false` is returned.

> ######_taskName_
> Type: `string`

Name of the maelstrom task to add to gulp.

> ######_options_
> Type: `mixed`

All other arguments are passed along to the task function. Check the documentation for the task you would like to use to see wich extra options are available.


####`maelstrom.watch(taskName[, extraFiles][, extraTasks])`
This function adds a file watcher with `gulp.watch()` for the given task. The files to watch are taken from the plugin wich defined the task. The default result from the `gulp.watch()` function is returned. If for some reason `gulp.watch` is not called, the default value of `false` is returned.

> ######_taskName_
> Type: `string`

Name of the maelstrom task to watch.

> ######_extraFiles_
> Type: `array` or `string`

Optional extra files to pass to `gulp.watch()`.

> ######_extraTasks_
> Type: `array` or `string`

Optional extra tasks to pass to `gulp.watch()`.

####`maelstrom.extend(name, plugin)`
Extend maelstrom by adding your own functions, objects or arrays. To load a plugin from a file pass the filename as a string. The results from the file (`module.exports`) will be added as the plugin.

> ######_name_
> Type: `string`

The name to call the plugin: `maelstrom._name_`.

> ######_plugin_
> Type: `function` or `object` or `string`

A plugin to add to maelstrom.

--------------------------------------------------------------------------------
##Available plugins
- [browserSync]
- [images]
- [plumber]
- [sass]

--------------------------------------------------------------------------------
##Available tasks
- Sass
- Images
- Icons

####`gulp sass [--compiler <libsass|ruby>] [--dev] [--prod]`

> ######_--dev_
> Type: `boolean`
> Default: `0`
> Values: `0` or `1`

This flag indicates if the compiled CSS file should not be minified. The default value is `1`, an optional value of `0` can be used, wich disables minifying the output file.

> ######_--prod_
> Type: `boolean`
> Default: `0`
> Values: `0` or `1`


####`gulp images [--optimize][ --resize][ --quality]`
> ######_--optimize_
> Type: `boolean`
> Default: `1`
> Values: `0` or `1`

Optimize images with _imagemin_.

> ######_--resize_
> Type: `number`
> Default: `0`
> Format: `width`x`height`

Resizes the images to the specified width and height values. This can be either a pixel value like `300x200` to resize to a fixed size. Or a percentage like `50%` or `60%x40%` to scale the width and height according to the given percentag.

> ######_--quality_
> Type: `number`
> Default: `1`
> Values: a number from `1` to `100`.

Specify the image quality. A higher number means better quality, but also a larger file size.


####`gulp icons`
Combineert SVGs en maakt of font bestanden, of een grote SVG sprite. In beide gevallen wordt een Sass import bestand aangemaakt in de `assets/scss/` map. Vervolgens wordt een evt. gegenereerd SVG bestand geoptimaliseerd.

[config-src]: #src
[config-dest]: #dest
[config-browserSyncWatch]: #browsersyncwatch
[config-cssConcat]: #cssconcat
[config-defaultMode]: #defaultmode
[config-iconsOutputName]: #iconsoutputname
[config-iconsType]: #iconstype
[config-imageExtensions]: #imageextensions
[config-jsConcat]: #jsconcat
[config-sassCompiler]: #sasscompiler

[api-maelstrom]: #maelstrom-1
[api-maelstrom-init]: #maelstrominitgulp-customconfig
[api-maelstrom-task]: #maelstromtasktaskname-options
[api-maelstrom-watch]: #maelstromwatchtaskname-extrafiles-extratasks
[api-maelstrom-extend]: #maelstromextendname-plugin
