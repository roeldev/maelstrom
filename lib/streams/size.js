/**
 * maelstrom | lib/streams/size.js
 */
'use strict';

var GulpSize = require('gulp-size');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

module.exports = function()
{
    const self = this; // maelstrom object

    return function()
    {
        return GulpSize(self.config.main.size);
    };
};
