var basicInfo = false;
// DOM Ready =============================================================
$(document).ready(function () {
    $('a#saveinfo').on('click', start); // Save general info
    $('a#confirm').on('click', redirect); // Save general info
    $('a#sendImage').on('click', uploadbanner); // Save general info
});


//------------------------------- SAVE BASIC INFO ------------------------ //
function start() {
    //Basics info variables
    var newCorp = {
            userid: $('input#userid').val(),
            corpName: $('input#name').val(),
            corpAdress: $('input#adress').val(),
            corpLocation: $('input#position').val(),
            corpDescription: $('textarea#description').val()
        }
        // Send mail request
    $.ajax({
        type: 'POST',
        data: newCorp,
        url: '/request/addnewcorp',
        dataType: 'JSON'
    }).success(function (response) {
        // Check for successful (blank) response
        if (response.msg == '') {
            Materialize.toast('Info added to data base', 4000, 'rounded');
            basicInfo = true;
        } else {
            // If something goes wrong, alert the error message that our service returned
            Materialize.toast(response.msg, 4000);
        }
    });
};

function redirect() {
    if(basicInfo){
        Materialize.toast('You need to reconnect', 1000, 'rounded');
        window.location.href = "../../../../login";
    }else{
        Materialize.toast("Please first fill basic information", 4000, 'rounded');
    }
}