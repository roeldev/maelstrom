/**
 * maelstrom | lib/plugins/js.js
 * file version: 0.00.002
 */
'use strict';

var _             = require('underscore'),
    Maelstrom     = require('../index.js'),
    Config        = Maelstrom.config,
    ModulesConfig = Maelstrom.config.modules,
    Utils         = require('../utils.js'),
    Plugin        = require('../plugin.js'),
    PluginExport  = new Plugin(__filename),
    Gulp          = Maelstrom.gulp,
    GulpConcat    = require('gulp-concat'),
    GulpSize      = require('gulp-size');

////////////////////////////////////////////////////////////////////////////////

// return location of js source files
PluginExport.src = function()
{
    return Config.src.js +'/**/*.js';
};

// return location of js output folder
PluginExport.dest = function()
{
    return Config.dest.js;
};

//------------------------------------------------------------------------------

// default action in /assets
PluginExport.addStream('default', function()
{

});

// lint js files
PluginExport.addStream('lint', function()
{

});

//------------------------------------------------------------------------------

// lint + concat /assets/js files
PluginExport.addTask('js', function($plugin)
{
    console.log($plugin, ModulesConfig, Utils);
});

// lint files set in config
PluginExport.addTask('js:lint', function($plugin)
{
    return Gulp.src($plugin.src())
        .pipe( Maelstrom.plumber() )
        .pipe( $plugin.stream('lint') );
});

// concat files set in config
PluginExport.addTask('js:concat', function($plugin)
{
    var $collections = Config.jsConcat,
        $src;

    if (!_.isEmpty($collections))
    {
        for(var $destFile in $collections)
        {
            if (!$collections.hasOwnProperty($destFile))
            {
                continue;
            }

            $src = $collections[$destFile];

            // make sure the dest filename has a js file extension
            if ($destFile.substr($destFile.length - 3) !== '.js')
            {
                $destFile += '.js';
            }

            Gulp.src($src)
                .pipe( GulpConcat($destFile) )
                .pipe( GulpSize(ModulesConfig.size) )
                .pipe( Gulp.dest($plugin.dest()) );
        }
    }
});

module.exports = PluginExport;
