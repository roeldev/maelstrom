## Documentation
- [Requirements][docs-requirements]: What software, packages and gems are required?
- [Config][docs-config]: All available config options described and explained.
- [API][docs-api]: Want to know how to use the maelstrom functions?
- [Plugins][docs-plugins]: Detailed descriptions for all default maelstrom plugins.
- [Tasks][docs-tasks]: More info about maelstrom's default gulp tasks.

[< Back to Readme](../README.md)

[docs-requirements]: requirements.md
[docs-config]: config.md
[docs-api]: api.md
[docs-plugins]: plugins.md
[docs-tasks]: tasks.md

--------------------------------------------------------------------------------

# Config
You can configure maelstrom by creating either a `maelstrom.yml` or `maelstrom.json` file in your project root folder (same folder as where your `package.json` and `gulpfile.js` files are located). Both YAML and JSON are supported, so just choose the file format you're most comfortable with.

> Note: when both a `maelstrom.yml` and `maelstrom.json` file are present, the JSON file is ignored.


# Options
- [src][config-src]
- [dest][config-dest]
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
- [vars][config-vars]

--------------------------------------------------------------------------------
### src
Folders returned by the plugin's `.src()` functions. Used while adding tasks to gulp.

<table>
<tr><td>Type</td><td><code>object</code></td></tr>
<tr><td>Default</td><td><pre><code>{
    bower:   'assets/bower_components'
    css:     'assets/css'
    favicon: 'assets/favicon'
    icons:   'assets/icons'
    images:  'assets/imgs'
    js:      'assets/js'
    sass:    'assets/scss'
}</code></pre></td></tr>
</table>

--------------------------------------------------------------------------------
### dest
Folders returned by the plugin's `.dest()` functions. Used inside task functions wich are added to gulp.

<table>
<tr><td>Type</td><td><code>object</code></td></tr>
<tr><td>Default</td><td><pre><code>{
    'css':    'public/css',
    'fonts':  'public/fonts',
    'images': 'public/imgs',
    'js':     'public/js'
}</code></pre></td></tr>
</table>

--------------------------------------------------------------------------------
### cssConcat
A list of CSS files wich will be concatenated to one file. The output file will be autoprefixed, minified and saved to the `dest.css` folder.

<table>
<tr><td>Type</td><td><code>object</code></td></tr>
<tr><td>Default</td><td><code>{}</code></td></tr>
</table>

Example:
```
{
    'output-filename': ['file.css', '/glob/files/*.css']
}
```

--------------------------------------------------------------------------------
### configFile
The config file to search for in the project root folder. Supported file formats are `YAML` and `JSON`.

<table>
<tr><td>Type</td><td><code>string</code></td></tr>
<tr><td>Default</td><td><code>maelstrom.yml</code></td></tr>
</table>

--------------------------------------------------------------------------------
### defaultMode
Specify the default mode. This is either `dev` or `prod`.

<table>
<tr><td>Type</td><td><code>string</code></td></tr>
<tr><td>Default</td><td><code>dev</code></td></tr>
<tr><td>Values</td><td><code>dev</code> or <code>prod</code></td></tr>
</table>

--------------------------------------------------------------------------------
### iconsOutputName
The name as what the output fonts or sprite will be saved.

<table>
<tr><td>Type</td><td><code>string</code></td></tr>
<tr><td>Default</td><td><code>iconfont</code></td></tr>
</table>

--------------------------------------------------------------------------------
### iconsTemplate
<table>
<tr><td>Type</td><td><code>string</code></td></tr>
<tr><td>Default</td><td><code>%templates%/iconfont-frame.js</code></td></tr>
</table>

--------------------------------------------------------------------------------
### iconsType
Specify how you would like to use SVG icons. Valid options are as a `font` or `sprite`. Both options will create a Sass .scss file in the `config.src.sass` folder, wich should be imported with `@import` in your main Sass file. Fonts files are written to `config.dest.fonts`, the sprite file to `config.dest.images`. Any files with the same name will be overwritten.

<table>
<tr><td>Type</td><td><code>string</code></td></tr>
<tr><td>Default</td><td><code>font</code></td></tr>
<tr><td>Values</td><td><code>font</code> or <code>sprite</code>* (not yet available)</td></tr>
</table>

--------------------------------------------------------------------------------
### imageExtensions
Image file extension wich should be optimized with _gulp-imagemin_.

<table>
<tr><td>Type</td><td><code>array</code></td></tr>
<tr><td>Default</td><td><code>['jpg', 'jpeg', 'png', 'gif', 'svg']</code></td></tr>
</table>

--------------------------------------------------------------------------------
### jsConcat
A list of JS wich will be combined to one file. The output file will be minified and saved to the `config.dest.js` folder.

<table>
<tr><td>Type</td><td><code>object</code></td></tr>
<tr><td>Default</td><td><code>{}</code></td></tr>
</table>

--------------------------------------------------------------------------------
### jsHintConfig
The contents of this object are added to `modules.jshint`. Supported file formats are `YAML` and `JSON`.

<table>
<tr><td>Type</td><td><code>object</code></td></tr>
<tr><td>Default</td><td><code>%configs%/jshint.yml</code></td></tr>
</table>

--------------------------------------------------------------------------------
### sassCompiler
Specify wich library should be used to compile the Sass files to CSS. Available options are `libsass` (_gulp-sass_), `ruby` (_gulp-ruby-sass_) and `compass` (). All output files will be autoprefixed by default. When the `--dev` flag is not added, the files will also be minified.

<table>
<tr><td>Type</td><td><code>string</code></td></tr>
<tr><td>Default</td><td><code>libsass</code></td></tr>
<tr><td>Values</td><td><code>libsass</code>, <code>ruby</code>* or <code>compass</code>* (not yet available)</td></tr>
</table>

--------------------------------------------------------------------------------
### verbose
<table>
<tr><td>Type</td><td><code>boolean</code></td></tr>
<tr><td>Default</td><td><code>true</code></td></tr>
</table>

--------------------------------------------------------------------------------
### vars
This object contains all config variables wich you can use in your config file or custom config object. The default values `src` and `dest` contain the paths specified in the [`src][config-src] and [`dest`][config-dest] config options, and will be flattend (so `{ src: { css: 'path/to/css' } }` becomes `{ src.css: 'path/to/css' }`).

<table>
<tr><td>Type</td><td><code>object</code></td></tr>
<tr><td>Default</td><td><pre><code>{
    module:    <i>__dirname</i>,
    src:       {...},
    dest:      {...},
    configs:   '%module%/configs',
    templates: '%module%/templates'
}
</code></pre></td></tr>
</table>

> See the [confirge](https://github.com/roeldev/confirge) project for more info about the use of variables.


[config-src]: #src
[config-dest]: #dest
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
[config-vars]: #vars
