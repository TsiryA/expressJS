$(function () {
    $('body').on('click', '.btn-float', function (event) {
        event.preventDefault();
        var ele = $(this);
        $(this).parent().addClass('open');
        $(this).addClass('slide');
        setTimeout(function () {
            ele.parent().siblings().fadeIn();
            setTimeout(function () {
                ele.parent().removeClass('open');
                ele.removeClass('slide');
            }, 500)
        }, 600);
    });

    $('body').on('click', '.close', function (event) {
        event.preventDefault();
        $(this).parent().fadeOut();
    });
});

function initialize() {
    var mapCanvas = document.getElementById('map');
    var mapOptions = {
        center: new google.maps.LatLng(44.5403, -78.5463),
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var map = new google.maps.Map(mapCanvas, mapOptions)
}
google.maps.event.addDomListener(window, 'load', initialize);