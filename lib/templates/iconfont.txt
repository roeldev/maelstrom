/**
 * Maelstrom | lib/templates/iconfront.js
 * file version: 0.00.001
 */
<% _.each(glyphs, function(glyph) { %>
    .<%= className %>-<%= glyph.name %>:before
    {
        content: '\<%= glyph.codepoint.toString(16).toUpperCase() %>'
    }
<% }); %>
