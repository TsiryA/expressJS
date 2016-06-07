// DOM Ready =============================================================

$(document).ready(function() {

    loadInfo();
    $('#btnModifyEmployee').on('click', modifyEmployee);
});

// Functions =============================================================

//Filling Position tables
function loadInfo() {

    // get user ID
    var id = $('span#idemployee').text();
    
    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/users/findemployeeById/' + id, function( data ) {
              
        // Stick our user data array into a formList variable in the global object
        var userVal = data[0];
        // For each item in our JSON, add a table row and cells to the content string
        $('#modifyEmployee fieldset input#inputUsername').val(userVal.username);
        $('#modifyEmployee fieldset input#inputName').val(userVal.Name);
        $('#modifyEmployee fieldset input#inputFirstname').val(userVal.Firstname);
        $('#modifyEmployee fieldset input#inputGender').val(userVal.Gender);
        $('#modifyEmployee fieldset input#inputStatus').val(userVal.Status);
        $('#modifyEmployee fieldset input#inputChildren').val(userVal.Children);
        $('#modifyEmployee fieldset input#inputDateOfBirth').val(userVal.DateOfBirth);
        $('#modifyEmployee fieldset input#inputPlaceOfBirth').val(userVal.PlaceOfBirth);
        $('#modifyEmployee fieldset input#inputNationality').val(userVal.Nationality);
        $('#modifyEmployee fieldset input#inputAdress1').val(userVal.Adress1);
        $('#modifyEmployee fieldset input#inputAdress2').val(userVal.Adress2);
        $('#modifyEmployee fieldset input#inputCin').val(userVal.Cin);
        $('#modifyEmployee fieldset input#inputMail').val(userVal.Mail);
        
    });
};

// Modify Employee
function modifyEmployee(event) {
    event.preventDefault();
    var employeeId = $('span#idemployee').text();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to modify your data?');
    
   if (confirmation === true) {

     // If they did, do our delete
        
        var upadteEmployee = {
            'username': $('#modifyEmployee fieldset input#inputUsername').val(),
            'Name': $('#modifyEmployee fieldset input#inputName').val(),
            'Firstname': $('#modifyEmployee fieldset input#inputFirstname').val(),
            'Gender': $('#modifyEmployee fieldset input#inputGender').val(),
            'Status': $('#modifyEmployee fieldset input#inputStatus').val(),
            'Children': $('#modifyEmployee fieldset input#inputChildren').val(),
            'DateOfBirth': $('#modifyEmployee fieldset input#inputDateOfBirth').val(),
            'PlaceOfBirth': $('#modifyEmployee fieldset input#inputPlaceOfBirth').val(),
            'Nationality': $('#modifyEmployee fieldset input#inputNationality').val(),
            'Adress1': $('#modifyEmployee fieldset input#inputAdress1').val(),
            'Adress2': $('#modifyEmployee fieldset input#inputAdress2').val(),
            'Cin': $('#modifyEmployee fieldset input#inputCin').val(),
            'Mail': $('#modifyEmployee fieldset input#inputMail').val()
        }
        
        $.ajax({
            type: 'PUT',
            data: upadteEmployee,
            url: '/users/modifyEmployee/' + employeeId
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
                ;
               
            }
            else {
                alert('Error: ' + response.msg);
            }
        }); 
    }
    else {

        // If they said no to the confirm, do nothing
        return false;
    }  
};
