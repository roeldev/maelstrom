/**
 * maelstrom | lib/plugins/sass.js
 * file version: 0.00.005
 */
'use strict';

var Maelstrom        = require('../index.js'),
    Plugin           = require('../plugin.js'),
    PluginExport     = new Plugin(__filename),
    Config           = Maelstrom.config,
    ModulesConfig    = Maelstrom.config.modules,
    Utils            = Maelstrom.utils,
    Gulp             = Maelstrom.gulp,
    GulpAutoprefixer = require('gulp-autoprefixer'),
    GulpMinifyCss    = require('gulp-minify-css'),
    GulpSass         = require('gulp-sass'),
    GulpSize         = require('gulp-size');

////////////////////////////////////////////////////////////////////////////////

/**
 * Return the location of the Sass source files.
 */
PluginExport.src = function()
{
    return Config.src.sass +'/**/*.{sass,scss}';
};

/**
 * Return the location of the CSS output folder.
 */
PluginExport.dest = function()
{
    return Config.dest.css;
};

//------------------------------------------------------------------------------

/**
 * Compile Sass with _gulp-sass_ and _Libsass_, the compiled CSS will be
 * autoprefixed and minified when not in `--dev`.
 */
PluginExport.addStream('libsass', function($isProd)
{
    return Utils.pipeStreams(
    [
        GulpSass(ModulesConfig.libsass),
        GulpAutoprefixer(ModulesConfig.autoprefixer),
        Utils.pipeWhenProd(GulpMinifyCss(), $isProd)
    ]);
});

/**
 * Compile Sass with _gulp-ruby-sass_ and the Ruby _Sass_ gem. The compiled CSS
 * will be autoprefixed and minified when not in `--dev`.
 *
 * @WIP
 */
PluginExport.addStream('ruby', function()
{
    return false;
});

/**
 * Compile Sass with _gulp-compass_ and the Ruby _Compass_ gem. The compiled
 * CSS will be autoprefixed and minified when not in `--dev`.
 *
 * @WIP
 */
PluginExport.addStream('compass', function()
{
    return false;
});

//------------------------------------------------------------------------------

/**
 * Lint Sass and compile with the compiler set in the config/env vars.
 */
PluginExport.addTask('sass', function($plugin)
{
    var $compiler = Config.sassCompiler;

    // force libsass for now
    $compiler = 'libsass';

    return Gulp.src($plugin.src())
        .pipe( Maelstrom.plumber() )
        .pipe( $plugin.stream($compiler) )
        .pipe( GulpSize(ModulesConfig.size) )
        .pipe( Gulp.dest($plugin.dest()) )
        .pipe( Maelstrom.browserSync() );
});

/**
 * Lint Sass with npm package gulp-scss-lint and Ruby gem scss-lint.
 *
 * @WIP
 */
PluginExport.addTask('sass:lint', function($plugin)
{

});

module.exports = PluginExport;
