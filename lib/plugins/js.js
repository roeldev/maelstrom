/**
 * maelstrom | lib/plugins/js.js
 * file version: 0.00.001
 */
'use strict';

var Maelstrom        = require('../index.js'),
    Plugin           = require('../plugin.js'),
    PluginExport     = new Plugin(__filename),
    Config           = Maelstrom.config,
    ModulesConfig    = Maelstrom.config.modules,
    Utils            = Maelstrom.utils,
    Gulp             = Maelstrom.gulp;

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

// concat js files
PluginExport.addStream('concat', function()
{

});

//------------------------------------------------------------------------------

// lint + concat /assets/js files
PluginExport.addTask('js', function($plugin)
{
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

});

module.exports = PluginExport;
