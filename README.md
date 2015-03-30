#maelstrom
**A collection of Gulp tasks. Work in progress.**

##Installation
```
npm install --save maelstrom
```

##How to use
After installation you can configure Maelstrom by creating a `maelstrom.json` file in your project root (same folder as where your `package.json` and `gulpfile.js` files are located).


##Sample `gulpfile.js`
Using all of Maelstrom's default plugins and tasks:
```js
require('maelstrom)();
```

Using a Maelstrom plugin as a wrapper in a gulp task:
```js
var gulp      = require('gulp'),
    maelstrom = require('maelstrom);

maelstrom.init();

gulp.task('some-task', function()
{
    gulp.src('path/to/src/*')
        .pipe(maelstrom.pluginName()) // wrapper function
        .pipe(gulp.dest('path/to/dest/'));
});

// call the plugin's default watch function
gulp.task('watch', function()
{
    maelstrom.pluginName.watch();
})

```

##Available default Gulp tasks
###Sass###
```
gulp sass
```
> `--compiler`

> Type: `string`
> Default: `libsass`
> Values: `libsass` or `ruby`

The compiler to use: `libsass` works with _gulp-sass_ and `ruby` with _gulp-ruby-sass_.

> `--dev`

> Type: `boolean`
> Default: `1`
> Values: `0` or `1`

This flag indicates if the compiled CSS file should not be minified. The default value is `1`, an optional value of `0` can be used, wich disables minifying the output file.


###Images###
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

##Todo's and near future support
- clean - clean the public and temp folders and remove unnecessary files (like Thumbs.db and .DS_Store)
- sync:start - start browser-sync server/proxy
- sync:reload - reload browser-sync browsers
- datauri - css bestanden in de gaten houden, vervolgens alle src(.*) strings nalopen en afbeeldingen hierin van <= 5kb apart opslaan als base64 encoded strings in /assets/datauri/filename.txt. Vervolgens Sass import bestand maken met placeholders met deze data adhv. template.
- flags - vlaggen van alle landen als svg in assets/flags/. via config aangeven welke vlaggen gebruiken. vlaggen worden als sprite opgeslagen.
- watch --task <task> - watch specifieke task

##Distant future support
- Less
- Stylus
- CoffeeScript
- TypeScript
- Jade
- Haml
