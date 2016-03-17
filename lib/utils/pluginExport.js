/**
 * maelstrom | utils/pluginExport.js
 *
 * - tests
 */
'use strict';

const Path = require('path');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

/**
 * Exports a stream from the plugin by creating a wrapper function wich
 * is added to maelstrom. When called, this function returns a valid
 * stream, wich can be used in your own custom gulp tasks.
 *
 * @param {object} $plugin
 * @return {function}
 */
module.exports = function pluginExport($plugin)
{
    // create a wrapper function wich directs all calls to the plugin's
    // stream method
    let $result = function($stream)
    {
        let $args = _.toArray(arguments);
        $args.shift();

        // initialize the plugin when not already done
        /*if (!$plugin.initialized)
        {
            $plugin.init();
        }*/

        return $plugin.stream($stream, $args, true);
    };

    // extend the wrapper function with functions/properties wich are
    // added to the plugin and are intended to be exposed
    for (let $key in $plugin.expose)
    {
        if ($plugin.expose.hasOwnProperty($key))
        {
            $result[$key] = $plugin.expose[$key];
        }
    }

    return $result;
}
