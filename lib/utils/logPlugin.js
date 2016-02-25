/**
 * maelstrom | utils/logPlugin.js
 */
'use strict';

const GulpUtil = require('gulp-util');
const Tildify  = require('tildify');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

/**
 * Displays a simple log when a new plugin is loaded.
 *
 * @param {object} $plugin - The plugin that is loaded.
 */
module.exports = function logPlugin($plugin)
{
    GulpUtil.log.apply(null,
    [
        '- Loading plugin',
        GulpUtil.colors.cyan($plugin.package.name),
        GulpUtil.colors.grey('(' + $plugin.package.version + ')'),
        'from',
        GulpUtil.colors.magenta( Tildify($plugin.file) )
    ]);
};
