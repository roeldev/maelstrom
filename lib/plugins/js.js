/**
 * maelstrom | lib/plugins/js.js
 * file version: 0.01.003
 *
 * Streams:
 * ✓ concat
 * ✓ lint
 *
 * Tasks:
 * ✓ js
 * ✓ js:concat
 * ✓ js:lint
 */
'use strict';

var Maelstrom     = require('../index.js'),
    Config        = Maelstrom.config,
    ModulesConfig = Maelstrom.config.modules,
    Utils         = Maelstrom.utils,
    Plugin        = require('../plugin.js'),
    PluginExport  = new Plugin(__filename),
    _             = require('underscore'),
    Gulp          = Maelstrom.gulp,
    GulpConcat    = require('gulp-concat'),
    GulpJsHint    = require('gulp-jshint'),
    GulpSize      = require('gulp-size'),
    GulpUglify    = require('gulp-uglify'),
    FileSystem    = require('graceful-fs'),
    RunSequence   = require('run-sequence').use(Gulp);

////////////////////////////////////////////////////////////////////////////////

/**
 * Return the location of the JavaScript source files.
 */
PluginExport.src = function($src)
{
    return Utils.extendArgs($src, Config.src.js +'/**/*.js');
};

/**
 * Return the location of the JavaScript output folder.
 */
PluginExport.dest = function()
{
    return Config.dest.js;
};

/**
 * Add files to concat to config
 */
PluginExport.concat = function($destFile, $srcFiles)
{
    Config.jsConcat[$destFile] = $srcFiles;
};

//------------------------------------------------------------------------------

/**
 * Concatenate JavaScript files and further uglify the result when not `--dev`.
 */
PluginExport.addStream('concat', function($destFile)
{
    // make sure the dest filename has a js file extension
    if ($destFile.substr($destFile.length - 3) !== '.js')
    {
        $destFile += '.js';
    }

    return Utils.pipeStreams(
    [
        GulpConcat($destFile),
        Utils.pipeWhenProd( GulpUglify(ModulesConfig.uglify) )
    ]);
});

/**
 * Lint JavaScript files with _jshint_ and display the results with
 * _jshint-stylish_.
 */
PluginExport.addStream('lint', function()
{
    var $config = {};
    if (FileSystem.existsSync(Config.jshintConfig))
    {
        $config = FileSystem.readFileSync(Config.jshintConfig, 'utf8');
        $config = JSON.parse($config);
        $config.lookup = false;

        $config = _.extendOwn({}, ModulesConfig.jshint, $config);
    }
    else
    {
        $config = ModulesConfig.jshint;
    }

    return Utils.pipeStreams(
    [
        GulpJsHint($config),
        GulpJsHint.reporter('jshint-stylish')
    ]);
});

//------------------------------------------------------------------------------

/**
 * Execute the `js:lint` and `js:concat` tasks.
 */
PluginExport.addTask('js', function()
{
    // read files in /assets/js dir
    // check wich files are not in jsConcat
    // export only those files to /public/js
    // concat all other files according to jsConcat

    //Maelstrom.task('js:lint');
    //Maelstrom.task('js:concat');

    return RunSequence('js:lint', 'js:concat');
});

/**
 * Concatenate JavaScript files according to the `jsConcat` config option. The
 * result will be further uglified when not `--dev`.
 */
PluginExport.addTask('js:concat', function($plugin)
{
    var $collections = Config.jsConcat;
    if (!_.isEmpty($collections))
    {
        for(var $destFile in $collections)
        {
            if (!$collections.hasOwnProperty($destFile))
            {
                continue;
            }

            Gulp.src($collections[$destFile])
                .pipe( $plugin.stream('concat', [$destFile]) )
                .pipe( GulpSize(ModulesConfig.size) )
                .pipe( Gulp.dest($plugin.dest()) );
        }
    }
});

/**
 * Lint the JavaScript files located in the `src.js` folder with _jshint_ and
 * display the results with _jshint-stylish_.
 */
PluginExport.addTask('js:lint', function($plugin)
{
    return Gulp.src($plugin.src())
        .pipe( Maelstrom.plumber() )
        .pipe( $plugin.stream('lint') );
});

module.exports = PluginExport;
