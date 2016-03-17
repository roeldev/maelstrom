/**
 * maelstrom | utils/checkValidMode.js
 *
 * ✓ tests
 */
'use strict';

const _        = require('lodash');
const GulpUtil = require('gulp-util');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

/**
 * Check wheter the given mode is set as an env variable.
 *
 * @param {string} $mode - The mode to check.
 * @return {boolean}
 */
module.exports = function checkValidMode($mode)
{
    let $result = false;

    if (!_.isUndefined(GulpUtil.env[$mode]))
    {
        $result = (GulpUtil.env[$mode] === true);
    }

    return $result;
};
