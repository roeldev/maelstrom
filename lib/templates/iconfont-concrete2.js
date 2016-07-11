@import '<%= importFile %>';

// scss-lint:disable all
@include iconfont('<%= fontName %>', '<%= className %>', '<%= fontPath %>')
{
    <% _.each(glyphs.list, function(glyph) { %>
        @include iconfont-glyph('<%= className %>-<%= glyph.name %>', '<%= glyph.content %>');
    <% }); %>
}
// scss-lint:enable
