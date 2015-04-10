/**
 * maelstrom | lib/plugins/sass.js
 * file version: 0.00.009
 */
'use strict';

var _                   = require('underscore'),
    Maelstrom           = require('../index.js'),
    Config              = Maelstrom.config,
    ModulesConfig       = Maelstrom.config.modules,
    Utils               = require('../utils.js'),
    Plugin              = require('../plugin.js'),
    PluginExport        = new Plugin(__filename),
    Gulp                = Maelstrom.gulp,
    GulpAutoprefixer    = require('gulp-autoprefixer'),
    GulpMinifyCss       = require('gulp-minify-css'),
    GulpSass            = require('gulp-sass'),
    GulpScssLint        = require('gulp-scss-lint'),
    GulpScssLintStylish = require('gulp-scss-lint-stylish'),
    GulpSize            = require('gulp-size');

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
    return Gulp.src($plugin.src('!'+ Config.src.sass +'/maelstrom/*.scss'))
        .pipe( Maelstrom.plumber() )
        .pipe( $plugin.stream('lint') );
});

module.exports = PluginExport;
