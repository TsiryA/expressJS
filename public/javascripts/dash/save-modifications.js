$(document).ready(function () {
    loadUserInfo(); // Load user additional info
    loadEmployeeList(); // All employee list
    // repname link click
    $('a#logout').on('click', logout);
    $('a#desactivateAccount').on('click', desactivateAccount);
    $('a#saveBasics').on('click', saveBasics);
    $('a#saveCorpInfo').on('click', saveCorpBasics);
    $('a#clearinternalAccess').on('click', clearHistory);
    $('table#employeeList tbody').on('click', 'td a.linkdeleteuser', deleteEmployee);
    $('table#repList tbody').on('click', 'td a.linkdelRep', deleteRep);
});

// this function is for log out, a simple redirection
function logout() {
    window.location = '/';
}


// desactivate the user account
function desactivateAccount() {
    var userid = $('input#userid').val();
    if (confirm("Are you sure to close your account?")) {
        $.getJSON('/users/close/' + userid, function (data) {

            // ALERT ACCOUNT CLOSED
            window.location = '/';

        });
    }
}

// user information modifications
function saveBasics(){
    
    var userid = $('input#userid').val();
    var newUser = {
      username: $('input#username').val(),
      email: $('input#useremail').val()
    };
    
    $.ajax({
        type: 'POST',
        data: newUser,
        url: '/users/saveChange/' + userid,
        dataType: 'JSON'
    }).success(function (response) {
        // Check for successful (blank) response
        if (response.msg == '') {
            Materialize.toast('All modification saved', 4000,'rounded');
        } else {
            // If something goes wrong, alert the error message that our service returned
            Materialize.toast('Error: ' + response.msg, 4000,'rounded');
        }
    });
}


// Corporation information modifications
function saveCorpBasics(){
    
    var userid = $('input#userid').val();
    var newCorp = {
      corpName: $('input#name').val(),
      corpDescription: $('textarea#description').val()
    };
    
    $.ajax({
        type: 'POST',
        data: newCorp,
        url: '/corporation/saveChange/' + userid,
        dataType: 'JSON'
    }).success(function (response) {
        // Check for successful (blank) response
        if (response.msg == '') {
            Materialize.toast('All modification saved', 4000,'rounded');
        } else {
            // If something goes wrong, alert the error message that our service returned
            Materialize.toast('Error: ' + response.msg, 4000,'rounded');
        }
    });
}


// Delete Employee
function deleteEmployee(event) {
    // Prevent Link from Firing
    event.preventDefault();
    
    // Retrieve rep fullname from link rel attribute
    var thisEmployee = $(this).attr('rel');
    // Get Index of object based on id value
    
    var arrayPosition = employeeTable.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisEmployee);
    
    // Get our representant Object
    var thisEmployeeObject = employeeTable[arrayPosition];
    var corpName = $('input#name').val();
    $.ajax({
        type: 'POST',
        data: thisEmployeeObject,
        url: '/employee/detach/' + corpName,
        dataType: 'JSON'
    }).success(function (response) {
        // Check for successful (blank) response
        if (response.msg == '') {
            Materialize.toast('Employee removed', 4000,'rounded');
        } else {
            // If something goes wrong, alert the error message that our service returned
            Materialize.toast('Error: ' + response.msg, 4000,'rounded');
        }
    });
    // this function is in the loadInfo.js
    loadEmployeeList();
};


// Delete Representative
function deleteRep(event) {
    // Prevent Link from Firing
    event.preventDefault();
    
    // Retrieve rep fullname from link rel attribute
    var thisEmployee = $(this).attr('rel');
    // Get Index of object based on id value
    
    var arrayPosition = repTable.map(function(arrayItem) { return arrayItem.fullname; }).indexOf(thisEmployee);
    
    // Get our representant Object
    var thisEmployeeObject = repTable[arrayPosition];
    var corpName = $('input#name').val();
    $.ajax({
        type: 'POST',
        data: thisEmployeeObject,
        url: '/employee/detach/' + corpName,
        dataType: 'JSON'
    }).success(function (response) {
        // Check for successful (blank) response
        if (response.msg == '') {
            Materialize.toast('Employee removed', 4000,'rounded');
        } else {
            // If something goes wrong, alert the error message that our service returned
            Materialize.toast('Error: ' + response.msg, 4000,'rounded');
        }
    });
    // this function is in the loadInfo.js
    
    loadEmployeeList();
};



// clear history
function clearHistory() {
    var username = $('input#username').val();
    if (confirm("Are you sure to clear History?")) {
        $.getJSON('/history/clearhistory/' + username, function (data) {

            Materialize.toast('history cleared', 4000,'rounded');
            loadHistoryeList();

        });
    }
}