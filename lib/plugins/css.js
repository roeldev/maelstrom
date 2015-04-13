/**
 * maelstrom | lib/plugins/css.js
 * file version: 0.00.001
 *
 * Streams:
 * - concat
 * - lint
 *
 * Tasks:
 * - css
 * - css:lint
 */
'use strict';

var Maelstrom        = require('../index.js'),
    Config           = Maelstrom.config,
    ModulesConfig    = Maelstrom.config.modules,
    Utils            = Maelstrom.utils,
    Plugin           = require('../plugin.js'),
    PluginExport     = new Plugin(__filename),
    _                = require('underscore'),
    Gulp             = Maelstrom.gulp,
    GulpAutoprefixer = require('gulp-autoprefixer'),
    GulpConcat       = require('gulp-concat'),
    GulpMinifyCss    = require('gulp-minify-css'),
    GulpSize         = require('gulp-size');

////////////////////////////////////////////////////////////////////////////////

/**
 * Return the location of the Sass source files.
 */
PluginExport.src = function($src)
{
    return Utils.extendArgs($src, Config.src.css +'/**/*.css');
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
 * Concatenate CSS files and further minify the result when not `--dev`.
 */
PluginExport.addStream('concat', function($destFile, $isProd)
{
    // make sure the dest filename has a js file extension
    if ($destFile.substr($destFile.length - 4) !== '.css')
    {
        $destFile += '.css';
    }

    return Utils.pipeStreams(
    [
        GulpConcat($destFile),
        GulpAutoprefixer(ModulesConfig.autoprefixer),
        Utils.pipeWhenProd(GulpMinifyCss(), $isProd)
    ]);
});

PluginExport.addStream('lint', function()
{
});

//------------------------------------------------------------------------------

PluginExport.addTask('css', function($plugin)
{
    var $collections = Config.cssConcat;
    if (!_.isEmpty($collections))
    {
        for(var $destFile in $collections)
        {
            if (!$collections.hasOwnProperty($destFile))
            {
                continue;
            }

            Gulp.src($collections[$destFile])
                .pipe( $plugin.stream('concat', [$destFile]) )
                .pipe( GulpSize(ModulesConfig.size) )
                .pipe( Gulp.dest($plugin.dest()) );
        }
    }
});

/**
 * Lint CSS with npm package _gulp-csslint_.
 */
PluginExport.addTask('css:lint', function($plugin)
{
    return Gulp.src($plugin.src())
        .pipe( Maelstrom.plumber() )
        .pipe( $plugin.stream('lint') );
});

module.exports = PluginExport;
