<% _.each(glyphs, function(glyph) { %>
    .<%= className %>-<%= glyph.name %>:before
    {
        content: '\<%= glyph.codepoint.toString(16).toUpperCase() %>'
    }
<% }); %>
