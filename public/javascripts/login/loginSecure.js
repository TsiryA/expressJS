function hash(salt, pass){
    return CryptoJS.SHA256(pass + salt);
};

// Send verification EMAIL
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
            Materialize.toast('Acces code sent to ' + $('input#login').val(), 4000,'rounded');
            //alert('Acces code sent to ' + $('input#login').val());
        } else {
            // If something goes wrong, alert the error message that our service returned
            Materialize.toast('Error: ' + response.msg, 4000,'rounded');
        }
    });
}


