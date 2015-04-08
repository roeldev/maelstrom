##Documentation
- [Requirements][docs-requirements]: What software, packages and gems are required?
- [Config][docs-config]: All available config options described and explained.
- [API][docs-api]: Want to know how to use the maelstrom functions?
- [Plugins][docs-plugins]: Detailed descriptions for all default maelstrom plugins.
- [Tasks][docs-tasks]: More info about maelstrom's default gulp tasks.

[< Back to Readme](../README.md)

--------------------------------------------------------------------------------


#Config
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


#####_src_
> Type: `object`

> Default:
```js
{
    'favicon': 'assets/favicon',
    'flags':   'assets/flags',
    'icons':   'assets/icons',
    'images':  'assets/imgs',
    'js':      'assets/js',
    'sass':    'assets/scss'
}
```
Folders returned by the plugin's `.src()` functions. Used while adding tasks to gulp.


#####_dest_
> Type: `object`

> Default:
```js
{
    'css':    'public/css',
    'fonts':  'public/fonts',
    'images': 'public/imgs',
    'js':     'public/js'
}
```
Folders returned by the plugin's `.dest()` functions. Used inside task functions wich are added to gulp.


#####_browserSyncWatch_
> Type: `array`

> Default: `[]`

An array with globs wich should trigger browser-sync to reload the browsers.


#####_cssConcat_
> Type: `object`

> Default: `{}`

A list of CSS files wich will be concatenated to one file. The output file will be autoprefixed, minified and saved to the `dest.css` folder.

Example: `'output-filename': ['file.css', '/files/to/concat/*.css']`


#####_defaultMode_
> Type: `string`

> Default: `dev`

> Values: `dev` or `prod`

x


#####_iconsOutputName_
> Type: `string`

> Default: `iconfont`

x


#####_iconsType_
> Type: `string`

> Default: `font`

> Values: `font` or `sprite` (not yet available)

x


#####_imageExtensions_
> Type: `array`

> Default: `['jpg', 'jpeg', 'png', 'gif', 'svg']`

x


#####_jsConcat_
> Type: `object`

> Default: `{}`

x


#####_sassCompiler_
> Type: `string`

> Default: `libsass`

> Values: `libsass` or `ruby` (not yet available)

x


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

[docs-requirements]: requirements.md
[docs-config]: config.md
[docs-api]: api.md
[docs-plugins]: plugins.md
[docs-tasks]: tasks.md
