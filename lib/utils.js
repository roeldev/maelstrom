/**
 * maelstrom | lib/utils.js
 */
'use strict';

const _        = require('underscore');
const GulpUtil = require('gulp-util');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

/**
 * Check wheter the given mode is set as an env variable.
 *
 * @param {string} $mode - The mode to check.
 * @return {boolean}
 */
function checkValidMode($mode)
{
    let $result = false;

    if (!_.isUndefined(GulpUtil.env[$mode]))
    {
        $result = (GulpUtil.env[$mode] === true);
    }

    return $result;
}

// -----------------------------------------------------------------------------

module.exports = function($maelstrom)
{
    return new (class
    {
        /**
         * Empty function.
         */
        noop()
        {
        }

        isPlugin($plugin)
        {
            return ($plugin instanceof $maelstrom.Plugin);
        }

        /**
         * Returns `true` if gulp is run with the `--dev` flag and `prod` is not
         * the default active mode.
         *
         * @return {boolean}
         */
        isDev()
        {
            let $mode   = 'dev';
            let $isDev  = checkValidMode('dev');
            let $isProd = checkValidMode('prod');

            // when both are set, or both are not set, always default to config
            if ($isDev === $isProd)
            {
                $mode = $maelstrom.config.defaultMode;
            }
            else if ($isProd)
            {
                $mode = 'prod';
            }

            return ($mode === 'dev');
        };

        /**
         * Returns `true` if gulp is run with the `--prod` flag and `dev` is not
         * the default active mode.
         *
         * @return {boolean}
         */
        isProd()
        {
            return !this.isDev();
        }

        /**
         * Returns `true` if gulp is run with the `--verbose` flag or if the
         * `verbose` config option in equals `true`.
         *
         * @return {boolean}
         */
        isVerbose()
        {
            let $default = ($maelstrom.config.verbose === true);
            let $env     = GulpUtil.env.verbose;

            return (_.isUndefined($env) ? $default : ($env === true));
        }

        /**
         * Extends an argument or aguments array with a given default value. This
         * default value is shifted to the front of the array.
         *
         * @param {mixed} $args
         * @param {mixed} $default
         * @return {array} An arguments array.
         */
        extendArgs($args, $default)
        {
            let $result = [];

            if (_.isArray($default))
            {
                $result = $default;

                if (_.isArray($args))
                {
                    $result = $default.concat($args);
                }
                else if (!_.isEmpty($args))
                {
                    $result.push($args);
                }
            }
            else if (_.isArray($args))
            {
                $result = $args;
                if (!_.isEmpty($default))
                {
                    $result.unshift($default);
                }
            }
            else
            {
                if (!_.isEmpty($default))
                {
                    $result.push($default);
                }

                if (!_.isEmpty($args))
                {
                    $result.push($args);
                }
            }

            return $result;
        }
    })();
};
