/**
 * maelstrom | lib/plugins/rubysass.js
 * file version: 0.00.001
 */
'use strict';

var Maelstrom        = require('../index.js'),
    Config           = Maelstrom.config,
    Utils            = Maelstrom.utils,
    GulpAutoprefixer = require('gulp-autoprefixer'),
    GulpMinifyCss    = require('gulp-minify-css'),
    Through          = require('through2');

//------------------------------------------------------------------------------

module.exports = function()
{
    console.log('Ruby Sass compiler not yet supported!');
    return Through.obj();
};

module.exports.src  = Utils.src(Config.src.sass +'/**/*.{sass,scss}');
module.exports.dest = Utils.dest(Config.dest.css);
