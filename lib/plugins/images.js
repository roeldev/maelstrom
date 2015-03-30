/**
 * maelstrom | lib/plugins/images.js
 * file version: 0.00.002
 */
'use strict';

var Maelstrom    = require('../index.js'),
    Plugin       = require('../plugin.js'),
    PluginExport = new Plugin(),
    Config       = Maelstrom.config,
    Utils        = Maelstrom.utils,
    Gulp         = Maelstrom.gulp,
    GulpImageMin = require('gulp-imagemin');

////////////////////////////////////////////////////////////////////////////////

PluginExport = new Plugin();
PluginExport.src = function()
{
    return Config.src.images +'/**/*.{'+ Config.images.extensions.join(',') +'}';
};

PluginExport.dest = function()
{
    return Config.dest.images;
};

PluginExport.addStream('optimize', function()
{
    return GulpImageMin(Config.images.imagemin);
});

PluginExport.addStream('resize', []);

PluginExport.addTask('images:optimize', function()
{
    return Gulp.src(this.src())
        .pipe( Maelstrom.plumber() )
        .pipe( GulpIf(!GulpUtil.env.all, GulpChanged( this.dest() )) )
        .pipe( this.stream('optimize') )
        .pipe( GulpSize({ showFiles: true }) )
        .pipe( Gulp.dest(this.dest()) )
        .pipe( BrowserSync.reload({ stream: true }) );
});

PluginExport.addTask('images:resize', function()
{
    // loop through resize tasks, multiple Gulp.src calls...
});

PluginExport.addTask('images', ['images:optimize', 'images:resize']);

module.exports = PluginExport;
