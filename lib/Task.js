/**
 * maelstrom | lib/Task.js
 */
'use strict';

const _ = require('lodash');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

function taskName($pluginName, $taskName)
{
    return (($taskName === 'default') ?
             $pluginName :
             $pluginName + ':' + $taskName);
}

// -----------------------------------------------------------------------------

module.exports = class Task
{
    /**
     * @param {object} $plugin
     * @param {string} $name
     * @param {array} $type
     * @param {function} $task
     */
    constructor($plugin, $name, $type, $task)
    {
        /**
         * A reference to the plugin where the task belongs to.
         *
         * @type {object}
         */
        this.plugin = $plugin;

        /**
         * The name of the task as it will be added to gulp.
         *
         * @type {string}
         */
        this.name = taskName($plugin.name, $name);

        /**
         * An array with aliases of the task names according to the aliases of
         * the plugin the task belongs to.
         *
         * @type {array}
         */
        this.aliases = [];

        /**
         * An array with task group types.
         * @type {array}
         */
        this.type = $type;

        /**
         * The actual task wich is added to gulp.
         * @type {function}
         */
        this.task = $task;

        // create the aliases names
        for (let $i = 0, $iL = $plugin.aliases.length; $i < $iL; $i++)
        {
            let $aliases = $plugin.aliases[$i];
            this.aliases.push( taskName($aliases, $name) );
        }
    }

    /**
     * Creates an exporter function wich is used to add the task to gulp.
     *
     * @param {array} $args - An array with args wich are passed to the task.
     * @return {function}
     */
    export($args)
    {
        let self = this;
        return function()
        {
            return self.task.apply(null, $args);
        };
    }
};
