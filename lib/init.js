/**
 * maelstrom | lib/init.js
 * file version: 0.00.005
 */
'use strict';

var _          = require('underscore'),
    DeepExtend = require('deep-extend'),
    FileSystem = require('graceful-fs'),
    GulpUtil   = require('gulp-util'),
    Plugin     = require('./plugin.js'),
    Path       = require('path'),
    Tildify    = require('tildify');

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
            var $constructor = $obj.constructor.toString(),
                $instance    = 'function Gulp(';

            $result = ($constructor.substr(0, $instance.length) === $instance);
        }

        return $result;
    },

    //------------------------------------------------------------------------------

    /**
     * Returns a config object from the combined available sources in this order:
     * - default maelstrom config
     * - `maelstrom.json`
     * - an object passed through `Maelstrom.init()`
     *
     * This means that the object passed through `maelstrom.init()` will always
     * override any settings already set by any of the other config sources.
     *
     * @param {object} $customConfig - Custom config object
     * @return {object}
     */
    'createConfig': function($customConfig)
    {
        var $result            = {},
            $configs           = [$result, Maelstrom.config],
            $projectConfig     = {},
            $projectConfigFile = 'maelstrom.json';

        // read config json file from project root folder
        if (FileSystem.existsSync($projectConfigFile))
        {
            $projectConfig = FileSystem.readFileSync($projectConfigFile, 'utf8');
            $projectConfig = JSON.parse($projectConfig);

            if (!_.isEmpty($projectConfig))
            {
                $configs.push($projectConfig);
            }
        }

        if (_.isObject($customConfig) && !_.isEmpty($customConfig))
        {
            $configs.push($customConfig);
        }

        if ($configs.length === 2)
        {
            // return default config
            $result = $configs[1];
        }
        else
        {
            // combine the 3 config sources in to one object
            DeepExtend.apply($result, $configs);
        }

        return $result;
    },

    /**
     * Load all maelstrom plugins from the `lib/plugins/` folder.
     */
    'loadPlugins': function()
    {
        var $this        = this,
            $pluginDir   = Path.resolve(__dirname, 'plugins/'),
            $pluginFiles = FileSystem.readdirSync($pluginDir);

        _.each($pluginFiles, function($pluginName)
        {
            var $pluginFile = Path.resolve($pluginDir +'/'+ $pluginName);
                $pluginName = Path.basename($pluginName, '.js');

            if (Maelstrom.config.verbose)
            {
                GulpUtil.log('- Load plugin \''+
                             GulpUtil.colors.cyan($pluginName) +'\': '+
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
     * Further loads a plugin by exporting it's tasks and creating a wrapper
     * function wich returns the requested stream.
     *
     * @param {object} $plugin - The plugin to export the streamer and tasks from.
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
