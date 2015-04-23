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


## BrowserSync

### maelstrom.browserSync()
Adds browser-sync reload to a gulp stream.

### maelstrom.browserSync.start()
Starts browser-sync.

### maelstrom.browserSync.watch()
Adds a gulp watch action and reloads browser-sync on change.


## JavaScript
- concat
- lint

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




[plugin-browserSync]:
[plugin-css]:
[plugin-icons]:
[plugin-images]:
[plugin-js]:
[plugin-plumber]:
[plugin-sass]:

[docs-requirements]: requirements.md
[docs-config]: config.md
[docs-api]: api.md
[docs-plugins]: plugins.md
[docs-tasks]: tasks.md
