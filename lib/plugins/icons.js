/**
*maelstrom | lib/plugins/icons.js
*file version: 0.00.001
*/
'use strict';

var _               = require('underscore'),
    Maelstrom       = require('../index.js'),
    Plugin          = require('../plugin.js'),
    PluginExport    = new Plugin(__filename),
    Config          = Maelstrom.config,
    ModulesConfig   = Maelstrom.config.modules,
    Gulp            = Maelstrom.gulp,
    GulpConsolidate = require('gulp-consolidate'),
    GulpIconFont    = require('gulp-iconfont'),
    GulpRename      = require('gulp-rename'),
    GulpSize        = require('gulp-size'),
    Path            = require('path');

////////////////////////////////////////////////////////////////////////////////

// create config object
function createConfig($iconFontConfig)
{
    var $config = $iconFontConfig.templateConfig,

    $defaultConfig =
    {
        'src':       Path.resolve(__dirname, '../templates/'+ Config.iconsTemplate),
        'dest':      Config.src.sass +'/maelstrom/',
        'fontName':  $iconFontConfig.fontName,
        'fontPath':  '/fonts/',
        'className': 'icon',
        'bowerDir':  '../bower_components/'
    };

    if (!_.isUndefined($config.dest))
    {
        $config.dest = Path.resolve(process.cwd(), $config.dest);
    }

    // make sure all default config options are set
    $config = _.extendOwn($defaultConfig, $config);
    return $config;
}

// seperate dest file from dir
function seperateDest($config)
{
    var $destFile = Path.basename($config.dest),
        $destDir  = Path.dirname($config.dest);

    // when no filename is set in the dest path, the basename is the last dir
    // in the path. check if this is the case and add the dir back to the
    // dest path. set dest file as empty so we can set the default one.
    if (Path.extname($destFile) === '')
    {
        $destDir += Path.sep + $destFile;
        $destFile = '';
    }

    // check file name and set a default one if needed
    if (_.isEmpty($destFile))
    {
        $destFile = '_icons_'+ Config.iconsOutputName +'.scss';
    }
    else
    {
        // add underscore in front of filename to indicate it's a sass import
        // file
        if ($destFile.substr(0, 1) !== '_')
        {
            $destFile = '_'+ $destFile;
        }
        // add scss file extension when not defined
        if (Path.extname($destFile) !== '.scss' &&
            Path.extname($destFile) !== '.sass')
        {
            $destFile += '.scss';
        }
    }

    return new Object(
    {
        'file': $destFile,
        'dir':  $destDir,
        'path': $destDir + Path.sep + $destFile
    });
}

// create a valid value to be placed in the css content property
function prepareCodepoints($codepoints)
{
    var $codepoint;

    for(var $i = 0, $iL = $codepoints.length; $i < $iL; $i++)
    {
        $codepoint = $codepoints[$i].codepoint;
        $codepoints[$i].content = $codepoint.toString(16).toUpperCase();
    }
    return $codepoints;
}

// codepoints event handler for iconfont stream
function handleIconfontCodepoints($codepoints, $iconFontConfig)
{
    var $config = createConfig($iconFontConfig),
        $dest   = seperateDest($config);

    $config.dest   = $dest.path;
    $config.glyphs = prepareCodepoints($codepoints);

    // template -> sass import file
    return Gulp.src($config.src)
        .pipe( GulpConsolidate('lodash', $config) )
        .pipe( GulpRename($dest.file) )
        .pipe( GulpSize(ModulesConfig.size) )
        .pipe( Gulp.dest($dest.dir) );
}

//------------------------------------------------------------------------------

// return location of raw, unoptimized images
PluginExport.src = function()
{
    return Config.src.icons +'/*.svg';
};

// return location of the images output folder
PluginExport.dest = function()
{
    return Config.dest.images;
};

// return a stream from iconfont
PluginExport.addStream('iconfont', function($templateConfig)
{
    var $config = _.extendOwn({}, ModulesConfig.iconfont,
    {
        'fontName':       Config.iconsOutputName,
        'templateConfig': $templateConfig
    });

    return GulpIconFont($config)
        .on('codepoints', handleIconfontCodepoints);
});

// gulp images task
PluginExport.addTask('icons', function($plugin)
{
    // loop through resize tasks and resize the matching images according
    // to config settings

    return Gulp.src($plugin.src())
        .pipe( Maelstrom.plumber() )
        .pipe( $plugin.stream('iconfont') )
        .pipe( GulpSize(ModulesConfig.size) )
        .pipe( Gulp.dest($plugin.dest()) )
        .pipe( Maelstrom.browserSync() );
});

module.exports = PluginExport;
