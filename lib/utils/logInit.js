/**
 * maelstrom | utils/logInit.js
 */
'use strict';

const GulpUtil = require('gulp-util');
const Package  = require('../../package.json');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

/**
 * Displays a simple log when maelstrom is initialized.
 */
module.exports = function logInit()
{
    GulpUtil.log(
        'Init maelstrom',
        GulpUtil.colors.grey('(v' + Package.version + ')')
    );
};
