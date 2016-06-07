$(document).ready(function () {
    $('a#addnewemployee').on('click', createEmployee);
    $('a#addnewrepresentative').on('click', createRepresentative);
    $('a#changePosition').on('click', changePosition);
    $('a#getProfileLink').on('click', showAndSendLink);
    $('table#employeeList tbody').on('click', 'td a.linkupgrade', upgradeEmployee);
    $('table#repList tbody').on('click', 'td a.linkdowngrade', downgradeEmployee);
});

// create representative
function createRepresentative() {
    swal({
            title: 'Adding a new Representative',
            html: '<div class="row">' +
                '<form class="col s12">' +
                '<div class="row">' +
                '<div class="input-field col s6">' +
                '<input id="repFullname" type="text" class="validate">' +
                '<label for="repFullname">Fullname</label>' +
                '</div>' +
                '<div class="input-field col s6">' +
                '<input id="repPoste" type="text" class="validate">' +
                '<label for="repPoste">Poste</label>' +
                '</div>' +
                '</div>' +
                '<div class="row">' +
                '<div class="input-field col s12">' +
                '<input id="email" type="email" class="validate">' +
                '<label for="email">Email</label>' +
                '</div>' +
                '</div>' +
                '<div id="repError"></div>' +
                '</form>' +
                '</div>',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Add employee',
            cancelButtonText: 'Cancel',
            confirmButtonClass: 'confirm-class',
            cancelButtonClass: 'cancel-class',
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function (isConfirm) {
            document.getElementById('repError').innerHTML = "";
            swal.disableButtons();
            var newRepresentative = {
                Mail: $('input#email').val(),
                position: $('input#repPoste').val(),
                fullname: $('input#repFullname').val()
            };
            // use data here
            // send ajax
            if (isConfirm) {
                if (!validateData(newRepresentative.mail, "mail")) {
                    generateError('repError', "<b>DATA ERROR:</b> invalid eMail");
                } else if (!validateData(newRepresentative.fullname, "fullname")) {
                    generateError('repError', "<b>DATA ERROR:</b> invalid Full name");
                } else {
                    addElement(newRepresentative, "representatives");
                }

            } else {
                generateswal("Cancel", "You canceled the action", 'warning', true);
            }
        });
}

// create employee
function createEmployee() {
    swal({
            title: 'Adding a new employee',
            html: '<div class="row">' +
                '<form class="col s12">' +
                '<div class="row">' +
                '<div class="input-field col s6">' +
                '<input id="cin" type="text" class="validate">' +
                '<label for="cin">CIN</label>' +
                '</div>' +
                '<div class="input-field col s6">' +
                '<input id="employeePoste" type="text" class="validate">' +
                '<label for="employeePoste">Poste</label>' +
                '</div>' +
                '</div>' +
                '<div class="row">' +
                '<div class="input-field col s6">' +
                '<input id="employeeName" type="text" class="validate">' +
                '<label for="employeeName">Name</label>' +
                '</div>' +
                '<div class="input-field col s6">' +
                '<input id="employeeFirstname" type="text" class="validate">' +
                '<label for="employeeFirstname">Firstname</label>' +
                '</div>' +
                '</div>' +
                '<div class="row">' +
                '<div class="input-field col s12">' +
                '<input id="email" type="email" class="validate">' +
                '<label for="email">Email</label>' +
                '</div>' +
                '</div>' +
                '<div id="newEmployeeError"></div>' +
                '</form>' +
                '</div>',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Add employee',
            cancelButtonText: 'Cancel',
            confirmButtonClass: 'confirm-class',
            cancelButtonClass: 'cancel-class',
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function (isConfirm) {
            document.getElementById('newEmployeeError').innerHTML = "";
            swal.disableButtons();
            var newEmployee = {
                Cin: $('input#cin').val(),
                Mail: $('input#email').val(),
                Name: $('input#employeeName').val(),
                Firstname: $('input#employeeFirstname').val(),
                position: $('input#employeePoste').val(),
                username: $('input#cin').val()
            };
            // use data here
            // send ajax
            if (isConfirm) {
                if (!validateData(newEmployee.Mail, "mail")) {
                    generateError('newEmployeeError', "<b>DATA ERROR:</b> invalid eMail");
                } else if (!validateData(newEmployee.username, "username")) {
                    generateError('newEmployeeError', "<b>DATA ERROR:</b> invalid CIN");
                } else {
                    addElement(newEmployee, "employee");
                }

            } else {
                generateswal("Cancel", "You canceled the action", 'warning', true);
            }
        });
}

// check data
function validateData(textVal, type) {
    var mail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2,})?)$/i;
    var username = /^([0-9]{4,})$/i;
    var fullname = /^[0-9a-zA-Z ]+$/;

    switch (type) {
        case "mail":
            return mail.test(textVal);
            break;
        case "username":
            return username.test(textVal);
            break;
        case "fullname":
            return fullname.test(textVal);
            break;
    }
}

// generate alert
function generateswal(titleVal, textVal, typeVal, html, alive) {
    /*
    html is boolean:
    if true the text will be an innerHTML
    for 
    */
    if (alive < 1000 || alive == null || alive == undefined || alive > 10000) {
        alive = 2000;
        console.log("alive value should be between [1000, 10000]");
    }
    if (html) {
        swal({
            title: titleVal,
            html: textVal,
            type: typeVal,
            timer: alive
        });
    } else {
        swal({
            title: titleVal,
            text: textVal,
            type: typeVal,
            timer: alive
        });
    }
}

// generate error
function generateError(zoneId, errorText) {
    document.getElementById(zoneId).innerHTML = errorText;
    swal.enableButtons();
}

// add element to base
function addElement(element, type) {
    element.type = type;
    var corpName = $('input#name').val();
    $.ajax({
        type: 'POST',
        data: element,
        url: '/employee/addEmployee/' + corpName,
        dataType: 'JSON'
    }).success(function (response) {
        // Check for successful (blank) response
        if (response.msg == '') {
            generateswal("Success", "<h2>Congratulation</h2></br>You have a new employee", 'success', true);
            loadEmployeeList();
        } else {
            // If something goes wrong, alert the error message that our service returned
            generateError('newEmployeeError', "<h2>YOU</h2></br>" + response.msg);
        }
    });
}

// upgrade an employee to representative
function upgradeEmployee(event) {
    /*
    to upgrade an employee to representatives
    - change type to "representatives"
    - add field fullname => name + firstname
    */

    // Prevent Link from Firing
    event.preventDefault();


    // Retrieve rep fullname from link rel attribute
    var thisEmployee = $(this).attr('rel');
    // Get Index of object based on id value

    var arrayPosition = employeeTable.map(function (arrayItem) {
        return arrayItem.username;
    }).indexOf(thisEmployee);

    // Get our representant Object
    var thisEmployeeObject = employeeTable[arrayPosition];

    var corpName = $('input#name').val();

    var sendData = {
        key: corpName,
        data: thisEmployeeObject
    };

    $.ajax({
        type: 'POST',
        data: sendData,
        url: '/employee/upgrade/' + corpName,
        dataType: 'JSON'
    }).success(function (response) {
        // Check for successful (blank) response
        if (response.msg == '') {
            generateswal("Success", "<h2>Promotion</h2></br>You have a new representative", 'success', true);
            loadEmployeeList();
        } else {
            // If something goes wrong, alert the error message that our service returned
            generateError('ERROR', "<h2>DATA ERROR</h2></br>" + response.msg);
        }
    });


};

// downgrade an representative to employe
function downgradeEmployee(event) {

    // Prevent Link from Firing
    event.preventDefault();


    // Retrieve rep fullname from link rel attribute
    var thisEmployee = $(this).attr('rel');
    // Get Index of object based on id value

    var arrayPosition = repTable.map(function (arrayItem) {
        return arrayItem.username;
    }).indexOf(thisEmployee);

    // Get our representant Object
    var thisEmployeeObject = repTable[arrayPosition];

    var corpName = $('input#name').val();

    var sendData = {
        key: corpName,
        data: thisEmployeeObject
    };

    $.ajax({
        type: 'POST',
        data: sendData,
        url: '/employee/downgrade/' + corpName,
        dataType: 'JSON'
    }).success(function (response) {
        // Check for successful (blank) response
        if (response.msg == '') {
            generateswal("Success", "<h2>Downgrade</h2></br>The representative is sent to employee", 'warning', true);
            loadEmployeeList();
        } else {
            // If something goes wrong, alert the error message that our service returned
            generateError('ERROR', "<h2>DATA ERROR</h2></br>" + response.msg);
        }
    });


};


// get the profile link and send the link in mail
function showAndSendLink() {
    swal({
            title: 'Profile link',
            html: '<div>' +
                '<h3>Clic or copy/paste the link bellow to access to the user profile :</h3>' +
                '<a href="' + currentLink + '">' + currentLink + '</a>' +
                '</div>',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Send to employee',
            cancelButtonText: 'Finish',
            confirmButtonClass: 'confirm-class',
            cancelButtonClass: 'cancel-class',
            closeOnConfirm: false
        },
        function (isConfirm) {
            swal.disableButtons();
            // use data here
            // send ajax
            if (isConfirm) {
                var mailOption = {
                    subject: "PROFILE ACCESS LINK",
                    text: currentLink,
                    html: '<p>Clic or copy/paste the link bellow to access to the user profile :</p>' +
                        '<a href="' + currentLink + '">' + currentLink + '</a>'
                };
                mailOption.To = currentEmployee.Mail;
                sendMail(mailOption);
            } else {
                generateswal("Done", "Please save that link for further usage", 'warning', true);
            }
        });
}


// sendMail
function sendMail(mailOptions) {
    $.ajax({
        type: 'POST',
        data: mailOptions,
        url: '/mail/sendVerification',
        dataType: 'JSON'
    }).success(function (response) {
        // Check for successful (blank) response
        if (response.msg == '') {
            generateswal("Success", "Mail sent", 'success', true);
            loadEmployeeList();
        } else {
            // If something goes wrong, alert the error message that our service returned
            generateError('SENDING ERROR', "Mail not sent");
        }
    });
}


// change employee position
function changePosition() {
    swal({
            title: 'Change Employee position',
            html: '<div class="row">' +
                '<form class="col s12">' +
                '<div class="row">' +
                '<div class="input-field col s12">' +
                '<input id="newPosition" type="text" class="validate">' +
                '<label for="newPosition">Position</label>' +
                '</div>' +
                '</div>' +
                '<div id="newEmployeeError"></div>' +
                '</form>' +
                '</div>',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Change',
            cancelButtonText: 'Cancel',
            confirmButtonClass: 'confirm-class',
            cancelButtonClass: 'cancel-class',
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function (isConfirm) {
            document.getElementById('newEmployeeError').innerHTML = "";
            swal.disableButtons();
            var bruteData = {
                key: currentEmployee,
                data: {
                    position: $('input#newPosition').val()
                }
            };
            // use data here
            // send ajax
            if (isConfirm) {
                var corpName =  $('input#name').val();
                $.ajax({
                    type: 'POST',
                    data: bruteData,
                    url: '/employee/changePosition/' + corpName,
                    dataType: 'JSON'
                }).success(function (response) {
                    // Check for successful (blank) response
                    if (response.msg == '') {
                        generateswal("Success", "<h2>Change position</h2></br>you have assign the current employee to a new position", 'warning', true);
                        loadEmployeeList();
                    } else {
                        // If something goes wrong, alert the error message that our service returned
                        generateError('ERROR', "<h2>DATA ERROR</h2></br>" + response.msg);
                    }
                });

            } else {
                generateswal("Cancel", "You canceled the action", 'warning', true);
            }
        });
}