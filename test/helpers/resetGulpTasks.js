/**
 * maelstrom | test/helpers/resetGulpTasks.js
 */
'use strict';

// // // // // // // // // // // // // // // // // // // // // // // // // // //

module.exports = function($maelstrom)
{
    return function resetGulpTasks()
    {
        for (let $taskName in $maelstrom._tasks)
        {
            if ($maelstrom._tasks.hasOwnProperty($taskName))
            {
                delete $maelstrom.gulp.tasks[$taskName];
            }
        }
    };
};
