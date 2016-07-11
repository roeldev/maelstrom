/**
 * maelstrom | lib/Task.js
 *
 * - tests
 */
'use strict';

const _    = require('lodash');
const Path = require('path');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

module.exports = class Task
{
    _createName($pluginName, $taskName)
    {
        return (($taskName === 'default') ?
                 $pluginName :
                 $pluginName + ':' + $taskName);
    }

    // -------------------------------------------------------------------------

    /**
     * @param {object} $plugin
     * @param {string} $name
     * @param {array} $type
     * @param {function} $task
     */
    constructor($plugin, $file, $name, $type, $task)
    {
        // var $debug = ($plugin.package.name == 'maelstrom-js');
        // if ($debug)
        // {
        //     console.log('new task');
        //     // console.log(arguments)
        // }

        // create a name from the file path
        if ($file && !$name)
        {
            $name = Path.basename($file, '.js');
            $file = Path.resolve(Path.dirname($plugin.file), $file);
            $task = require($file)($plugin, $plugin.maelstrom);
        }

        /**
         * A reference to the plugin where the task belongs to.
         *
         * @type {object}
         */
        this.plugin = $plugin;

        /**
         * An optional file to load the task from on runtime.
         *
         * @type {string}
         */
        this.file = $file;

        /**
         * The id/basename of the task.
         *
         * @type {string}
         */
        this.id = $name;

        /**
         * The name of the task as it will be added to gulp.
         *
         * @type {string}
         */
        this.name = this._createName($plugin.name, $name);

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
            let $alias = $plugin.aliases[$i];
            this.aliases.push( this._createName($alias, $name) );
        }

        // if ($debug)
        // {
        //     console.log(this);
        // }
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
        let $bindArgs = [this];

        // add the thisArg to the beginning of the args array. this args array
        // is applied to the bind function so that the passed $args are
        // always available in the task function.
        if (_.isArray($args))
        {
            $bindArgs = $args;
            $bindArgs.unshift(this);
        }

        // if (this.file && !this.task)
        // {
        //     this.task = function()
        //     {
        //         let $task = require(self.file).bind.apply(self, $args);
        //         self.task = $task;

        //         return $task.apply(self, $args);
        //     };
        // }

        return function()
        {
            return self.task.apply(self, $args);
        };
    }
};
