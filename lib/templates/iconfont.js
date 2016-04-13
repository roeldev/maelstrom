<% _.each(glyphs.list, function(glyph) { %>
    .<%= className %>-<%= glyph.name %>:before
    {
        content: '\<%= glyph.content %>' !important;
    }
<% }); %>
