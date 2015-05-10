/**
 * maelstrom | lib/plugins/icons.js
 * file version: 0.01.004
 *
 * Streams:
 * ✓ font
 * - sprite*
 *
 * Tasks:
 * ✓ icons
 */
'use strict';

var Maelstrom       = require('../index.js');
var Config          = Maelstrom.config;
var ModulesConfig   = Maelstrom.config.modules;
var Utils           = Maelstrom.utils;
var Plugin          = require('../plugin.js');
var PluginExport    = new Plugin(__filename);

var _               = require('underscore');
var Gulp            = Maelstrom.gulp;
var GulpConsolidate = require('gulp-consolidate');
var GulpIconFont    = require('gulp-iconfont');
var GulpRename      = require('gulp-rename');
var GulpSize        = require('gulp-size');
var Path            = require('path');

////////////////////////////////////////////////////////////////////////////////

// create config object
function fontCreateConfig($iconFontConfig)
{
    var $config = $iconFontConfig.templateConfig;
    var $src    = '../templates/' + Config.iconsTemplate;
    var $cwd    = process.cwd();

    var $defaultConfig =
    {
        'src':       Path.resolve(__dirname, $src),
        'dest':      Path.resolve($cwd, Config.src.sass + '/maelstrom/'),
        'fontName':  $iconFontConfig.fontName,
        'fontPath':  '/fonts/',
        'className': 'icon',
        'bowerDir':  Path.resolve($cwd, Config.src.bower)
    };

    if (!$config || !_.isObject($config))
    {
        $config = $defaultConfig;
    }
    else
    {
        if (!_.isUndefined($config.dest))
        {
            $config.dest = Path.resolve($cwd, $config.dest);
        }

        // make sure all default config options are set
        $config = _.extendOwn($defaultConfig, $config);
    }
    return $config;
}

// seperate dest file from dir
function fontSeperateDest($config)
{
    var $destFile = Path.basename($config.dest);
    var $destDir  = Path.dirname($config.dest);

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
        $destFile = '_icons_' + Config.iconsOutputName + '.scss';
    }
    else
    {
        // add underscore in front of filename to indicate it's a sass import
        // file
        if ($destFile.substr(0, 1) !== '_')
        {
            $destFile = '_' + $destFile;
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
function fontPrepareCodepoints($codepoints)
{
    var $codepoint;
    for (var $i = 0, $iL = $codepoints.length; $i < $iL; $i++)
    {
        $codepoint = $codepoints[$i].codepoint;
        $codepoints[$i].content = $codepoint.toString(16).toUpperCase();
    }

    return $codepoints;
}

/**
 * Codepoints event handler for iconfont stream.
 *
 * @param {array} $codepoints
 * @param {object} $iconFontConfig
 * @return {object}
 */
function fontHandleCodepoints($codepoints, $iconFontConfig)
{
    var $config = fontCreateConfig($iconFontConfig);
    var $dest   = fontSeperateDest($config);

    $config.dest   = $dest.path;
    $config.glyphs = fontPrepareCodepoints($codepoints);

    // template -> sass import file
    return Gulp.src($config.src)
        .pipe( GulpConsolidate('lodash', $config) )
        .pipe( GulpRename($dest.file) )
        .pipe( GulpSize(ModulesConfig.size) )
        .pipe( Gulp.dest($dest.dir) );
}

//------------------------------------------------------------------------------

/**
 * Return the location of the SVGs wich should be used to create the icon
 * font/sprite.
 */
PluginExport.src = function($src)
{
    return Utils.extendArgs($src, Config.src.icons + '/*.svg');
};

/**
 * Return the location of either the fonts or the images output folder.
 */
PluginExport.dest = function($type)
{
    if (_.isEmpty($type))
    {
        $type = Config.iconsType;
    }

    return (($type === 'sprite') ?
            Config.dest.images :
            Config.dest.fonts);
};

//------------------------------------------------------------------------------

/**
 * Create iconfonts from seperate SVG icon files. The names and codepoints of
 * the SVGs are written to a Sass import file.
 */
PluginExport.addStream('font', function($templateConfig)
{
    var $config = _.extendOwn({}, ModulesConfig.iconfont,
    {
        'fontName':       Config.iconsOutputName,
        'templateConfig': $templateConfig
    });

    return GulpIconFont($config).on('codepoints', fontHandleCodepoints);
});

/**
 * Create a SVG sprite from seperate SVG icon files. The names and coordinates
 * of the individual icons are written to a Sass import file.
 *
 * @WIP
 */
PluginExport.addStream('sprite', function()
{
    return false;
});

//------------------------------------------------------------------------------

/**
 * Create iconfonts or a sprite from seperate SVG icon files.
 */
PluginExport.addTask('icons', function($plugin)
{
    var $type = Config.iconsType;

    // force iconfont for now
    $type = 'font';

    return Gulp.src($plugin.src())
        .pipe( Maelstrom.plumber() )
        .pipe( $plugin.stream($type) )
        .pipe( GulpSize(ModulesConfig.size) )
        .pipe( Gulp.dest($plugin.dest()) );
});

module.exports = PluginExport;
