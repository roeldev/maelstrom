/**
 * maelstrom | test/fixtures/plugins/valid.js
 * file version: 0.00.003
 */
'use strict';

var Maelstrom    = require('../../../lib/index.js');
var Plugin       = require('../../../lib/plugin.js');
var PluginExport = new Plugin(__filename);
var _            = require('underscore');
var GulpPlumber  = require('gulp-plumber');

////////////////////////////////////////////////////////////////////////////////

PluginExport.isValidTest = function()
{
    return true;
};

//------------------------------------------------------------------------------

PluginExport.addStream('plumber', function()
{
    return GulpPlumber();
});

PluginExport.addStream('argsTest', function()
{
    return _.toArray(arguments);
});

//------------------------------------------------------------------------------

PluginExport.addTask('plumber', function($plugin)
{
    return $plugin.stream('plumber');
});

PluginExport.addTask('argsTest', function()
{
    return _.toArray(arguments);
});

module.exports = PluginExport;
