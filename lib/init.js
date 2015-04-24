/**
 * maelstrom | lib/init.js
 * file version: 0.00.007
 */
'use strict';

var _          = require('underscore');
var Confirge   = require('confirge');
var FileSystem = require('graceful-fs');
var GulpUtil   = require('gulp-util');
var Plugin     = require('./plugin.js');
var Path       = require('path');
var Tildify    = require('tildify');

////////////////////////////////////////////////////////////////////////////////

module.exports = function(Maelstrom)
{
    return new Object(
    {
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
        'loadPlugins': function()
        {
            var $this        = this;
            var $pluginDir   = Path.resolve(__dirname, 'plugins/');
            var $pluginFiles = FileSystem.readdirSync($pluginDir);

            _.each($pluginFiles, function($pluginName)
            {
                var $pluginFile = Path.resolve($pluginDir + '/' + $pluginName);
                $pluginName     = Path.basename($pluginName, '.js');

                if (Maelstrom.config.verbose)
                {
                    GulpUtil.log('- Load plugin \'' +
                        GulpUtil.colors.cyan($pluginName) + '\': ' +
                        GulpUtil.colors.magenta( Tildify($pluginFile) ));
                }

                var $plugin = require($pluginFile);
                if ($plugin instanceof Plugin)
                {
                    $plugin = $this.loadPlugin($plugin);
                }

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
            var $task;
            for ($task in $plugin.tasks)
            {
                if (_.has($plugin.tasks, $task))
                {
                    Maelstrom.tasks[$task] = $plugin.exportTask($task);
                }
            }

            return $plugin.exportStreamer();
        },

        /**
         * Add all default maelstrom tasks as gulp tasks.
         */
        'defaultTasks': function()
        {
            for (var $task in Maelstrom.tasks)
            {
                if (Maelstrom.tasks.hasOwnProperty($task))
                {
                    Maelstrom.task($task);
                }
            }
        },

        /**
         * Add all default maelstrom tasks to the gulp 'watch' task.
         */
        'defaultWatcher': function()
        {
            Maelstrom.gulp.task('watch', function()
            {
                if (!true)
                {
                    Maelstrom.browserSync.start();
                    Maelstrom.browserSync.watch();
                }

                for (var $task in Maelstrom.tasks)
                {
                    if (Maelstrom.tasks.hasOwnProperty($task))
                    {
                        Maelstrom.watch($task);
                    }
                }
            });
        }
    });
};
