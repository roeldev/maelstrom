/**
 * maelstrom | utils/checkGulpInstance.js
 */
'use strict';

const _ = require('underscore');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

/**
 * Basic check if the passed argument is actually gulp.
 *
 * @param {object} $obj
 * @return {boolean}
 */
module.exports = function checkGulpInstance($obj)
{
    let $result = false;
    if (!_.isEmpty($obj) && $obj.constructor)
    {
        let $constructor = $obj.constructor.toString();
        let $instance    = 'function Gulp(';

        $constructor = $constructor.substr(0, $instance.length);
        $result      = ($constructor === $instance);
    }

    return $result;
};
