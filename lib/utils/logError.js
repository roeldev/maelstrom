/**
 * maelstrom | utils/logError.js
 */
'use strict';

const GulpUtil = require('gulp-util');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

/**
 * Displays a simple log when an error has occured.
 *
 * @param {string} $msg - The error message.
 * @param {object} $error [undefined] - An optional Error object.
 */
module.exports = function logError($msg, $error)
{
    GulpUtil.log( GulpUtil.colors.red($msg) );

    if ($error instanceof Error)
    {
        console.log($error);
    }
};
