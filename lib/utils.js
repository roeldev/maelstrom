/**
 * maelstrom | lib/utils.js
 */
'use strict';

const _        = require('lodash');
const GulpUtil = require('gulp-util');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

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
