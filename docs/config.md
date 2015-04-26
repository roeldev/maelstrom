## Documentation
- [Requirements][docs-requirements]: What software, packages and gems are required?
- [Config][docs-config]: All available config options described and explained.
- [API][docs-api]: Want to know how to use the maelstrom functions?
- [Plugins][docs-plugins]: Detailed descriptions for all default maelstrom plugins.
- [Tasks][docs-tasks]: More info about maelstrom's default gulp tasks.

[< Back to Readme](../README.md)

--------------------------------------------------------------------------------


# Config
- [src][config-src]
- [dest][config-dest]
- [browserSyncWatch][config-browserSyncWatch]
- [cssConcat][config-cssConcat]
- [configFile][config-configFile]
- [defaultMode][config-defaultMode]
- [iconsOutputName][config-iconsOutputName]
- [iconsTemplate][config-iconsTemplate]
- [iconsType][config-iconsType]
- [imageExtensions][config-imageExtensions]
- [jsConcat][config-jsConcat]
- [jsHintConfig][config-jsHintConfig]
- [sassCompiler][config-sassCompiler]
- [verbose][config-verbose]

### src
<table>
<tr><td>Type</td><td><code>object</code></td></tr>
<tr><td>Default</td><td><code>{
    'favicon': 'assets/favicon',
    'flags':   'assets/flags',
    'icons':   'assets/icons',
    'images':  'assets/imgs',
    'js':      'assets/js',
    'sass':    'assets/scss'
}</code></td></tr>
</table>
Folders returned by the plugin's `.src()` functions. Used while adding tasks to gulp.


### dest
<table>
<tr><td>Type</td><td><code>object</code></td></tr>
<tr><td>Default</td><td><pre><code>{
    'css':    'public/css',
    'fonts':  'public/fonts',
    'images': 'public/imgs',
    'js':     'public/js'
}</code></pre></td></tr>
</table>
Folders returned by the plugin's `.dest()` functions. Used inside task functions wich are added to gulp.


### browserSyncWatch
<table>
<tr><td>Type</td><td><code>array</code></td></tr>
<tr><td>Default</td><td><code>[
    '%dest.css%/**/*',
    '%dest.fonts%/**/*',
    '%dest.images%/**/*',
    '%dest.js%/**/*',
    'public/**/*.{html,php}'
]</code></td></tr>
</table>
An array with globs wich should trigger BrowserSync to reload.


### cssConcat
<table>
<tr><td>Type</td><td><code>object</code></td></tr>
<tr><td>Default</td><td><code>{}</code></td></tr>
</table>
A list of CSS files wich will be concatenated to one file. The output file will be autoprefixed, minified and saved to the `dest.css` folder.

Example:
```
{
    'output-filename': ['file.css', '/glob/files/*.css']
}
```


### configFile
<table>
<tr><td>Type</td><td><code>string</code></td></tr>
<tr><td>Default</td><td><code>maelstrom.yml</code></td></tr>
</table>
The config file to search for in the project root folder. Supported file formats are `YAML` and `JSON`.


### defaultMode
<table>
<tr><td>Type</td><td><code>string</code></td></tr>
<tr><td>Default</td><td><code>dev</code></td></tr>
<tr><td>Values</td><td><code>dev</code> or <code>prod</code></td></tr>
</table>
Specify the default mode. This is either `dev` or `prod`.


### iconsOutputName
<table>
<tr><td>Type</td><td><code>string</code></td></tr>
<tr><td>Default</td><td><code>iconfont</code></td></tr>
</table>
The name as what the output fonts or sprite will be saved.


### iconsTemplate
<table>
<tr><td>Type</td><td><code>string</code></td></tr>
<tr><td>Default</td><td><code>%templates%/iconfont-frame.js</code></td></tr>
</table>


### iconsType
<table>
<tr><td>Type</td><td><code>string</code></td></tr>
<tr><td>Default</td><td><code>font</code></td></tr>
<tr><td>Values</td><td><code>font</code> or <code>sprite</code>* (not yet available)</td></tr>
</table>
Specify how you would like to use SVG icons. Valid options are as a `font` or `sprite`. Both options will create a Sass .scss file in the `config.src.sass` folder, wich should be imported with `@import` in your main Sass file. Fonts files are written to `config.dest.fonts`, the sprite file to `config.dest.images`. Any files with the same name will be overwritten.


### imageExtensions
<table>
<tr><td>Type</td><td><code>array</code></td></tr>
<tr><td>Default</td><td><code>['jpg', 'jpeg', 'png', 'gif', 'svg']</code></td></tr>
</table>
Image file extension wich should be optimized with _gulp-imagemin_.


### jsConcat
<table>
<tr><td>Type</td><td><code>object</code></td></tr>
<tr><td>Default</td><td><code>{}</code></td></tr>
</table>
A list of JS wich will be combined to one file. The output file will be minified and saved to the `config.dest.js` folder.


### jsHintConfig
<table>
<tr><td>Type</td><td><code>object</code></td></tr>
<tr><td>Default</td><td><code>%configs%/jshint.yml</code></td></tr>
</table>
The contents of this object are added to `modules.jshint`. Supported file formats are `YAML` and `JSON`.


### sassCompiler
<table>
<tr><td>Type</td><td><code>string</code></td></tr>
<tr><td>Default</td><td><code>libsass</code></td></tr>
<tr><td>Values</td><td><code>libsass</code>, <code>ruby</code>* or <code>compass</code>* (not yet available)</td></tr>
</table>
Specify wich library should be used to compile the Sass files to CSS. Available options are `libsass` (_gulp-sass_), `ruby` (_gulp-ruby-sass_) and `compass` (). All output files will be autoprefixed by default. When the `--dev` flag is not added, the files will also be minified.


### verbose
<table>
<tr><td>Type</td><td><code>boolean</code></td></tr>
<tr><td>Default</td><td><code>true</code></td></tr>
</table>


# Variables
Check (confirge)[https://github.com/roeldev/confirge] for more info about the use of variables.

# Configuration of modules


[config-src]: #src
[config-dest]: #dest
[config-browserSyncWatch]: #browsersyncwatch
[config-cssConcat]: #cssconcat
[config-configFile]:  #configfile
[config-defaultMode]: #defaultmode
[config-iconsOutputName]: #iconsoutputname
[config-iconsTemplate]: #iconstemplate
[config-iconsType]: #iconstype
[config-imageExtensions]: #imageextensions
[config-jsConcat]: #jsconcat
[config-jsHintConfig]: #jshintconfig
[config-sassCompiler]: #sasscompiler
[config-verbose]: #verbose

[docs-requirements]: requirements.md
[docs-config]: config.md
[docs-api]: api.md
[docs-plugins]: plugins.md
[docs-tasks]: tasks.md
