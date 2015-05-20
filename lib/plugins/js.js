/**
 * maelstrom | lib/plugins/js.js
 * file version: 0.01.008
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

var Maelstrom    = require('../index.js');
var Config       = Maelstrom.config;
var Utils        = Maelstrom.utils;
var Plugin       = require('../plugin.js');
var PluginExport = new Plugin(__filename);

var _               = require('underscore');
var Confirge        = require('confirge');
var Gulp            = Maelstrom.gulp;
var GulpConcat      = require('gulp-concat');
var GulpJsCs        = require('gulp-jscs');
var GulpJsCsStylish = require('gulp-jscs-stylish');
var GulpJsHint      = require('gulp-jshint');
var GulpSize        = require('gulp-size');
var GulpUglify      = require('gulp-uglify');
var RunSequence     = require('run-sequence').use(Gulp);

////////////////////////////////////////////////////////////////////////////////

/**
 * Return the location of the JavaScript source files.
 */
PluginExport.src = function($src)
{
    return Utils.extendArgs($src, Config.src.js + '/**/*.js');
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
    Config.js.concat[$destFile] = $srcFiles;
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

    var $stream = GulpConcat($destFile);
    if (Utils.isProd())
    {
        $stream.pipe( GulpUglify(Config.js.uglify) );
    }

    return $stream;
});

/**
 * Lint JavaScript files with _jshint_ and display the results with
 * _jshint-stylish_.
 */
PluginExport.addStream('lint', function()
{
    var $config = Confirge.read(Config.js.jshintFile);
    $config = Confirge.extend({}, Config.js.jshint, $config);

    var $stream = GulpJsHint($config);
    $stream.pipe( GulpJsCs(Config.js.jscs) )
        .on('error', Maelstrom.utils.noop);

    $stream.pipe( GulpJsCsStylish.combineWithHintResults() );
    $stream.pipe( GulpJsHint.reporter('jshint-stylish') );

    return $stream;
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

    // Maelstrom.task('js:lint');
    // Maelstrom.task('js:concat');

    return RunSequence('js:lint', 'js:concat');
});

/**
 * Concatenate JavaScript files according to the `jsConcat` config option. The
 * result will be further uglified when not `--dev`.
 */
PluginExport.addTask('js:concat', function($plugin)
{
    var $collections = Config.js.concat;

    if (!_.isEmpty($collections))
    {
        for (var $destFile in $collections)
        {
            if (!$collections.hasOwnProperty($destFile))
            {
                continue;
            }

            Gulp.src($collections[$destFile])
                .pipe( $plugin.stream('concat', [$destFile]) )
                .pipe( GulpSize(Config.main.size) )
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
