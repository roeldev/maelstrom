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

function handleIconfontCodepoints($codepoints, $iconFontOptions)
{
    console.log($iconFontOptions);

    var $src        = Config.iconsTemplate,
        $destFile   = Config.iconsOutputName,
        $destDir    = Config.src.sass +'/maelstrom/',
        $vars,
        $codepoint;

    // create a valid value to be placed in the css content property
    for(var $i = 0, $iL = $codepoints.length; $i < $iL; $i++)
    {
        $codepoint = $codepoints[$i].codepoint;
        $codepoints[$i].content = $codepoint.toString(16).toUpperCase();
    }

    // variables, available in template
    $vars =
    {
        'glyphs':    $codepoints,
        'bowerDir':  '../assets/bower_components/',
        'fontName':  $iconFontOptions.fontName,
        'fontPath':  '/fonts/',
        'className': 'icon'
    };

    // add underscore in front of filename to indicate it's a sass import file
    if ($destFile.substr(0, 1) !== '_')
    {
        $destFile = '_'+ $destFile;
    }
    // add scss file extension when not defined
    if (Path.extname($destFile) !== '.scss' && Path.extname($destFile) !== '.sass')
    {
        $destFile += '.scss';
    }

    if (_.isEmpty($src) || true)
    {
        $src = Path.resolve(__dirname, '../templates/iconfont-frame.txt');
    }

    // template -> sass import file
    return Gulp.src($src)
        .pipe( GulpConsolidate('lodash', $vars) )
        .pipe( GulpRename($destFile) )
        .pipe( Gulp.dest($destDir) );
}

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
