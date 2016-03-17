/**
 * maelstrom | test/helpers/silentInit.js
 */
'use strict';

const _              = require('lodash');
const Gulp           = require('gulp');
const LogInterceptor = require('log-interceptor');
const Maelstrom      = require('../../lib/index.js');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

module.exports = function silentInit($args, $breakSilence)
{
    if (!_.isArray($args))
    {
        $args = [];
    }

    $args.unshift(Gulp);

    LogInterceptor(
    {
        'passDown':         ($breakSilence === true),
        'stripColor':       false,
        'trimTimestamp':    false,
        'trimLinebreak':    false,
        'splitOnLinebreak': false
    });

    Maelstrom.init.apply(Maelstrom, $args);
    return LogInterceptor.end();
};
