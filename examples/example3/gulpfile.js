var gulp      = require('gulp'),
    maelstrom = require('../../maelstrom-js/repositories/maelstrom-js_develop');

maelstrom.init(
{
    'output':
    {
        'css':    'css',
        'fonts':  'css/fonts',
        'images': 'images',
        'js':     'js'
    }
});

gulp.task('default', function()
{
    maelstrom.sass('test');
});

gulp.task('watch', function()
{
    maelstrom.browserSync.start();

    maelstrom.icons.watch(false, ['sass']);
    maelstrom.images.watch();
    maelstrom.sass.watch();
    maelstrom.pages.watch();
});

gulp.task('sass', function()
{
    return gulp.src(maelstrom.sass.src())
        .pipe(maelstrom.sass())
        .pipe(gulp.dest(maelstrom.sass.dest()));
        //.pipe(maelstrom.browserSync.reload({ stream: true }));
});
