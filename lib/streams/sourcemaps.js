/**
 * maelstrom | lib/streams/sourcemaps.js
 */
'use strict';

const GulpIf         = require('gulp-if');
const GulpSourceMaps = require('gulp-sourcemaps');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

module.exports = function($bool, $ok)
{
    let $stream = GulpIf(this.isDevMode() && $bool, GulpSourceMaps.init());

    $stream.pipe.call($stream, $ok());
    $stream.pipe( GulpIf(this.isDevMode() && $bool, GulpSourceMaps.write()) );

    return $stream;
};





/*.pipe( Maelstrom.stream('sourcemaps', $createSourceMaps,
    function()
    {
        return $plugin.stream('concat', [$destFile]);
    })
)*/
