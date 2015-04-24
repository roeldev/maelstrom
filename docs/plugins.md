## Documentation
- [Requirements][docs-requirements]: What software, packages and gems are required?
- [Config][docs-config]: All available config options described and explained.
- [API][docs-api]: Want to know how to use the maelstrom functions?
- [Plugins][docs-plugins]: Detailed descriptions for all default maelstrom plugins.
- [Tasks][docs-tasks]: More info about maelstrom's default gulp tasks.

[< Back to Readme](../README.md)

--------------------------------------------------------------------------------


# Available plugins
- [BrowserSync][plugin-browserSync]
- [CSS][plugin-css]
- [Icons][plugin-icons]
- [Images][plugin-images]
- [JavaScript][plugin-js]
- [Plumber][plugin-plumber]
- [Sass][plugin-sass]


--------------------------------------------------------------------------------
## BrowserSync

### maelstrom.browserSync()
Adds browser-sync reload to a gulp stream.

### maelstrom.browserSync.start()
Starts browser-sync.

### maelstrom.browserSync.watch()
Adds a gulp watch action and reloads browser-sync on change.


--------------------------------------------------------------------------------
## CSS

### maelstrom.css('concat', destFile[, isProd])
Wrapper for _gulp-concat_ combined with _gulp-autoprefixer_ and _gulp-minify-css_.

- <h4>destFile</h4>
<table>
<tr><td>Type</td><td><code>string</code></td></tr>
</table>
Name of the destination file. The file path will be relative to the path in `gulp.dest()`.

- <h4>isProd</h4>
<table>
<tr><td>Type</td><td><code>boolean</code> or <code>null</code></td></tr>
<tr><td>Default</td><td><code>null</code></td></tr>
</table>

### maelstrom.css.dest()
### maelstrom.css.src()

--------------------------------------------------------------------------------
## Icons

### maelstrom.icons('font')
### maelstrom.icons.dest()
### maelstrom.icons.src()

--------------------------------------------------------------------------------
## Images

### maelstrom.images('optimize')
### maelstrom.images.dest()
### maelstrom.images.src()

--------------------------------------------------------------------------------
## JavaScript

### maelstrom.js('concat', destFile)
Wrapper for _gulp-concat_ combined with _gulp-uglify_.

- <h4>destFile</h4>
<table>
<tr><td>Type</td><td><code>string</code></td></tr>
</table>
Name of the destination file. The file path will be relative to the path in `gulp.dest()`.

### maelstrom.js('lint')
Wrapper for _gulp-jshint_ with the _jshint-stylish_ reporter.

### maelstrom.js.concat(destFile, srcFiles)

- <h4>destFile</h4>
<table>
<tr><td>Type</td><td><code>string</code></td></tr>
</table>
Name of the destination file.

- <h4>srcFiles</h4>
<table>
<tr><td>Type</td><td><code>array</code> or <code>string</code></td></tr>
</table>
Files to concat.

### maelstrom.js.dest()
### maelstrom.js.src()


--------------------------------------------------------------------------------
## Plumber

### maelstrom.plumber()
Wrapper for _gulp-plumber_ combined with _gulp-notify_.

--------------------------------------------------------------------------------
## Sass

### maelstrom.sass('libsass')
### maelstrom.sass('lint')
### maelstrom.sass.dest()
### maelstrom.sass.src()


[plugin-browserSync]: #browsersync
[plugin-css]: #css
[plugin-icons]: #icons
[plugin-images]: #images
[plugin-js]: #javascript
[plugin-plumber]: #plumber
[plugin-sass]: #sass

[docs-requirements]: requirements.md
[docs-config]: config.md
[docs-api]: api.md
[docs-plugins]: plugins.md
[docs-tasks]: tasks.md
