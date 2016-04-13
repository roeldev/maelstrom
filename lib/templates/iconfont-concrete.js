@import '<%= importFile %>';

// scss-lint:disable all
@include iconfont('<%= fontName %>', '<%= className %>', '<%= fontPath %>',
(
    <%= glyphs.flatMap.join(',\n\t') %>
));
// scss-lint:enable
