/**
 * maelstrom | lib/init.js
 * file version: 0.00.011
 */
'use strict';

var _          = require('underscore');
var Confirge   = require('confirge');
var FileSystem = require('graceful-fs');
var GulpUtil   = require('gulp-util');
var Chalk      = GulpUtil.colors;
var Plugin     = require('./plugin.js');
var Path       = require('path');
var Tildify    = require('tildify');

////////////////////////////////////////////////////////////////////////////////

module.exports = function(Maelstrom)
{
    return new Object(
    {
        /**
         * Path to plugin dir.
         *
         * @type {string}
         */
        'PLUGIN_DIR': Path.resolve(__dirname, 'plugins/'),

        /**
         * Basic check if the passed argument is actually gulp.
         *
         * @param {object} $obj
         * @return {boolean}
         */
        'isGulpInstance': function($obj)
        {
            var $result = false;
            if (!_.isEmpty($obj) && $obj.constructor)
            {
                var $constructor = $obj.constructor.toString();
                var $instance    = 'function Gulp(';

                $constructor = $constructor.substr(0, $instance.length);
                $result      = ($constructor === $instance);
            }

            return $result;
        },

        /**
         * Returns a config object from the combined available sources in this
         * order:
         * - default maelstrom config
         * - maelstrom file (eg. `maelstrom.yml`, depends on config setting)
         * - config object passed through `maelstrom.init()`
         * - optional config file, set as `config` key in above object
         *
         * This means that the object passed through `maelstrom.init()` will
         * always override any settings already set by any of the other config
         * sources.
         *
         * @param {object} $customConfig - Custom config object
         * @return {object}
         */
        'createConfig': function($customConfig)
        {
            var $result        = {};
            var $configs       = [$result, Maelstrom.config];
            var $projectConfig = Confirge.read(Maelstrom.config.configFile);
            var $customConfig2;

            if (!_.isEmpty($projectConfig))
            {
                $configs.push($projectConfig);
            }

            if (!_.isEmpty($customConfig))
            {
                $configs.push($customConfig);

                if (!_.isUndefined($customConfig.configFile))
                {
                    $customConfig2 = Confirge.read($customConfig.configFile);

                    if (!_.isEmpty($customConfig2))
                    {
                        $configs.push($customConfig2);
                    }
                }
            }

            // standaard config extenden met nieuwe custom config obj of custom
            // config file
            $result = Confirge.extend.apply($result, $configs);
            $result = Confirge.replace($result, $result.vars);

            return $result;
        },

        /**
         * Load all maelstrom plugins from the `lib/plugins/` folder.
         */
        'loadPlugins': function($pluginDir)
        {
            var $this        = this;
            var $pluginFiles = FileSystem.readdirSync($pluginDir);

            _.each($pluginFiles, function($pluginName)
            {
                var $pluginFile = $pluginDir + Path.sep + $pluginName;
                $pluginName     = Path.basename($pluginName, '.js');

                if (Maelstrom.config.verbose)
                {
                    GulpUtil.log('- Load plugin \'' +
                        Chalk.cyan($pluginName) + '\': ' +
                        Chalk.magenta( Tildify($pluginFile) ));
                }

                var $plugin = $this.loadPlugin( require($pluginFile) );
                Maelstrom[$pluginName] = $plugin;
            });
        },

        /**
         * Further loads a plugin by exporting it's tasks and creating a
         * wrapper function wich returns the requested stream.
         *
         * @param {object} $plugin - The plugin to export the streamer and
         *                           tasks from.
         */
        'loadPlugin': function($plugin)
        {
            if ($plugin instanceof Plugin)
            {
                var $task;
                for ($task in $plugin.tasks)
                {
                    if ($plugin.tasks.hasOwnProperty($task))
                    {
                        Maelstrom.tasks[$task] = $plugin.exportTask($task);
                    }
                }

                return $plugin.exportStreamer();
            }

            return $plugin;
        },

        /**
         * Add all default maelstrom tasks as gulp tasks.
         */
        'defaultTasks': function()
        {
            var $result = [];
            for (var $taskName in Maelstrom.tasks)
            {
                if (Maelstrom.tasks.hasOwnProperty($taskName) &&
                    Maelstrom.task($taskName) !== false)
                {
                    $result.push($taskName);
                }
            }

            return $result;
        },

        /**
         * Add all default maelstrom tasks to the gulp 'watch' task.
         */
        'defaultWatcher': function()
        {
            return Maelstrom.gulp.task('watch', function()
            {
                for (var $taskName in Maelstrom.tasks)
                {
                    if (Maelstrom.tasks.hasOwnProperty($taskName))
                    {
                        Maelstrom.watch($taskName);
                    }
                }
            });
        }
    });
};
