/**
 * maelstrom | lib/plugins/css.js
 * file version: 0.01.000
 *
 * Streams:
 * ✓ css (autoprefix + minify)
 * ✓ concat
 * - lint
 *
 * Tasks:
 * ✓ css
 * - css:lint
 */
'use strict';

var Maelstrom        = require('../index.js');
var Config           = Maelstrom.config;
var ModulesConfig    = Maelstrom.config.modules;
var Utils            = Maelstrom.utils;
var Plugin           = require('../plugin.js');
var PluginExport     = new Plugin(__filename);

var _                = require('underscore');
var Gulp             = Maelstrom.gulp;
var GulpAutoprefixer = require('gulp-autoprefixer');
var GulpConcat       = require('gulp-concat');
var GulpMinifyCss    = require('gulp-minify-css');
var GulpSize         = require('gulp-size');

////////////////////////////////////////////////////////////////////////////////

/**
 * Return the location of the Sass source files.
 */
PluginExport.src = function($src)
{
    return Utils.extendArgs($src, Config.src.css + '/**/*.css');
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
 * Autoprefix and further minify the result when not `--dev`.
 */
PluginExport.addStream('css', function($isProd)
{
    return Utils.pipeStreams(
    [
        GulpAutoprefixer(ModulesConfig.autoprefixer),
        Utils.pipeWhenProd(GulpMinifyCss(), $isProd)
    ]);
});

/**
 * Concatenate CSS files, autoprefix and minify the result when not `--dev`.
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

//------------------------------------------------------------------------------

PluginExport.addTask('css', function($plugin)
{
    var $collections = Config.cssConcat;

    if (!_.isEmpty($collections))
    {
        for (var $destFile in $collections)
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

module.exports = PluginExport;
