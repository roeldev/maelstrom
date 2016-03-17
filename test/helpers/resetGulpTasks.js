/**
 * maelstrom | test/helpers/resetGulpTasks.js
 */
'use strict';

const Maelstrom = require('../../lib/index.js');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

module.exports = function resetGulpTasks()
{
    for (let $taskName in Maelstrom._tasks)
    {
        if (Maelstrom._tasks.hasOwnProperty($taskName))
        {
            delete Maelstrom.gulp.tasks[$taskName];
        }
    }
};
