/**
 * maelstrom | lib/init.js
 * file version: 0.00.002
 */
'use strict';
//console.log('require init.js');

var _          = require('underscore'),
    DeepExtend = require('deep-extend'),
    FileSystem = require('graceful-fs'),
    Path       = require('path'),
    Plugin     = require('./plugin.js');

////////////////////////////////////////////////////////////////////////////////

/**
 * Further loads a plugin by exporting it's tasks and creating a wrapper
 * function wich returns the requested stream.
 *
 * @param {object} $maelstrom - The maelstrom object to add the tasks to.
 * @param {object} $plugin - The plugin to export the streamer and tasks from.
 * @return {[type]}            [description]
 */
function loadPlugin($maelstrom, $plugin)
{
    var $task;
    for ($task in $plugin.tasks)
    {
        if (_.has($plugin.tasks, $task))
        {
            $maelstrom.tasks[$task] = $plugin.exportTask($task);
        }
    }

    return $plugin.exportStreamer();
}

//------------------------------------------------------------------------------

module.exports =
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
    'createConfig': function($maelstrom, $customConfig)
    {
        //console.log(' Init.createConfig()');

        var $result            = {},
            $configs           = [$result, $maelstrom.config],
            $projectConfig     = {},
            $projectConfigFile = 'maelstrom.json';

        // read config json file from project root folder
        if (FileSystem.existsSync($projectConfigFile))
        {
            //console.log('  read maelstrom.json file');

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

        //console.log('  deep extend configs: '+ $configs.length);

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

        //console.log('  config result:', $result);
        return $result;
    },

    /**
     * Load all maelstrom plugins from the `lib/plugins/` folder.
     */
    'loadPlugins': function($maelstrom)
    {
        //console.log(' Init.loadPlugins()');

        var $pluginDir   = Path.resolve(__dirname, 'plugins/'),
            $pluginFiles = FileSystem.readdirSync($pluginDir);

        _.each($pluginFiles, function($pluginName)
        {
            var $pluginFile = Path.resolve($pluginDir +'/'+ $pluginName);
                $pluginName = Path.basename($pluginName, '.js');

            console.log('[00:00:00] Load plugin: `'+ $pluginName +'` '+ $pluginFile);

            var $plugin = require($pluginFile);
            if ($plugin instanceof Plugin)
            {
                $plugin = loadPlugin($maelstrom, $plugin);
            }

            $maelstrom[$pluginName] = $plugin;
        });
    },

    'defaultTasks': function()
    {
        // add all default maelstrom tasks as gulp tasks
        //var $task;
        //for ($task in Maelstrom.tasks) Maelstrom.useTask($task);
    },

    'defaultWatcher': function()
    {
        // add all default maelstrom tasks to the gulp 'watch' task
        /*$maelstrom.gulp.task('watch', function()
        {
            if (!true)
            {
                BrowserSync(Config.browserSync);

                Maelstrom.browserSync.start();
                Maelstrom.gulp.watch('** /*.{html|php}')
                    .on('change', BrowserSync.reload);
            }

            for ($task in Maelstrom.tasks)
            {
                Maelstrom.watch($task);
            }
        });*/
    }
};