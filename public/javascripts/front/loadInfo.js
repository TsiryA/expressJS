//insert all employee data
var employeeTable = [];
var accessKey = {};
var localDocStorage = [];
$(document).ready(function () {
    request(); // Load user additional info
    $('div.sweet-container').on('click', request);
});


// ============================================ CUSTOM PROMPT ================================== //

// Get access
function request() {
    
    swal({
            title: 'User profile page',
            html: '<div class="row">' +
                '<form class="col s12">' +
                '<div class="row">' +
                '<div class="input-field col s12">' +
                '<input id="password" type="password" class="validate">' +
                '<label for="password">Password</label>' +
                '</div>' +
                '</div>' +
                '<div id="noinput"></div>' +
                '</form>' +
                '</div>',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Login',
            cancelButtonText: 'Cancel',
            confirmButtonClass: 'confirm-class',
            cancelButtonClass: 'cancel-class',
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function (isConfirm) {
        document.getElementById('noinput').innerHTML = "";
            swal.disableButtons();
        var password = $('input#password').val();
            // use data here
            // send ajax
            if (isConfirm) {
                    if(password == ""){
                        generateError('noinput', "No input value");
                    }else if(password === undefined){
                        generateError('noinput', "No input value");
                    }else{
                        loadUserInfo(password);
                    }

            } else {
                generateswal("Cancel","You canceled the action",'warning', true);
                window.location = '/';
            }
        });
}

// ================================================= END ======================================= //

function loadUserInfo(pass) {
    var search = {
        corp: $('input#corpId').val(),
        code: $('input#emp').val(),
        salt: $('input#salt').val()
    };
    var cipherObject = CryptoJS.SHA256(pass + search.salt);
    var hash = cipherObject.toString(CryptoJS.enc.Base64);
    search.hash = hash;
    var result = "";
    $.ajax({
        type: 'POST',
        data: search,
        url: '/front/getEmployeeData', // root to retreive employee data
        dataType: 'JSON'
    }).success(function (response) {
        // Check for successful (blank) response
        accessKey = response.employee;
        if (response.msg == '' || response.msg === undefined) {
            //POPULATE ALL FIELD
            document.getElementById('data').innerHTML = '';
            document.getElementById('fullname1').innerHTML = response.employee.Name.toUpperCase() + " " + response.employee.Firstname;
            document.getElementById('poste1').innerHTML = response.employee.position;
            document.getElementById('viewFullname').innerHTML = document.getElementById('viewFullname').innerHTML + response.employee.Name.toUpperCase() + " " + response.employee.Firstname;
            document.getElementById('viewPosition').innerHTML = response.employee.position;
            document.getElementById('viewMail').innerHTML = response.employee.Mail;
            document.getElementById('viewDateOfBirth').innerHTML = response.employee.DateOfBirth;
            //EDIT PROFILE
            document.getElementById('first_name').value = response.employee.Firstname;
            document.getElementById('last_name').value = response.employee.Name;
            document.getElementById('marital_status').value = response.employee.Status;
            document.getElementById('gender').value = response.employee.Gender;
            document.getElementById('children').value = response.employee.Children;
            document.getElementById('dateOfBirth').value = response.employee.DateOfBirth;
            document.getElementById('placeOfBirth').value = response.employee.PlaceOfBirth;
            document.getElementById('nationality').value = response.employee.Nationality;
            document.getElementById('corp-poste').value = response.employee.position;
            document.getElementById('corp-name').value = response.corp;
            document.getElementById('adress1').value = response.employee.Adress1;
            document.getElementById('adress2').value = response.employee.Adress2;
            document.getElementById('user-cin').value = response.employee.Cin;
            document.getElementById('user-mail').value = response.employee.Mail;
            
            // ====================== DOC TEST ======================== //
            /*
            //console.log(JSON.stringify(response.employee.documents, null, 4));
            localDocStorage = response.employee.documents;
            var index = 0;
            localStorage.forEach(function(elt){
               var tableContent += "<tr>";
                tableContent += '<td>' + elt.title + '</td>';
                tableContent += '<td>' + elt.description + '</td>';
                tableContent += '<td><a href="#" class="linkshowFiles" rel="' + index + '">Show</a></td>';
                tableContent += '</tr>';
                index++;
            });
            $('.table-body table tbody').html(tableContent);
            // ======================================================== //
            */
            if(response.employee.profileImage != "" && response.employee.profileImage !== undefined){
                var imageProfile = document.querySelectorAll('img#profilepic')[0];
                        imageProfile.src = response.employee.profileImage;
                        imageProfile.style.width = "150px";
                        imageProfile.style.height = "150px";
                        var element = document.querySelectorAll(".profile-pic"); // querySelectorAll does not return array prototype
                        // this itteration can only used once
                        [].forEach.call(element, function(element){
                            element.src = response.employee.profileImage;
                            element.style.height = "150%";
                        });
            }

        } else {
            // If something goes wrong, alert the error message that our service returned
            result = response.msg;
        }
        var title;
        var description;
        var type;
            swal.disableButtons();
        if (result == "") {
            titleValue = "Access Granted";
            descriptionValue = "Welcome";
            type = "success";
        } else {
            titleValue = "ACCESS DENIED";
            descriptionValue = result;
            type = "error";
        }

        setTimeout(function () {
            swal({
                title: titleValue,
                text: descriptionValue,
                type: type,
                timer: 2000,
                showConfirmButton: false
            });
        }, 1000);


        if (type == "error") {
            setTimeout(function () {
                window.location.href = "/";
            }, 2000);
        };
    });

    return result;
}

// generate alert
function generateswal(titleVal, textVal, typeVal, html, alive) {
    /*
    html is boolean:
    if true the text will be an innerHTML
    for 
    */
    if(alive < 1000 || alive == null || alive == undefined || alive > 10000){
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

function generateError(zoneId, errorText){
    document.getElementById(zoneId).innerHTML = errorText;
    swal.enableButtons();
}