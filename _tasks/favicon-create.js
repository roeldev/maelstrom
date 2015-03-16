var config = require('../gulpconfig.js'),
    gulp   = require('gulp'),
    plugin = require('gulp-load-plugins')();

//------------------------------------------------------------------------------

gulp.task('favicon-create', function()
{
    var $favicon = config.assetsDir +'/favicon/favicon.svg',
        $config  =
        {
            files:
            {
                src:
                {
                    'android':      $favicon,
                    'appleIcon':    $favicon,
                    'appleStartup': $favicon,
                    'coast':        $favicon,
                    'favicons':     $favicon,
                    'firefox':      $favicon,
                    'opengraph':    $favicon,
                    'windows':      $favicon,
                    'yandex':       $favicon
                },

                dest: '/imgs/',
                html: config.publicDir +'/index.html',
                iconsPath: 'imgs'
            },

            icons: {
                android: true,            // Create Android homescreen icon. `boolean`
                appleIcon: true,          // Create Apple touch icons. `boolean`
                appleStartup: true,       // Create Apple startup images. `boolean`
                coast: true,              // Create Opera Coast icon. `boolean`
                favicons: true,           // Create regular favicons. `boolean`
                firefox: true,            // Create Firefox OS icons. `boolean`
                opengraph: true,          // Create Facebook OpenGraph. `boolean`
                windows: true,            // Create Windows 8 tiles. `boolean`
                yandex: true              // Create Yandex browser icon. `boolean`
            },
            settings: {
                logging: true
            },
        };

    console.log($config);

    return gulp.src(config.publicDir +'/index.html')
        //.pipe( plugin.plumber({ errorHandler: plugin.notify.onError(config.notifyError) }) )
        .pipe( plugin.favicons($config) )
        .pipe( gulp.dest(config.publicDir) )
});
