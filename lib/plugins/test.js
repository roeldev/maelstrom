/**
 * Maelstrom | lib/plugins/test.js
 * file version: 0.00.001
 */
'use strict';

var Maelstrom     = require('../index.js'),
    Config        = Maelstrom.config,
    Utils         = Maelstrom.utils,

    GulpMinifyCss = require('gulp-minify-css');

//------------------------------------------------------------------------------

module.exports = Utils.createPlugin('cssTest',
{
    'src': function()
    {
        return Config.src.css +'/**/*.css';
    },

    'dest': function()
    {
        return Config.dest.css;
    },

    'stream': function()
    {
        return GulpMinifyCss();
    }
});
