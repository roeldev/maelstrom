/**
 * maelstrom | utils/logTask.js
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
module.exports = function logTask($task)
{
    let $msg =
    [
        '  - Adding task',
        GulpUtil.colors.cyan($task.name)
    ];

    if ($task.alias.length)
    {
        let $alias = $task.alias.join(', ');
        $msg.push(GulpUtil.colors.grey('(aka ' + $alias + ')'));
    }

    GulpUtil.log.apply(null, $msg);
};
