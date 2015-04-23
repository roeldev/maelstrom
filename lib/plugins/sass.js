/**
 * maelstrom | lib/plugins/sass.js
 * file version: 0.01.002
 *
 * Streams:
 * ✓ libsass
 * - ruby*
 * - compass*
 * ✓ lint
 *
 * Tasks:
 * ✓ sass
 * ✓ sass:lint
 */
'use strict';

var Maelstrom           = require('../index.js');
var Config              = Maelstrom.config;
var ModulesConfig       = Maelstrom.config.modules;
var Utils               = Maelstrom.utils;
var Plugin              = require('../plugin.js');
var PluginExport        = new Plugin(__filename);

var _                   = require('underscore');
var Gulp                = Maelstrom.gulp;
var GulpAutoprefixer    = require('gulp-autoprefixer');
var GulpMinifyCss       = require('gulp-minify-css');
var GulpSass            = require('gulp-sass');
var GulpScssLint        = require('gulp-scss-lint');
var GulpScssLintStylish = require('gulp-scss-lint-stylish');
var GulpSize            = require('gulp-size');

////////////////////////////////////////////////////////////////////////////////

/**
 * Return the location of the Sass source files.
 */
PluginExport.src = function($src)
{
    return Utils.extendArgs($src, Config.src.sass + '/**/*.{sass,scss}');
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
 * Lint Sass .scss files npm package _gulp-scss-lint_ and Ruby gem _scss-lint_.
 */
PluginExport.addStream('lint', function()
{
    var $config = ModulesConfig.scssLint;

    if (_.isUndefined($config.customReport))
    {
        $config.customReport = GulpScssLintStylish;
    }
    else if (!_.isFunction($config.customReport))
    {
        delete $config.customReport;
    }

    return GulpScssLint($config);
});

//------------------------------------------------------------------------------

/**
 * Compile with the compiler set in the config/env vars.
 *
 * @WIP - Force libsass for now.
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
 * Lint Sass with npm package _gulp-scss-lint_ and Ruby gem _scss-lint_.
 */
PluginExport.addTask('sass:lint', function($plugin)
{
    return Gulp.src($plugin.src('!' + Config.src.sass + '/maelstrom/*.scss'))
        .pipe( Maelstrom.plumber() )
        .pipe( $plugin.stream('lint') );
});

module.exports = PluginExport;
