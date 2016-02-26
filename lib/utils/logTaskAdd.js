/**
 * maelstrom | utils/logTaskAdd.js
 */
'use strict';

const GulpUtil = require('gulp-util');
const Tildify  = require('tildify');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

/**
 * Displays a simple log when a new task is added to gulp.
 *
 * @param {object} $task - The Task object that is added
 */
module.exports = function logTaskAdd($task)
{
    let $msg =
    [
        '  - Adding task',
        GulpUtil.colors.cyan($task.name)
    ];

    if ($task.aliases.length)
    {
        let $aliases = $task.aliases.join(', ');
        $msg.push(GulpUtil.colors.grey('(aka ' + $aliases + ')'));
    }

    GulpUtil.log.apply(null, $msg);
};
