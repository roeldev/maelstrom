/**
 * Maelstrom | lib/plugins/test.js
 * file version: 0.00.002
 */
'use strict';

var Maelstrom     = require('../index.js'),
    Config        = Maelstrom.config,
    Utils         = Maelstrom.utils,

    GulpMinifyCss = require('gulp-minify-css');

//------------------------------------------------------------------------------

module.exports = function()
{
    return GulpMinifyCss();
};

module.exports._name = 'testCss';
module.exports.src   = Utils.src(Config.src.css +'/**/*.css');
module.exports.dest  = Utils.dest(Config.dest.css);
