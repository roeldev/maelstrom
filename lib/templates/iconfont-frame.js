@import '<%= bowerDir %>frame-scss/source/iconfont';

@include add-iconfont('<%= fontName %>', '<%= className %>', '<%= fontPath %>')
{
<% _.each(glyphs, function(glyph) { %>
    .<%= className %>-<%= glyph.name %>:before
    {
        content: '\<%= glyph.content %>';
    }
<% }); %>
}
