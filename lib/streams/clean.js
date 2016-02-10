/**
 * maelstrom | lib/streams/clean.js
 */
'use strict';

var Del = require('del');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

module.exports = function()
{
    return function($dir)
    {
        return Del.sync([$dir + '/**', '!' + $dir]);
    };
};
