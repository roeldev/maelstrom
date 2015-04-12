/**
 * maelstrom | lib/plugins/images.js
 * file version: 0.01.000
 *
 * Streams:
 * ✓ optimize
 * - resize*
 *
 * Tasks:
 * ✓ images
 */
'use strict';

var Maelstrom     = require('../index.js'),
    Plugin        = require('../plugin.js'),
    PluginExport  = new Plugin(__filename),
    Config        = Maelstrom.config,
    ModulesConfig = Maelstrom.config.modules,
    Gulp          = Maelstrom.gulp,
    GulpChanged   = require('gulp-changed'),
    GulpIf        = require('gulp-if'),
    GulpImageMin  = require('gulp-imagemin'),
    GulpSize      = require('gulp-size'),
    GulpUtil      = require('gulp-util');

////////////////////////////////////////////////////////////////////////////////

// return location of raw, unoptimized images
PluginExport.src = function()
{
    return Config.src.images +'/**/*.{'+ Config.imageExtensions.join(',') +'}';
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

// return a piped stream wich resizes images
PluginExport.addStream('resize', function()
{
    return false;
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
        .pipe( Gulp.dest($plugin.dest()) )
        .pipe( Maelstrom.browserSync() );
});

module.exports = PluginExport;
