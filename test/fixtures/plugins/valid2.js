/**
 * maelstrom | test/fixtures/plugins/valid2.js
 * file version: 0.00.001
 */
'use strict';

var Maelstrom    = require('../../../lib/index.js');
var Plugin       = require('../../../lib/plugin.js');
var PluginExport = new Plugin(__filename);
var _            = require('underscore');
var Through      = require('through2');

////////////////////////////////////////////////////////////////////////////////

PluginExport.src = function()
{
    return 'path/to/*.src';
};

//------------------------------------------------------------------------------

PluginExport.addStream('through', function()
{
    return Through.obj();
});

//------------------------------------------------------------------------------

PluginExport.addTask('through', function($plugin)
{
    return $plugin.stream('through');
});

module.exports = PluginExport;
