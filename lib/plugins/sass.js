/**
 * maelstrom | lib/plugins/sass.js
 * file version: 0.00.004
 */
'use strict';

var Maelstrom        = require('../index.js'),
    Plugin           = require('../plugin.js'),
    PluginExport     = new Plugin(__filename),
    Config           = Maelstrom.config,
    ModulesConfig    = Maelstrom.config.modules,
    Utils            = Maelstrom.utils,
    Gulp             = Maelstrom.gulp,
    GulpAutoprefixer = require('gulp-autoprefixer'),
    GulpMinifyCss    = require('gulp-minify-css'),
    GulpSass         = require('gulp-sass'),
    GulpSize         = require('gulp-size');

////////////////////////////////////////////////////////////////////////////////

// return location of sass source files
PluginExport.src = function()
{
    return Config.src.sass +'/**/*.{sass,scss}';
};

// return location of css output folder
PluginExport.dest = function()
{
    return Config.dest.css;
};

// return a piped stream to compile sass -> css
PluginExport.addStream('libsass', function()
{
    return Utils.pipeStreams(
    [
        GulpSass(ModulesConfig.libsass),
        GulpAutoprefixer(ModulesConfig.autoprefixer),
        Utils.pipeWhenProd( GulpMinifyCss() )
    ]);
});

// gulp sass task
PluginExport.addTask('sass', function($plugin)
{
    if (Config.sassCompiler === 'ruby')
    {
        console.log('Ruby Sass task not yet supported!');
        return false;
    }
    else
    {
        return Gulp.src($plugin.src())
            .pipe( Maelstrom.plumber() )
            .pipe( $plugin.stream('libsass') )
            .pipe( GulpSize(ModulesConfig.size) )
            .pipe( Gulp.dest($plugin.dest()) )
            .pipe( Maelstrom.browserSync() );
    }
});

module.exports = PluginExport;
