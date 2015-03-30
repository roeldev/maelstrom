/**
 * maelstrom | lib/plugins/browserSync.js
 * file version: 0.00.001
 */
'use strict';

var Maelstrom     = require('../index.js'),
    Config        = Maelstrom.config,
    ModulesConfig = Maelstrom.config.modules,
    Utils         = Maelstrom.utils,
    Gulp          = Maelstrom.gulp,
    BrowserSync   = require('browser-sync'),
    PluginExport;

////////////////////////////////////////////////////////////////////////////////

PluginExport = function()
{
    return BrowserSync.reload({ 'stream': true })
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
