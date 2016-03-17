/**
 * maelstrom | utils/logTaskWatch.js
 *
 * - tests
 */
'use strict';

const GulpUtil = require('gulp-util');
const Tildify  = require('tildify');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

/**
 * Displays a simple log when a task is added to `gulp.watch`.
 *
 * @param {object} $task - The Task object that is added
 */
module.exports = function logTaskWatch($task)
{
    GulpUtil.log.apply(null,
    [
        '  - Watching task',
        GulpUtil.colors.cyan($task.name)
    ]);
};
