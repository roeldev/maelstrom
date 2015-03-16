var config = require('../gulpconfig.js'),
    gulp   = require('gulp'),
    plugin = require('gulp-load-plugins')();

//------------------------------------------------------------------------------

gulp.task('icons-create-fonts', function()
{
    function handleIconfontCodepoints($codepoints, $options)
    {
        var $templateOptions =
        {
            glyphs:    $codepoints,
            fontName:  $options.fontName,
            fontPath:  '/fonts/',
            className: 'icon'
        };

        return gulp.src(config.templatesDir +'/iconfont.tpl')
            .pipe( plugin.consolidate('lodash', $templateOptions) )
            .pipe( plugin.rename('_frame-iconfont.scss') )
            .pipe( gulp.dest(config.scss.dirSource +'/') );
    }

    return gulp.src(config.icons.dirSource +'/*.svg')
        .pipe( plugin.plumber({ errorHandler: plugin.notify.onError(config.notifyError) }) )
        .pipe( plugin.iconfont(config.iconfont) ).on('codepoints', handleIconfontCodepoints)
        .pipe( plugin.size({ showFiles: true }) )
        .pipe( gulp.dest(config.fonts.dirOutput) )

        // minify generated .svg icon font file
        .pipe( plugin.filter('*.svg') )
        .pipe( plugin.imagemin(config.imagemin) )
        .pipe( plugin.size({ showFiles: true }) )
        .pipe( gulp.dest(config.fonts.dirOutput) )
});
