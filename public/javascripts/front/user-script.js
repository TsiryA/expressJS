var myFrame = {};
$(document).ready(function () {
    $('a#editProfil').on('click', editProfil);
    $('a#logout').on('click', logout);
    $('a#sendMessage').on('click', sendMessage);
    $('a#takepic').on('click', sendPhotos);
    $('img#profilepic').on('click', profilepic);
    $('a#saveGeneralInfo').on('click', saveGleInfo);
    $('a#saveDetail').on('click', saveDetailInfo);
    $('a#contact').on('click', saveContactInfo);
    // internal message
    //$('a.mdi-action-note-add').on('click', privateMail);
    $('button#submit-send-Files').on('click', savedocuments);
});

//LOGOUT FUNCTION
function logout() {
    Materialize.toast('You are login out', 4000);
    window.location = "/";
};


//SHOW LIGHT BOX FOR EDIT PROFILE
function editProfil() {
    openbox(1, 'shadowing', 'box');
}

//SEND MESSAGES
function sendMessage() {
    var messageContent = $('textarea#messageToAdmin').val();
    if (messageContent == null || messageContent == '') {
        messageContent = "please write something";
    }
    Materialize.toast(messageContent, 4000);
    $('textarea#messageToAdmin').val('');
}

function saveGleInfo() {
    var first_name = $('input#first_name').val();
    var last_name = $('input#last_name').val();
    var marital_status = $('input#marital_status').val();
    var gender = $('input#gender').val();
    var fullname = last_name.toUpperCase() + " " + first_name.toLocaleUpperCase();
    var newdata = {
        "employee.$.Name": last_name, 
        "employee.$.Firstname": first_name, 
        "employee.$.Status": marital_status, 
        "employee.$.Gender": gender, 
        "employee.$.fullname": fullname, 
    };
    
    var corp = $('input#corp-name').val();
    updateData(accessKey, newdata, corp);
    accessKey.Name = last_name;
    accessKey.Firstname = first_name;
    accessKey.Gender = gender;
    accessKey.Status = marital_status;
    accessKey.fullname = fullname;

}

function saveDetailInfo() {
    var children = $('input#children').val();
    var dateOfBirth = $('input#dateOfBirth').val();
    var placeOfBirth = $('input#placeOfBirth').val();
    var nationality = $('input#nationality').val();
    var newdata = {
        "employee.$.DateOfBirth": dateOfBirth, 
        "employee.$.PlaceOfBirth": placeOfBirth, 
        "employee.$.Nationality": nationality, 
        "employee.$.Children": children 
    };
    
    var corp = $('input#corp-name').val();
    updateData(accessKey, newdata, corp);
    accessKey.DateOfBirth = dateOfBirth;
    accessKey.PlaceOfBirth = placeOfBirth;
    accessKey.Nationality = nationality;
    accessKey.Children = children;
}

function saveContactInfo() {
    var home = $('input#adress1').val();
    var secondary = $('input#adress2').val();
    var cin = $('input#user-cin').val();
    var mail = $('input#user-mail').val();
    var newdata = {
        "employee.$.Mail": mail, 
        "employee.$.Adress1": home, 
        "employee.$.Adress2": secondary, 
        "employee.$.Cin": cin 
    };
    
    var corp = $('input#corp-name').val();
    updateData(accessKey, newdata, corp);
    accessKey.Mail = mail;
    accessKey.Adress1 = home;
    accessKey.Adress2 = secondary;
    accessKey.Cin = cin;
}

function sendPhotos() {
    swal({
            html: '<div id="wrapper">' +
                '<iframe src="../../../photo.html" width="800px" scrolling="no" height="360px" style="overflow: hidden;" frameborder="0"></iframe>' +
                '</div>',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Send',
            cancelButtonText: 'Cancel',
            confirmButtonClass: 'confirm-class',
            cancelButtonClass: 'cancel-class',
            closeOnConfirm: false,
        },
        function (isConfirm) {
            swal.disableButtons();
            var imageContent = myFrame.shootArray;
            if (isConfirm) {
                if (imageContent.length != 0) {
                    swal.enableButtons();
                    //console.log(JSON.stringify(imageContent));
                } else {
                    alert("Take at least 1 picture");
                    swal.enableButtons();
                }

            } else {
                swal.enableButtons();
            }
        });
    var content = document.querySelectorAll(".sweet-alert");
    content[0].style.width = "720px";
    content[0].style.height = "470px";
    content[0].style["margin-left"] = "-408px";
    myFrame = window.frames[0].window;
}

function profilepic() {
    swal({
            html: '<div id="wrapper">' +
                '<iframe src="../../../photo.html" width="800px" scrolling="no" height="360px" style="overflow: hidden;" frameborder="0"></iframe>' +
                '</div>',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Send',
            cancelButtonText: 'Cancel',
            confirmButtonClass: 'confirm-class',
            cancelButtonClass: 'cancel-class',
            closeOnConfirm: false,
        },
        function (isConfirm) {
            swal.disableButtons();
            var imageContent = myFrame.selectionData();
            if (isConfirm) {
                if (imageContent.length !=0) {
                    if(imageContent.length == 1){
                        var imageProfile = document.querySelectorAll('img#profilepic')[0];
                        imageProfile.src = imageContent[0];
                        imageProfile.style.width = "150px";
                        imageProfile.style.height = "150px";
                        var element = document.querySelectorAll(".profile-pic"); // querySelectorAll does not return array prototype
                        // this itteration can only used once
                        [].forEach.call(element, function(element){
                            element.src = imageContent[0];
                            element.style.height = "150%";
                        });
                        var imageProfile = {
                            "employee.$.profileImage": imageContent[0]
                        };
                        // send element
                        var corp = $('input#corp-name').val();
                        updateData(accessKey, imageProfile, corp);
                        accessKey.profileImage = imageContent[0];
                    }else{
                        swal({
                            title: 'IMAGE SELECTION',
                            text: 'Select only one pic.',
                            timer: 2000,
                            type: 'error',
                            showConfirmButton: false
                        });
                        setTimeout(function() {
                            profilepic();
                        }, 2500);
                    }
                } else {
                    swal({
                            title: 'INSTRUCTION',
                            html: '(This alert will redirect automaticaly)' +
                                '<ul class="instructions">' +
                                '<li>edit camera</li>' +
                                '<li>take a picture (at least)</li>' +
                                '<li>Select one picture</li>' +
                                '<li>Send the picture to become the profile picture</li>' +
                                '</ul>',
                            timer: 6000,
                            type: 'error',
                            showConfirmButton: false
                        });
                        setTimeout(function() {
                            profilepic();
                        }, 6500);
                }

            } else {
                generateswal("Cancel", "You canceled the action", 'warning', true);
            }
        });
    var content = document.querySelectorAll(".sweet-alert");
    content[0].style.width = "720px";
    content[0].style.height = "470px";
    content[0].style["margin-left"] = "-408px";
    myFrame = window.frames[0].window;
    
}

function savedocuments(){
    // we need to gather the text data
    var fileObjectArray = [];
    fileArray.forEach(function (elt, index) {
        fileObjectArray.push(fileToObject(elt));
    });
    var newEnrty = {
        title: $('input#pack-title').val(),
        description: $('textarea#pack-comment').val(),
        files: fileObjectArray
    };
    var corp = $('input#corp-name').val();
    addDocuments(accessKey, newEnrty, corp);  
    
}

/*
function privateMail(){
    swal({
            html: '<div>' +
            '<input type="text" id="sendTo"/>' +
            '</div>' +
            '<div>' +
            '<input type="text" id="message"/>' +
            '</div>',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Send',
            cancelButtonText: 'Cancel',
            confirmButtonClass: 'confirm-class',
            cancelButtonClass: 'cancel-class',
            closeOnConfirm: false,
        },
        function (isConfirm) {
            swal.disableButtons();
        });    
}
*/


function updateData(key, obj, corpName) {
    var sendData = {
        key: key,
        data: obj
    };
    // this ajax is used to update data
    $.ajax({
        type: 'POST',
        data: sendData,
        url: '/employee/update/' + corpName, // root to retreive employee data
        dataType: 'JSON'
    }).success(function (response) {
        // Check for successful (blank) response
        swal({
            title: 'Success',
            text: 'profile updated',
            timer: 3000,
            type: 'success',
            showConfirmButton: false
        });
    });
}

function addDocuments(key, obj, corpName) {
    var sendData = {
        key: key,
        documentnewEnrty: obj
    };
    // this ajax is used to update data
    $.ajax({
        type: 'POST',
        data: sendData,
        url: '/employee/addDocuments/' + corpName, // root to retreive employee data
        dataType: 'JSON'
    }).success(function () {
        // Check for successful (blank) response
        swal({
            title: 'Success',
            text: 'Document added',
            timer: 3000,
            type: 'success',
            showConfirmButton: false
        });
        closebox('send-shadowing', 'send-box');
    });
}



// ================= READING FILE ======================= //
function fileToObject(file) {
    var reader = new FileReader();
    var fileObject = {};
    fileObject = {
            name: file.file.name,
            size: file.file.size,
            type: file.file.type,
            data: file.content
    };
    return fileObject;
}
