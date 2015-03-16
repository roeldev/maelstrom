var $assetsDir = 'assets/',
    $publicDir = '',
    $tasksDir  = 'gulp_tasks/';

//------------------------------------------------------------------------------

module.exports =

require('maelstrom')
({
    assetsDir:    $assetsDir,
    publicDir:    $publicDir,
    tasksDir:     $tasksDir,
    templatesDir: $tasksDir +'templates',

    //--------------------------------------------------------------------------
    // Task variables
    //--------------------------------------------------------------------------
    scss:
    {
        dirSource: $assetsDir +'scss',
        dirOutput: $publicDir +'css'
    },

    icons:
    {
        dirSource: $assetsDir +'icons'
    },

    fonts:
    {
        dirOutput: $publicDir +'css/fonts',
    },

    imgs:
    {
        dirSource:    $assetsDir +'imgs',
        dirOutput:    $publicDir +'images',
        extensions:   ['jpg', 'jpeg', 'png', 'gif', 'svg']
    },

    pagespeed:
    {
        domain:   'casumar.com',
        strategy: 'mobile',
        // key:   'YOUR_API_KEY'
    },

    //--------------------------------------------------------------------------
    // Module settings
    //--------------------------------------------------------------------------
    autoprefixer:
    {
        browsers: ['last 4 version', 'safari 5', 'ie 8', 'ie 9', 'ff 17', 'opera 12.1', 'ios 6', 'android 4'],
        cascade:  false
    },

    imagemin:
    {
        progressive: true,
        interlaced:  true
    },

    iconfont:
    {
        fontName:           'mercato-italiano-icons',
        appendCodepoints:   true,
        normalize:          true,
        centerHorizontally: true,
        fixedWidth:         false,
        fontHeight:         18,
    },

    notifyError:
    {
        //title:   '',
        message: 'Error: <%= error.message %>',
        time:    8000,
        //icon:    '',
        wait:    false
    },

    browserSync:
    {
        proxy:  'localhost:8000',
        host:   '192.168.0.128',
        port:   80,
        files:  [$publicDir +'*.php', $publicDir +'css/*.css', $publicDir +'js/*.js', $publicDir +'images/**'],
        open:   false,
        ui:     false,
        notify: false
    }
});
