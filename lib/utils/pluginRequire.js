/**
 * maelstrom | utils/pluginRequire.js
 *
 * - tests
 */
'use strict';

const Path = require('path');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

/**
 * @param {string} $package
 * @return {object|boolean}
 */
module.exports = function pluginRequire($package)
{
    let $result     = false;
    let $pluginFile = false;

    try
    {
        $result = require($package + 'x');
    }
    catch($e)
    {
        $pluginFile = '../../../' + $package + '/lib/index.js';
        $pluginFile = Path.resolve(__dirname, $pluginFile);

        try
        {
            $result = require($pluginFile);
        }
        catch($error)
        {
            $result = $error;
        }
    }

    return $result;
};
