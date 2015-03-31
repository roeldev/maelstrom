var Maelstrom  = require('./lib/index.js'),
    Gulp       = require('gulp')
    GulpJsHint = require('gulp-jshint'),
    GulpSize   = require('gulp-size'),
    Delete     = require('del'),

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

Maelstrom.useTask('sass');
Maelstrom.useTask('images');

//------------------------------------------------------------------------------

Gulp.task('default', function(){ Maelstrom.utils.isDev(); });

Gulp.task('test:sass', function()
{
    console.log('src: '+ Maelstrom.sass.src());
    console.log('dest: '+ Maelstrom.sass.dest());
    console.log('stream '+ Maelstrom.sass('libsass'));

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
    console.log('src: '+ Maelstrom.images.src());
    console.log('dest: '+ Maelstrom.images.dest());
    console.log('stream '+ Maelstrom.images());

    Delete(Maelstrom.sass.dest() +'/*.*');

    Gulp.src( Maelstrom.images.src() )
        .pipe( Maelstrom.plumber() )
        .pipe( Maelstrom.images() )
        .pipe( GulpSize({ 'showFiles': true }) )
        .pipe( Gulp.dest(Maelstrom.images.dest()) );
});

Gulp.task('watch:tests', function()
{
    Gulp.watch('tests/input/*.scss', ['test:sass']);

    Maelstrom.watch('sass');
});

//------------------------------------------------------------------------------

Gulp.task('jshint', function()
{
    Gulp.src('lib/**/*.js')
        .pipe( Maelstrom.plumber() )
        .pipe( GulpJsHint() )
        .pipe( GulpJsHint.reporter('jshint-stylish') )
        .pipe( GulpJsHint.reporter('fail') );
});

Gulp.task('watch', function()
{
    Gulp.watch('lib/**/*.js', ['jshint']);
});
