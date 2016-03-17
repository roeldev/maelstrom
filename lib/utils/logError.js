/**
 * maelstrom | utils/logError.js
 *
 * - tests
 */
'use strict';

const _        = require('lodash');
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
    if (_.isArray($msg))
    {
        $msg = $msg.join(' ');
    }

    GulpUtil.log( GulpUtil.colors.red($msg) );

    if ($error instanceof Error)
    {
        GulpUtil.log( '  ' + $error.code + ': ' + $error.message );
    }
};
