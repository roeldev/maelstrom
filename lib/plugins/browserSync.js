/**
 * maelstrom | lib/plugins/browserSync.js
 * file version: 0.01.001
 */
'use strict';

var Maelstrom     = require('../index.js');
var Config        = Maelstrom.config;
var ModulesConfig = Maelstrom.config.modules;

var Gulp          = Maelstrom.gulp;
var BrowserSync   = require('browser-sync');

////////////////////////////////////////////////////////////////////////////////

var PluginExport = function()
{
    return BrowserSync.reload({ 'stream': true });
};

PluginExport.start = function()
{
    var $options = ModulesConfig.browserSync;
    $options.files = Config.browserSyncWatch;

    return BrowserSync($options);
};

PluginExport.watch = function()
{
    return Gulp.watch(Config.browserSyncWatch)
        .on('change', BrowserSync.reload);
};

module.exports = PluginExport;
