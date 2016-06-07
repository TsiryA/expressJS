var limit = {
    width: 630,
    height: 215,
    number: 3
};

$("#bannerConfirm").on('click', savepics); // Send an acces code


function savepics(){
    var userid = $('input#userid').val();
    var data = {};
    data.key = {
            userid: $('input#userid').val(),
            corpName: $('input#name').val(),
            corpAdress: $('input#adress').val(),
            corpLocation: $('input#position').val(),
            corpDescription: $('textarea#description').val()
    };
    data.addinfo = {
      slider: imageArray
    };
    
    $.ajax({
        type: 'POST',
        data: data,
        url: '/corporation/slider',
        dataType: 'JSON'
    }).success(function (response) {
        // Check for successful (blank) response
        if (response.msg == '') {
            Materialize.toast('Slider images added', 4000,'rounded');
            closebox();
        } else {
            // If something goes wrong, alert the error message that our service returned
            Materialize.toast('Error: ' + response.msg, 4000,'rounded');
        }
    });
}