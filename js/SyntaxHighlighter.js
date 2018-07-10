'use strict';

export function highlight(div) {
    var text = div.text();
    text = text.replace(/ArrayList/g, "<span class='class-name'>ArrayList</span>");
    text = text.replace(/List/g, "<span class='class-name'>List</span>");
    text = text.replace(/RSTile/g, "<span class='class-name'>RSTile</span>");
    text = text.replace(/RSArea/g, "<span class='class-name'>RSArea</span>");
    text = text.replace(/Arrays/g, "<span class='class-name'>Arrays</span>");
    text = text.replace(/new/g, "<span class='keyword'>new</span>");
    div.html(text);
}