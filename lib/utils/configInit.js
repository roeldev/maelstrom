/**
 * maelstrom | utils/configInit.js
 */
'use strict';

const _        = require('lodash');
const Confirge = require('confirge');
const DotEnv   = require('dotenv');

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

    let $extraConfigVars    = {};
    let $hasExtraConfigVars = false;

    // add all src paths to the config vars
    if (!!$config.src)
    {
        $extraConfigVars.src = $config.src;
        $hasExtraConfigVars  = true;
    }

    // add all the dest paths to the config vars
    if (!!$config.dest)
    {
        $extraConfigVars.dest = $config.dest;
        $hasExtraConfigVars   = true;
    }

    // add optional .env vars to the config vars
    let $dotenv = DotEnv.config({ 'silent': true });
    if ($dotenv)
    {
        $extraConfigVars.dotenv = $dotenv;
        $hasExtraConfigVars     = true;
    }

    // extend the existing config vars (set in config files or a custom config
    // object) with some extra vars
    if ($hasExtraConfigVars)
    {
        $config.vars = Confirge.extend($config.vars, $extraConfigVars);
    }

    // check all config options/values and apply vars where needed
    $config = Confirge.replace($config, $config.vars);

    return $config;
};
