/**
 * maelstrom | lib/plugins/images.js
 * file version: 0.01.003
 *
 * Streams:
 * ✓ optimize
 * - resize*
 *
 * Tasks:
 * ✓ images
 */
'use strict';

var Maelstrom     = require('../index.js');
var Config        = Maelstrom.config;
var ModulesConfig = Maelstrom.config.modules;
var Utils         = Maelstrom.utils;
var Plugin        = require('../plugin.js');
var PluginExport  = new Plugin(__filename);

var Gulp          = Maelstrom.gulp;
var GulpChanged   = require('gulp-changed');
var GulpIf        = require('gulp-if');
var GulpImageMin  = require('gulp-imagemin');
var GulpSize      = require('gulp-size');
var GulpUtil      = require('gulp-util');

////////////////////////////////////////////////////////////////////////////////

// return location of raw, unoptimized images
PluginExport.src = function($src)
{
    var $ext = Config.imageExtensions.join(',');
    return Utils.extendArgs($src, Config.src.images + '/**/*.{' + $ext + '}');
};

// return location of the images output folder
PluginExport.dest = function()
{
    return Config.dest.images;
};

//------------------------------------------------------------------------------

// return a stream from imagemin
PluginExport.addStream('optimize', function()
{
    return GulpImageMin(ModulesConfig.imagemin);
});

//------------------------------------------------------------------------------

// gulp images task
PluginExport.addTask('images', function($plugin)
{
    // loop through resize tasks and resize the matching images according
    // to config settings

    // when the --all flag is used, do not filter for last changed images, but
    // update all images
    var $changedFilesOnly = (GulpUtil.env.all !== true);

    return Gulp.src($plugin.src())
        .pipe( Maelstrom.plumber() )
        .pipe( GulpIf($changedFilesOnly, GulpChanged( $plugin.dest() )) )
        .pipe( $plugin.stream('optimize') )
        .pipe( GulpSize(ModulesConfig.size) )
        .pipe( Gulp.dest($plugin.dest()) );
});

module.exports = PluginExport;
