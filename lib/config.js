/**
 * maelstrom | lib/config.js
 * file version: 0.00.002
 */
'use strict';

/*

Task commands:
- sass (kiest adhv. config welke engine te gebuiken)
- sass-compile:libsass (compilen dmv. libsass)
- sass-compile:ruby (compilen dmv. ruby)

- images (optimaliseer alle afbeeldingen vanuit assets/imgs)
- image-optimize (optimaliseer losse afbeelding adhv. parameter)
- image-resize (verklein afbeelding adhv. parameter, sla verkleinde variant ook op in asset/imgs)

- iconfont

- watch (watch all)
- watch:assets (watch alle asset files)
- watch:public (watch alle public files -> browserSync)

*/

var $dirAssets = 'assets',
    $dirOutput = 'public';

// default config
module.exports =
{
    'src':
    {
        'favicon': $dirAssets +'/favicon',
        'flags':   $dirAssets +'/flags',
        'icons':   $dirAssets +'/icons',
        'images':  $dirAssets +'/imgs',
        'js':      $dirAssets +'/js',
        'sass':    $dirAssets +'/scss'
    },

    'dest':
    {
        'css':    $dirOutput +'/css',
        'fonts':  $dirOutput +'/fonts',
        'images': $dirOutput +'/imgs',
        'js':     $dirOutput +'/js'
    },

    //--------------------------------------------------------------------------
    // MODULES
    //--------------------------------------------------------------------------
    'css':
    {
        'autoprefixer':
        {
            'cascade':  false,
            'browsers': ['last 4 version']
        },

        'concatenate': {}
    },

    'sass':
    {
        'compiler': 'libsass', // libsass|ruby

        'libsass':
        {
            style:          'expanded',
            sourceComments: true
        }
    },

    //--------------------------------------------------------------------------

    'images':
    {
        'extensions': ['jpg', 'jpeg', 'png', 'gif', 'svg'],
        'imagemin':
        {
            'progressive': true,
            'interlaced':  true
        }
    },

    //--------------------------------------------------------------------------

    'icons':
    {
        'type': 'font', // font|sprite

        'iconfont':
        {
            'fontName':           'iconfont',
            'appendCodepoints':   true,
            'normalize':          true,
            'centerHorizontally': true,
            'fixedWidth':         false,
            'fontHeight':         18,
        }
    },

    //--------------------------------------------------------------------------

    'notify':
    {
        'error':
        {
            'message': 'Error: <%= error.message %>',
            'time':    8000,
            'wait':    false
        },
    },

    //--------------------------------------------------------------------------

    'browserSync':
    {
        'proxy':  'localhost:8000',
        'port':   80,
        'files':  [],
        'open':   false,
        'ui':     false,
        'notify': false,
    }
};
