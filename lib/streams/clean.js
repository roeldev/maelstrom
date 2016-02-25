/**
 * maelstrom | lib/streams/clean.js
 */
'use strict';

var Del = require('del');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

module.exports = function($dir)
{
    return Del.sync([$dir + '/**', '!' + $dir]);
};
