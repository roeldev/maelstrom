/**
 * maelstrom | lib/plugins/images.js
 * file version: 0.00.003
 */
'use strict';

var Maelstrom     = require('../index.js'),
    Plugin        = require('../plugin.js'),
    PluginExport  = new Plugin(),
    Config        = Maelstrom.config,
    ModulesConfig = Maelstrom.config.modules,
    Utils         = Maelstrom.utils,
    Gulp          = Maelstrom.gulp,
    GulpImageMin  = require('gulp-imagemin');

////////////////////////////////////////////////////////////////////////////////

PluginExport.src = function()
{
    return Config.src.images +'/**/*.{'+ Config.imageExtensions.join(',') +'}';
};

PluginExport.dest = function()
{
    return Config.dest.images;
};

PluginExport.addStream('optimize', function()
{
    return GulpImageMin(ModulesConfig.imagemin);
});

PluginExport.addStream('resize', []);

PluginExport.addTask('images:optimize', function()
{
    return Gulp.src(this.src())
        .pipe( Maelstrom.plumber() )
        .pipe( GulpIf(!GulpUtil.env.all, GulpChanged( this.dest() )) )
        .pipe( this.stream('optimize') )
        .pipe( GulpSize(ModulesConfig.size) )
        .pipe( Gulp.dest(this.dest()) )
        .pipe( Maelstrom.browserSync() );
});

PluginExport.addTask('images:resize', function()
{
    // loop through resize tasks, multiple Gulp.src calls...
});

PluginExport.addTask('images', ['images:optimize', 'images:resize']);

module.exports = PluginExport;
