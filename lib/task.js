/**
 * maelstrom | lib/task.js
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

module.exports = class
{
    constructor($plugin, $name, $type, $task)
    {
        /**
         * A reference to the plugin where the task belongs to.
         *
         * @type {object}
         */
        // this.plugin = $plugin;

        /**
         * The name of the task as it will be added to gulp.
         *
         * @type {string}
         */
        this.name = taskName($plugin.name, $name);

        /**
         * An array with aliasses of the task names according to the aliasses
         * of the plugin the task belongs to.
         *
         * @type {array}
         */
        this.alias = [];

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

        // create the alias names
        for (let $i = 0, $iL = $plugin.alias.length; $i < $iL; $i++)
        {
            let $alias = $plugin.alias[$i];
            this.alias.push( taskName($alias, $name) );
        }
    }

    /*get export()
    {
        if (!this._export)
        {
            let self = this;

            this._export = function()
            {
                let $args = _.toArray(arguments);
                // $args.unshift($plugin);

                return function()
                {
                    return self.task.apply(null, $args);
                };
            };
        }

        return this._export;
    }*/

    export2($args)
    {
        let self = this;
        return function()
        {
            return self.task.apply(null, $args);
        };
    }
};
