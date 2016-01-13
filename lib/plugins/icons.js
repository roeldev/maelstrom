/**
 * maelstrom | lib/plugins/icons.js
 * file version: 0.01.005
 *
 * Streams:
 * ✓ font
 * - sprite*
 *
 * Tasks:
 * ✓ icons
 */
'use strict';

var Maelstrom    = require('../index.js');
var Config       = Maelstrom.config;
var Utils        = Maelstrom.utils;
var Plugin       = require('../plugin.js');
var PluginExport = new Plugin(__filename);

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
    var $cwd    = process.cwd();
    var $config = $iconFontConfig.templateConfig;

    var $src    = Config.icons.templateFile;
    var $dest   = Path.resolve($cwd, Config.src.sass + '/maelstrom/');
    var $import = Config.icons.importFile;

    $src = (Path.isAbsolute($src) ?
            Path.normalize($src) :
            Path.resolve($cwd, $src));

    var $defaultConfig = {
        'src':        $src,
        'dest':       $dest,
        'fontName':   $iconFontConfig.fontName,
        'fontPath':   '/fonts/',
        'className':  'icon'
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

    if ($import)
    {
        if (!Path.isAbsolute($import))
        {
            $import = Path.resolve($cwd, $import);
        }

        $import = Path.relative($config.dest, $import);
    }

    $config.importFile = $import.replace(/\\/g, '/');
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
        $destFile = '_icons_' + Config.icons.outputName + '.scss';
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

    return {
        'file': $destFile,
        'dir':  $destDir,
        'path': $destDir + Path.sep + $destFile
    };
}

// create a valid value to be placed in the css content property
function fontPrepareGlyphs($config, $glyphs)
{
    var $glyph;
    var $unicode;

    for (var $i = 0, $iL = $glyphs.length; $i < $iL; $i++)
    {
        $glyph = $glyphs[$i];

        // convert unicode to \E001 etc.
        $unicode = $glyph.unicode[0].charCodeAt();
        $unicode = $unicode.toString(16).toUpperCase();

        $glyph.content   = $unicode;
        $glyph.className = $config.className +'-'+ $glyph.name;

        $glyphs[$i] = $glyph;
    }

    return $glyphs;
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
        $type = Config.icons.type;
    }

    return (($type === 'sprite') ?
            Config.dest.images :
            Config.dest.fonts);
};

//------------------------------------------------------------------------------

/**
 * Create iconfonts from seperate SVG icon files. The names and glyphs of
 * the SVGs are written to a Sass import file.
 */
PluginExport.addStream('font', function($templateConfig)
{
    var $config = _.extendOwn({}, Config.icons.iconfont,
    {
        'fontName':       Config.icons.outputName,
        'templateConfig': $templateConfig,
        // 'timestamp':      Math.round(Date.now()/1000),
    });

    return GulpIconFont($config)
        .on('glyphs', function iconfontOnGlyphs($glyphs, $iconFontConfig)
        {
            var $config = fontCreateConfig($iconFontConfig);
            var $dest   = fontSeperateDest($config);

            $config.dest   = $dest.path;
            $config.glyphs = fontPrepareGlyphs($config, $glyphs);

            // template -> sass import file
            return Gulp.src($config.src)
                .pipe( GulpConsolidate('lodash', $config) )
                .pipe( GulpRename($dest.file) )
                .pipe( GulpSize(Config.main.size) )
                .pipe( Gulp.dest($dest.dir) );
        });
});

//------------------------------------------------------------------------------

/**
 * Create iconfonts or a sprite from seperate SVG icon files.
 */
PluginExport.addTask('icons', function($plugin)
{
    var $type = Config.icons.type;

    // force iconfont for now
    $type = 'font';

    return Gulp.src($plugin.src())
        .pipe( Maelstrom.plumber() )
        .pipe( $plugin.stream($type) )
        .pipe( GulpSize(Config.main.size) )
        .pipe( Gulp.dest($plugin.dest()) );
});

module.exports = PluginExport;
