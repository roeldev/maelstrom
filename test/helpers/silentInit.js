/**
 * maelstrom | test/helpers/silentInit.js
 */
'use strict';

const _              = require('lodash');
const Gulp           = require('gulp');
const LogInterceptor = require('log-interceptor');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

module.exports = function($maelstrom)
{
    return function silentInit($args, $breakSilence)
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

        $maelstrom.init.apply($maelstrom, $args);
        return LogInterceptor.end();
    };
}
