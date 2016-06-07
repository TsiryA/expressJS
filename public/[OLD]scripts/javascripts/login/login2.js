var loginVal = '';

$(document).ready(function () {
    $('#Login').on('click', accesToView);
});

// Getting Acces =============================================================
//validateing access
function accesToView(event) {
    event.preventDefault();
    location.href = '/users/loginAcces/' + $('span#inputUserName').text() + '/' + $('input#password').val();
};