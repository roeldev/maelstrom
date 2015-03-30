/**
 * maelstrom | lib/plugins/sass.js
 * file version: 0.00.002
 */
'use strict';

var Maelstrom        = require('../index.js'),
    Plugin           = require('../plugin.js'),
    PluginExport     = new Plugin(),
    Config           = Maelstrom.config,
    Utils            = Maelstrom.utils,
    Gulp             = Maelstrom.gulp,
    GulpAutoprefixer = require('gulp-autoprefixer'),
    GulpMinifyCss    = require('gulp-minify-css'),
    GulpSass         = require('gulp-sass'),
    GulpSize         = require('gulp-size');

////////////////////////////////////////////////////////////////////////////////

PluginExport = new Plugin();
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
        GulpSass(Config.sass.libsass),
        GulpAutoprefixer(Config.css.autoprefixer),
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
            .pipe( GulpSize({ showFiles: true }) )
            .pipe( Gulp.dest(this.dest()) )
            .pipe( BrowserSync.reload({ stream: true }) );
    }
});

module.exports = PluginExport;
