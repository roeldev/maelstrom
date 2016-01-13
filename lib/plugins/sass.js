/**
 * maelstrom | lib/plugins/sass.js
 * file version: 0.01.003
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

var Maelstrom    = require('../index.js');
var Config       = Maelstrom.config;
var Utils        = Maelstrom.utils;
var Plugin       = require('../plugin.js');
var PluginExport = new Plugin(__filename);

var _                   = require('underscore');
var Gulp                = Maelstrom.gulp;
var GulpAutoprefixer    = require('gulp-autoprefixer');
var GulpCssNano         = require('gulp-cssnano');
var GulpIf              = require('gulp-if');
var GulpSass            = require('gulp-sass');
var GulpScssLint        = require('gulp-scss-lint');
var GulpScssLintStylish = require('gulp-scss-lint-stylish');
var GulpSize            = require('gulp-size');
var GulpSourceMaps      = require('gulp-sourcemaps');

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
 * Compile Sass with _gulp-sass_ (_Libsass_).
 */
PluginExport.addStream('libsass', function()
{
    return GulpSass(Config.sass.libsass).on('error', GulpSass.logError);
});

/**
 * Lint Sass .scss files npm package _gulp-scss-lint_ and Ruby gem _scss-lint_.
 */
PluginExport.addStream('lint', function()
{
    var $config = Config.sass.scssLint;

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
    var $compiler = Config.sass.compiler;

    // force libsass for now
    $compiler = 'libsass';

    var $configAutoprefixer = Config.sass.autoprefixer;
    if (_.isUndefined($configAutoprefixer))
    {
        $configAutoprefixer = Config.css.autoprefixer;
    }

    var $createSourceMaps = (Config.sass.sourcemaps !== false);

    return Gulp.src($plugin.src())
        .pipe( Maelstrom.plumber() )
        .pipe( GulpIf((Utils.isDev() && $createSourceMaps),
                      GulpSourceMaps.init()) )
        .pipe( $plugin.stream($compiler) )
        .pipe( GulpAutoprefixer($configAutoprefixer) )
        .pipe( GulpIf(Utils.isProd(), GulpCssNano()) )
        .pipe( GulpIf((Utils.isDev() && $createSourceMaps),
                      GulpSourceMaps.write()) )
        .pipe( GulpSize(Config.main.size) )
        .pipe( Gulp.dest($plugin.dest()) );
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
