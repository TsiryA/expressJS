var $ = require('jquery-browserify');
require("../modules/mousewheel/jquery.mousewheel.js")($);


$(function () {
    $('#userAgent').html(navigator.userAgent);
    $('#jqueryVersion').html($.fn.jquery);

    var eventHandle = function (event, delta) {
        //var o = '', id = event.currentTarget.id || event.currentTarget.nodeName;

        o = '#' + id + ':';

        if (delta > 0)
            o += ' up (' + delta + ')';
        else if (delta < 0)
            closebox();
    };

    /*
    $(document)
        .mousewheel(function(event, delta) {
            eventHandle(event, delta);
        });
    */
    $('#box')
        .mousewheel(function (event, delta) {
            eventHandle(event, delta);
        });

    $('#shadowing')
        .mousewheel(function (event, delta) {
            eventHandle(event, delta);
        });
});