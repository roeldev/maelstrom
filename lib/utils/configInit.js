/**
 * maelstrom | utils/configInit.js
 */
'use strict';

const _        = require('underscore');
const Confirge = require('confirge');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

/**
 * Returns a config object from the combined available sources in this order:
 * - default maelstrom config
 * - maelstrom file (eg. `.maelstrom.yml`, depends on config setting)
 * - config object passed through `maelstrom.init()`
 * - optional config file, set as `config` key in above object
 *
 * This means that the object passed through `maelstrom.init()` will always
 * override any settings already set by any of the other config sources.
 *
 * @param {object} $config - The basic default config object
 * @param {object} $customConfig [undefined] - An optional custom config object
 * @return {object}
 */
module.exports = function configInit($config, $customConfig)
{
    let $configs               = [$config];
    let $fromDefaultConfigFile = Confirge.read($config.configFile);

    if (!_.isEmpty($fromDefaultConfigFile))
    {
        $configs.push($fromDefaultConfigFile);
    }

    if (!_.isEmpty($customConfig))
    {
        $configs.push($customConfig);

        if (!_.isUndefined($customConfig.configFile))
        {
            let $fromCustomConfigFile = Confirge.read($customConfig.configFile);

            if (!_.isEmpty($fromCustomConfigFile))
            {
                $configs.push($fromCustomConfigFile);
            }
        }
    }

    // extend the default config with the settings from the overruling configs
    $config = Confirge.extend.apply($config, $configs);

    let $srcVars    = {};
    let $hasSrcVars = false;

    if (!!$config.src)
    {
        $srcVars.src = $config.src;
        $hasSrcVars  = true;
    }

    if (!!$config.dest)
    {
        $srcVars.dest = $config.dest;
        $hasSrcVars  = true;
    }

    if ($hasSrcVars)
    {
        $config.vars = Confirge.extend($config.vars, $srcVars);
    }

    $config = Confirge.replace($config, $config.vars);

    return $config;
};
