@import '<%= importFile %>';

// scss-lint:disable all
@include iconfont('<%= fontName %>', '<%= className %>', '<%= fontPath %>')
{
    <% _.each(glyphs, function(glyph) { %>

        %<%= glyph.className %>
        {
            content: '\<%= glyph.content %>' !important;
        }
        .<%= glyph.className %>:before
        {
            @extend %<%= glyph.className %>;
        }

    <% }); %>
}
// scss-lint:enable
