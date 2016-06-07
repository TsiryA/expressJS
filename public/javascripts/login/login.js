var userList = [];
var currentSalt;
// DOM Ready =============================================================
$(document).ready(function () {
    $('a#sendCode').on('click', sendCode); // Send an acces code
    $('a#confirmAccess').on('click', accesRequest); // Send an acces code
});


// Functions =============================================================

// Send verification SMS
function sendCode() {
    // Send mail request
    var newAcces = {
        username: $('input#login').val()
    };

    $.ajax({
        type: 'POST',
        data: newAcces,
        url: '/users/checkUser',
        dataType: 'JSON'
    }).success(function (response) {
        // Check for successful (blank) response
        if (response.msg === '') {
            currentSalt = response.salt;
            Materialize.toast('Acces code sent to ' + $('input#login').val(), 4000,'rounded');
            //alert('Acces code sent to ' + $('input#login').val());
        } else {
            // If something goes wrong, alert the error message that our service returned
            Materialize.toast('Error: ' + response.msg, 4000,'rounded');
        }
    });
}

// Send verification SMS
function accesRequest() {
    // Send mail request
    var passBrute = $('input#password').val();
    var cipherObject = CryptoJS.SHA256(passBrute + currentSalt);
    var hash = cipherObject.toString(CryptoJS.enc.Base64);
;    var testAcces = {
        username: $('input#login').val(),
        hash: hash
    };
    $.ajax({
        type: 'POST',
        data: testAcces,
        url: '/users/enterSite',
        dataType: 'JSON'
    }).success(function (response) {
        // Check for successful (blank) response
        if (response.msg == '') {
            window.location = response.redirect;
        } else {
            // If something goes wrong, alert the error message that our service returned
            Materialize.toast('Error: ' + response.msg, 4000,'rounded');
        }
    });
}