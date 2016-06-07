// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function () {
    $('#btnAddUser').on('click', addUser);
    $('#verifyMail').on('click', sendMail); // verify the phone number
});

// Functions =============================================================
// Add User
function addUser(event) {
    event.preventDefault();
    var valAcces1 = false;
    var valAcces2 = false;

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to add this user?');
    
    if (confirmation) {
        // Super basic validation - increase errorCount variable if any fields are blank
        var errorCount = 0;
        $('#addUser input').each(function (index, val) {
            if ($(this).val() === '') {
                errorCount++;
            }
        });
        // Check and make sure errorCount's still at zero
        if (errorCount === 0) {
        // If it is, compile all user info into one object
                var newUser = {
                    'username'      : $('input#inputUserName').val(),
                    'password'      : $('input#inputPass').val(),
                    'mail'          : $('input#inputUserMail').val(),
                    'lastname'      : $('input#inputLastName').val(),
                    'firstname'     : $('input#inputFirstName').val(),
                    'phone'         : $('input#inputPhone').val(),
                    'date'          : $('input#inputDate').val(),
                    'Corporation'   : $('input#inputUserCorp').val()
                }
                // Use AJAX to post the object to our adduser service
                $.ajax({
                    type: 'POST',
                    data: newUser,
                    url: '/users/adduser',
                    dataType: 'JSON'
                }).success(function (response) {
                    // Check for successful (blank) response
                    if (response.msg === '') {
                        // Clear the form inputs
                        window.location = "../";
                    } else {
                        // If something goes wrong, alert the error message that our service returned
                        alert('Error: ' + response.msg);
                    }
                });
        } else {
            // If errorCount is more than 0, error out
            alert('Please fill in all fields');
            return false;
        }
    } else {
        // If they said no to the confirm, do nothing
        return false;
    }
};
// generate unique code
function alphanumeric_unique() {
    return Math.random().toString(36).split('').filter( function(value, index, self) { 
        return self.indexOf(value) === index;
    }).join('').substr(2,8);
}
// Send verification SMS
function sendMail() {
    // generate value
    var verifVal = alphanumeric_unique();
    // send SMS "verifVal"
    var newMail = {
        to: $('input#inputUserMail').val(),
        subject: "Verification",
        text: "This is just a verification Mail",
        html: "This is just a verification Mail"
    };
    $.ajax({
        type: 'POST',
        data: newMail,
        url: '/sendingMail/sendVerification',
        dataType: 'JSON'
    }).success(function (response) {
        // Check for successful (blank) response
        if (response.msg === '') {
            alert('Mail sent to ' + $('input#inputUserMail').val());
        } else {
            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.msg);
        }
    });
}