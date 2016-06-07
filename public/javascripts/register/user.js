var mailValidation = false;
// DOM Ready =============================================================
$(document).ready(function () {
    $('a#verifyMail').on('click', sendMail); // verify the phone number
    $('a#registerUser').on('click', register); // register
});


// Functions =============================================================

// Send verification SMS
function sendMail() {
    var userName = document.getElementById('inputUserName');
    // Email options: mail content
    var verificationMail = {
        to: $('input#inputUserMail').val(),
        subject: "[LOCALIZATION]Verification",
        text: "This is just a verification Mail for " + userName.value,
        html: "This is just a verification Mail for " + userName.value
    };
    // Send mail request
    $.ajax({
        type: 'POST',
        data: verificationMail,
        url: '/mail/sendVerification',
        dataType: 'JSON'
    }).success(function (response) {
        // Check for successful (blank) response
        if (response.msg === '') {
            Materialize.toast('Mail sent to ' + $('input#inputUserMail').val(), 4000, 'rounded');
            mailValidation = true;
        } else {
            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.msg);
        }
    });

}

// Register the user
function register() {
    if (mailValidation) {
        var newUser = {
            username: $('input#inputUserName').val(),
            email: $('input#inputUserMail').val()
        };
        // Send mail request
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/registration',
            dataType: 'JSON'
        }).success(function (response) {
            // Check for successful (blank) response
            if (response.msg == '') {
                Materialize.toast('Registration complete', 4000,'rounded');
                window.location = response.redirect;
            } else {
                // If something goes wrong, alert the error message that our service returned
                Materialize.toast('Error: ' + response.msg, 4000, 'rounded');
            }
        });
    } else {
        Materialize.toast('PLEASE VALIDATE THE MAIL PLEASE', 4000, 'rounded');
    }
}