/**
 * maelstrom | lib/tasks/watch.js
 */
'use strict';

// // // // // // // // // // // // // // // // // // // // // // // // // // //

module.exports = function($dir)
{
    let $tasks = _tasksGrouped[TASK_WATCH];
    for (let $taskName in $tasks)
    {
        if ($tasks.hasOwnProperty($taskName))
        {
            this.watchTask($taskName);
        }
    }
};
