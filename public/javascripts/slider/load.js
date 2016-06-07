$(document).ready(function () {
    loadSlider();
});

function loadSlider() {
    //get elements detail
    // Empty content string
    var sliderContent = '<ul>';
    var data = {
        corpName: $('input#corpname').val(),
        corpLocation: $('input#corplocation').val()
    };

    // jQuery AJAX call for JSON
    
    $.ajax({
        type: 'POST',
        data: data,
        url: '/corporation/getslider',
        dataType: 'JSON'
    }).success(function (data) {
        $.each(data[0], function (i, element){
            sliderContent += '<li><a href="#"><img src="' + element + '"/></a></li>';
        });
        sliderContent += '</ul>';
        $('#cbp-fwslider').html(sliderContent);
        $('#cbp-fwslider').cbpFWSlider();
    });
};