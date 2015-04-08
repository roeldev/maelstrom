/**
 * maelstrom | lib/plugins/sass.js
 * file version: 0.00.008
 */
'use strict';

var Maelstrom        = require('../index.js'),
    Config           = Maelstrom.config,
    ModulesConfig    = Maelstrom.config.modules,
    Utils            = require('../utils.js'),
    Plugin           = require('../plugin.js'),
    PluginExport     = new Plugin(__filename),
    Gulp             = Maelstrom.gulp,
    GulpAutoprefixer = require('gulp-autoprefixer'),
    GulpMinifyCss    = require('gulp-minify-css'),
    GulpSass         = require('gulp-sass'),
    GulpScssLint     = require('gulp-scss-lint'),
    GulpSize         = require('gulp-size'),
    Path             = require('path');

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
 * Compile Sass with _gulp-sass_ (_Libsass_), the compiled CSS will be
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
 * Compile Sass with _gulp-ruby-sass_ (Ruby _Sass_ gem). The compiled CSS
 * will be autoprefixed and minified when not in `--dev`.
 *
 * @WIP
 */
PluginExport.addStream('ruby', function()
{
    return false;
});

/**
 * Compile Sass with _gulp-compass_ (Ruby _Compass_ gem). The compiled
 * CSS will be autoprefixed and minified when not in `--dev`.
 *
 * @WIP
 */
PluginExport.addStream('compass', function()
{
    return false;
});

/**
 * @WIP
 */
PluginExport.addStream('lint', function()
{
    return false;
});

//------------------------------------------------------------------------------

/**
 * Compile with the compiler set in the config/env vars.
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
    var $config =
    {
        'config':     Path.resolve(__dirname, '../../configs/scss-lint.yml'),
        'bundleExec': false
    };

    return Gulp.src($plugin.src('!'+ Config.src.sass +'/maelstrom/*.scss'))
        .pipe( Maelstrom.plumber() )
        .pipe( GulpScssLint($config) );
});

module.exports = PluginExport;
