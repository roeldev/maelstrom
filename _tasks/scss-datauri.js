var config      = require('../gulpconfig.js'),
    gulp        = require('gulp'),
    plugin      = require('gulp-load-plugins')(),
    browserSync = require('browser-sync');

//------------------------------------------------------------------------------

gulp.task('scss-datauri', function()
{
    return gulp.src(config.imgs.dirSource +'/**/*.{'+ config.imgs.extensions.join(',') +'}')
        .pipe( plugin.plumber({ errorHandler: plugin.notify.onError(config.notifyError) }) )
        //.pipe( plugin.if(config.isDev, plugin.sourcemaps.init({ loadMaps: false, debug: false })) )
        .pipe( plugin.sass({ style: 'expanded' }) )
        .pipe( plugin.if(config.isDev, plugin.sourcemaps.write()) )
        //.pipe( plugin.base64(
        //{
        //    baseDir:      'public',
        //    //extensions:   ['svg', 'png', /\.jpg#datauri$/i],
        //    exclude:      [/.*fonts.*/],
        //    maxImageSize: 10*1024,
        //    debug:        true
        //}))
        .pipe( plugin.autoprefixer(config.autoprefixer) )
        .pipe( plugin.if(!config.isDev, plugin.minifyCss()) )
        .pipe( gulp.dest(config.scss.dirOutput) )
        .pipe( browserSync.reload({ stream: true }) );
});
