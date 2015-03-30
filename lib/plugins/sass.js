/**
 * maelstrom | lib/plugins/sass.js
 * file version: 0.00.003
 */
'use strict';

var Maelstrom        = require('../index.js'),
    Plugin           = require('../plugin.js'),
    PluginExport     = new Plugin(),
    Config           = Maelstrom.config,
    ModulesConfig    = Maelstrom.config.modules,
    Utils            = Maelstrom.utils,
    Gulp             = Maelstrom.gulp,
    GulpAutoprefixer = require('gulp-autoprefixer'),
    GulpMinifyCss    = require('gulp-minify-css'),
    GulpSass         = require('gulp-sass'),
    GulpSize         = require('gulp-size');

////////////////////////////////////////////////////////////////////////////////

PluginExport.src = function()
{
    return Config.src.sass +'/**/*.{sass,scss}';
};

PluginExport.dest = function()
{
    return Config.dest.css;
};

PluginExport.addStream('libsass', function()
{
    return Utils.pipeStreams(
    [
        GulpSass(ModulesConfig.libsass),
        GulpAutoprefixer(ModulesConfig.autoprefixer),
        Utils.pipeWhenNotDev( GulpMinifyCss() )
    ]);
});

PluginExport.addTask('sass', function()
{
    if (Config.sass.compiler == 'ruby')
    {
        console.log('Ruby Sass task not yet supported!');
        return false;
    }
    else
    {
        return Gulp.src(this.src())
            .pipe( Maelstrom.plumber() )
            .pipe( this.stream('libsass') )
            .pipe( GulpSize(ModulesConfig.size) )
            .pipe( Gulp.dest(this.dest()) )
            .pipe( Maelstrom.browserSync() );
    }
});

module.exports = PluginExport;
