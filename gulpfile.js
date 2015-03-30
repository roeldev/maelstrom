var Maelstrom = require('./lib/index.js'),
    Gulp      = require('gulp')
    GulpSize  = require('gulp-size'),
    Delete    = require('del');

Maelstrom.init(Gulp,
{
    'src':
    {
        'images': './tests/input',
        'js':     './tests/input',
        'sass':   './tests/input'
    },

    'dest':
    {
        'images': './tests/output',
        'css':    './tests/output',
        'js':     './tests/output'
    },

    'cssConcat':
    {
        'vendor': './assets/bower_components/*/**.css',
        'base': './assets/bower_components/base-css/**/*.css'
    }
});

/*Maelstrom.extend('tests/custom-plugin.js');
Maelstrom.extend('customPlugin2', 'tests/custom-plugin.js');
Maelstrom.extend('customPlugin3', {});*/

//------------------------------------------------------------------------------

Gulp.task('default', function(){});

Gulp.task('test:sass', function()
{
    Delete(Maelstrom.sass.dest() +'/*.*');

    Gulp.src( Maelstrom.sass.src() )
        .pipe( Maelstrom.plumber() )
        .pipe( Maelstrom.sass() )
        //.pipe( Maelstrom.sass('ruby') )
        .pipe( GulpSize({ 'showFiles': true }) )
        .pipe( Gulp.dest(Maelstrom.sass.dest()) );
});

Gulp.task('test:imgs', function()
{
    Gulp.src( Maelstrom.images.src() )
        .pipe( Maelstrom.plumber() )
        .pipe( Maelstrom.images() ) // geen param = beide streams toevoegen
        //.pipe( Maelstrom.images('resize') ) // 'optimze'
        .pipe( Gulp.dest(Maelstrom.images.dest()) );
});

Gulp.task('watch:tests', function()
{
    Gulp.watch('tests/input/*.scss', ['test:sass']);

    Maelstrom.watch('sass');
});
