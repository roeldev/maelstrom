/**
 * maelstrom | lib/init.js
 * file version: 0.00.001
 */
'use strict';
console.log('require init.js');

var _          = require('underscore'),
    Maelstrom  = require('./index.js'),
    DeepExtend = require('deep-extend'),
    FileSystem = require('graceful-fs'),
    Path       = require('path'),
    Plugin     = require('./plugin.js');

////////////////////////////////////////////////////////////////////////////////

// export plugin stream and add to maelstrom
function exportPlugin($plugin)
{
    console.log('exportPlugin()');

    var $export = function($stream)
    {
    };

    $export.src = function()
    {
        return $plugin.src();
    };

    $export.dest = function()
    {
        return $plugin.dest();
    };

    return $export;
}

// export plugin tasks and add to maelstrom
function exportTasks($maelstrom, $plugin)
{
    console.log('exportTasks()');
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

            $result = ($constructor.substr(0, $instance.length) == $instance);
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
        console.log(' Init.createConfig()');

        var $result            = {},
            $configs           = [$result, Maelstrom.config],
            $projectConfig     = {},
            $projectConfigFile = 'maelstrom.json';

        // read config json file from project root folder
        if (FileSystem.existsSync($projectConfigFile))
        {
            console.log('  read maelstrom.json file');

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

        console.log('  deep extend configs: '+ $configs.length);

        return (($configs.length == 2)
            // return default config
            ? $configs[1]
            // combine the 3 config sources in to one object
            : $result = DeepExtend.apply($result, $configs));
    },

    /**
     * Load all maelstrom plugins from the `lib/plugins/` folder.
     */
    'loadPlugins': function($maelstrom)
    {
        console.log(' Init.loadPlugins()');

        var $pluginDir   = Path.resolve(__dirname, 'plugins/'),
            $pluginFiles = FileSystem.readdirSync($pluginDir),
            $pluginFile,
            $pluginName,
            $plugin;

        while ($pluginFiles.length)
        {
            $pluginFile = $pluginName = $pluginFiles.shift();
            $pluginFile = Path.resolve($pluginDir +'/'+ $pluginFile);
            $pluginName = Path.basename($pluginName, '.js');

            console.log('  load plugin: '+ $pluginName);

            $plugin = require($pluginFile);
            if ($plugin instanceof Plugin)
            {
                exportTasks($maelstrom, $plugin);
                $plugin = exportPlugin($plugin);
            }

            $maelstrom[$pluginName] = $plugin;
        }
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
