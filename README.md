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
- --compiler <_libsass | ruby_>
- --dev*

Compile Sass bestanden dmv. _libsass_ of _Ruby_ (default in te stellen via config, of anders via parameter). Wanneer niet *dev*, de output door _autoprefixer_ en _minifycss_.

###Images###
```
gulp images
```
Optimaliseer afbeeldingen dmv. _imagemin_.

```
gulp images:resize
```
- –-size <_width_ x _height_>
- --quality <_quality_>
- --dir <_dir_>

Verkleint de afbeeldingen in map *dir* volgens de opgegeven *width* x *height* en/of *quality* parameter.

###Icons###
```
gulp icons
```
- –-create <_font | sprite_>

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
