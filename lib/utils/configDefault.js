/**
 * maelstrom | utils/configDefault.js
 */
'use strict';

const _        = require('underscore');
const Confirge = require('confirge');
const Path     = require('path');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

/**
 * Reads the default config file, parses it and returns an object with all
 * default config settings.
 *
 * @param {string} $configFile
 * @return {object}
 */
module.exports = function configDefault($configFile)
{
    // make the path to the config file relative to the package root dir
    let $rootDir = Path.dirname(Path.dirname(__dirname));
    $configFile  = Path.resolve($rootDir, $configFile);

    // read the config file
    let $config = Confirge($configFile);

    // replace default vars (dir paths)
    $config.vars = Confirge.replace($config.vars,
    {
        'root': $rootDir
    });

    // add src and dest paths as vars
    $config = Confirge.extend($config,
    {
        'vars':
        {
            'src':  $config.src,
            'dest': $config.dest
        }
    });

    return $config;
};
