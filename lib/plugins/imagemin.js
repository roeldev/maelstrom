/**
 * maelstrom | lib/plugins/images.js
 * file version: 0.00.001
 */
'use strict';

var Maelstrom    = require('../index.js'),
    Config       = Maelstrom.config,
    Utils        = Maelstrom.utils,
    GulpImageMin = require('gulp-imagemin');

//------------------------------------------------------------------------------

module.exports = function()
{
    return GulpImageMin(Config.images.imagemin);
};

module.exports.src  = Utils.src(Config.src.images +'/**/*.{'+ Config.images.extensions.join(',') +'}');
module.exports.dest = Utils.dest(Config.dest.images);
