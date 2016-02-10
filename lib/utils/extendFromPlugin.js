/**
 * maelstrom | utils/extendFromPlugin.js
 */
'use strict';

// // // // // // // // // // // // // // // // // // // // // // // // // // //

module.exports = function($plugin)
{
    this._plugins[$plugin.name] = $plugin;

    // add the exposed streamer function to maelstrom
    let $result = this[$plugin.name] = $plugin.exportStreamer();

    // add aliases for the exposed streamer function
    /*for (let $i = 0, $iL = $plugin.alias.length; $i < $iL; $i++)
    {
        this[$plugin.alias[$i]] = $result;
    }*/

    // add all tasks
    for (let $taskName in $plugin.tasks)
    {
        if ($plugin.tasks.hasOwnProperty($taskName))
        {
            let $task = this._tasks[$taskName] = $plugin.exportTask($taskName);
            this.task($taskName);

            // add aliases for the tasks
            /*for (let $i = 0, $iL = $plugin.alias.length; $i < $iL; $i++)
            {
                let $alias = $plugin.alias[$i];
                $alias = $taskName.replace($plugin.name, $alias);

                this._tasks[$alias] = $task;
                this.task($alias);
            }*/
        }
    }

    return $result;
};
