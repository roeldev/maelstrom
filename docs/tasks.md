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

# Available tasks

- [css][task-css]
- [icons][task-icons]
- [images][task-images]
- [js][task-js]
- [js:concat][task-jsconcat]
- [js:lint][task-jslint]
- [sass][task-sass]
- [sass:lint][task-sasslint]

## css
This will concat, autoprefix and minify (when `--prod`) all files from the `cssConcat` option in the config and save them in the `dest.css` folder.

## icons
This will combine all SVG from the `src.icons` folder and output an icon font to `dest.font`. It will also create a Sass codepoints file in the subfolder `maelstrom` in `src.sass` wich you should use in your main Sass.

## images
Minifies all images from the `src.images` folder and saves them in `dest.images`.

## js
Executes the `js:lint` and `js:concat` tasks with _run-sequence_.

## js:concat
This will concat and uglify (when `--prod`) all files from the `jsConcat` option in the config and save them in the `dest.js` folder.

## js:lint
The javascript code from `src.js` will be linted with _jshint_. Any problems will be display with _jshint-stylish_.

## sass
Sass files located in `src.sass` will be compiled, autoprefixed and minified (when `--prod`) and saved to the `dest.css` folder.

## sass:lint
All files in the `src.sass` folder (except in the `maelstrom` subfolder) will be linted with _gulp-scss-lint_ and _scss-lint_. Any problems will be displayed with _gulp-scss-lint-stylish_.

[task-css]: #task-css
[task-icons]: #task-icons
[task-images]: #task-images
[task-js]: #task-js
[task-jsconcat]: #task-jsconcat
[task-jslint]: #task-jslint
[task-sass]: #task-sass
[task-sasslint]: #task-sasslint
