/**
 * maelstrom | lib/config.js
 * file version: 0.00.004
 */
'use strict';
//console.log('require config.js');

// default config
module.exports =
{
    /**
     * Specify the default mode. This is either `dev` or `prod`.
     */
    'defaultMode': 'dev',

    /**
     * The main source or asssets folder. Note: starting the path with `./`
     * will not let you watch changes in the folder.
     */
    'dirSrc': 'assets/', // %src%

    /**
     * The main destination/output folder.
     */
    'dirDest': 'public/', // %dest%

    /**
     * Folders used by the plugin .src() functions.
     */
    'src':
    {
        'favicon': 'assets/favicon',
        'flags':   'assets/flags',
        'icons':   'assets/icons',
        'images':  'assets/imgs',
        'js':      'assets/js',
        'sass':    'assets/scss'
    },

    /**
     * Folders used by the plugin .dest() functions.
     */
    'dest':
    {
        'css':    'public/css',
        'fonts':  'public/fonts',
        'images': 'public/imgs',
        'js':     'public/js'
    },

    /**
     * A list of files/globs wich should trigger browser-sync to reload when
     * changed.
     */
    'browserSyncWatch':
    [
        'public/css/**/*',
        'public/fonts/**/*',
        'public/imgs/**/*',
        'public/js/**/*',
        'public/**/*.{html,php}'
    ],

    /**
     * A list of CSS wich will be combined to one file. The output file will be
     * autoprefixed, minified and saved to the `config.dest.css` folder.
     *
     * 'output-filename': ['file.css', '/to/concat/*.css']
     */
    'cssConcat': {},

    /**
     * A list of JS wich will be combined to one file. The output file will be
     * minified and saved to the `config.dest.js` folder.
     *
     * 'output-filename': ['file.js', '/to/concat/*.js']
     */
    'jsConcat': {},

    /**
     * Specify wich library should be used to compile the Sass files to CSS.
     * Available options are `libsass` (_gulp-sass_) and `ruby`
     * (_gulp-ruby-sass_). All output files will be autoprefixed by default.
     * When the `--dev` flag is not added, the files will also be minified.
     */
    'sassCompiler': 'libsass', // libsass|ruby

    /**
     * Image file extension wich should be optimized with _gulp-imagemin_.
     */
    'imageExtensions': ['jpg', 'jpeg', 'png', 'gif', 'svg'],

    /**
     * The name as what the output fonts or sprite will be saved.
     */
    'iconsOutputName': 'iconfont',

    /**
     * Specify how you would like to use SVG icons. Valid options are as a
     * `font` or `sprite`. Both options will create a Sass .scss file in the
     * `config.src.sass` folder, wich should be imported with `@import` in your
     * main Sass file.
     * Fonts files are written to `config.dest.fonts`, the sprite file to
     * `config.dest.images`. Any files with the same name will be overwritten.
     */
    'iconsType': 'font', // font|sprite

    //--------------------------------------------------------------------------
    // Node module settings
    //--------------------------------------------------------------------------
    'modules':
    {
        /**
         * gulp-autoprefixer: https://github.com/sindresorhus/gulp-autoprefixer
         */
        'autoprefixer':
        {
            'cascade':  false,
            'browsers': ['last 4 version']
        },

        /**
         * The `files` option is set from `config.browserSyncWatch`.
         * browser-sync: https://github.com/BrowserSync/browser-sync
         */
        'browserSync':
        {
            'proxy':  'localhost:8000',
            'port':   80,
            //'files':  [],
            'open':   false,
            'ui':     false,
            'notify': false
        },

        /**
         * The `fontName` option is set from `config.iconsOutputname`.
         * gulp-iconfont: https://github.com/nfroidure/gulp-iconfont
         */
        'iconfont':
        {
            //'fontName':           'iconfont',
            'appendCodepoints':   true,
            'normalize':          true,
            'centerHorizontally': true,
            'fixedWidth':         false,
            'fontHeight':         100
        },

        /**
         * gulp-imagemin: https://github.com/sindresorhus/gulp-imagemin
         */
        'imagemin':
        {
            'progressive': true,
            'interlaced':  true
        },

        /**
         * gulp-sass: https://github.com/dlmanning/gulp-sass
         */
        'libsass':
        {
            style:          'expanded',
            sourceComments: true
        },

        /**
         * gulp-notify: https://github.com/mikaelbr/gulp-notify
         */
        'notifyError':
        {
            'message': 'Error: <%= error.message %>',
            'time':    8000,
            'wait':    false
        },

        /**
         * gulp-size: https://github.com/sindresorhus/gulp-size
         */
        'size':
        {
            'showFiles': true
        }
    }
};