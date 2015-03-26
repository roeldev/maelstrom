/**
 * Maelstrom | lib/templates/iconfront-frame.js
 * file version: 0.00.001
 */
@import '<%= bowerDir %>/frame-scss/source/fontastic';

@include add-iconfont('<%= fontName %>', '<%= className %>', '<%= fontPath %>')
{
<% _.each(glyphs, function(glyph) { %>
    .<%= className %>-<%= glyph.name %>:before
    {
        content: '\<%= glyph.codepoint.toString(16).toUpperCase() %>'
    }
<% }); %>
}
