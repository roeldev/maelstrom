//------------------------------------------------------------------------------
// Import frame-sccs icon font related functions/mixins/partials.
//------------------------------------------------------------------------------
@import '<%= bowerDir %>/frame-scss/source/fontastic';

//------------------------------------------------------------------------------
// Define your font icons
//------------------------------------------------------------------------------
@include add-iconfont('<%= fontName %>', '<%= className %>', '<%= fontPath %>')
{
<% _.each(glyphs, function(glyph) { %>
    .<%= className %>-<%= glyph.name %>:before
    {
        content: '\<%= glyph.codepoint.toString(16).toUpperCase() %>'
    }
<% }); %>
}
