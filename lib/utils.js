/**
 * Maelstrom | lib/utils.js
 * file version: 0.00.001
 */
'use strict';

module.exports =
{
    /**
     * Pipe an array of streams to the first stream.
     *
     * @param  {Array} $streams - Array of streams.
     * @return {Object} A stream.
     */
    'pipeStreams': function($streams)
    {
        var $stream = $streams[0];
        for(var $i = 1; $i < $streams.length; $i++)
        {
            $stream.pipe($streams[$i]);
        }
        return $stream;
    }
}
