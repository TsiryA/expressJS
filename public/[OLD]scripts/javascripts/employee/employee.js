// Userlist data array for filling in info box
var docListData = [];

// DOM Ready =============================================================



$(document).ready(function () {

    showEmployeeInfo();
    $('#docLits table tbody').on('click', 'td a.linkgeneratelink', generateTemporaryLink);
    $('#docLits table tbody').on('click', 'td a.resiliate', resiliation);
    $('#modifyInfo').on('click', modifyEmployee);
});

// Functions =============================================================

// Fill table with data
function populateDocTable() {

    // Empty content string
    var tableContent = '';
    var cinVal = $('span#cinVal').text();
    var level = $('span#level').text();

    // jQuery AJAX call for JSON
    $.getJSON('/documents/searchDoc/' + cinVal + '/' + level, function (data) {

        // Stick our user data array into a userlist variable in the global object
        docListData = data;
        if (data) {
            alert('No documents available');
        } else {
            // For each item in our JSON, add a table row and cells to the content string
            $.each(data, function () {
                tableContent += '<tr>';
                tableContent += '<td>' + this.template + '</a></td>';
                var date = new Date().setMilliseconds(this.Date);
                tableContent += '<td>' + new Date(date).toString() + '</td>';
                tableContent += '<td><a href="#" class="linkgeneratelink" rel="' + this._id + '">External link</a></td>';
                if (this.template == "Contract" && this.validity == 1) {
                    tableContent += '<td><a href="#" class="resiliate" rel="' + this._id + '">Resiliate now</a></td>';
                } else if (this.template == "Contract" && this.validity != 1) {
                    tableContent += '<td>terminated</td>';
                }
                tableContent += '</tr>';
            });
            // Inject the whole content string into our existing HTML table
            $('#docLits table tbody').html(tableContent);
        }
    });
};
// resiliation
function resiliation(event) {

    event.preventDefault();
    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to resiliate this contract?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'PUT',
            url: '/documents/modifyValidity/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateDocTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};
// Generate link
function generateTemporaryLink(event){
        event.preventDefault();
        var d = new Date();
        var createlinkDate = d.getTime();
        var expirationTime = d.getTime() + 3600000 ; // lien disponible pour 1 heure
        var contentDocTrans, thisDocumentCode;
        var destMail = prompt('insert here the destination mail (Default your mail)');
        if(!destmail){
            destMail = $('span#Mail').text();
        }
    // jQuery AJAX call for JSON
    $.getJSON( '/documents/searchDocById/' + $(this).attr('rel'), function( data ) {
        // Stick our user data array into a formList variable in the global object
        contentDocTrans = data[0].document;
        thisDocumentCode = data[0].documentCode;
        var combineValue = utf8_to_b64(thisDocumentCode + expirationTime.toString());
        var newExternalLink = {
                    "Date" : expirationTime,
                    "Mail" : destMail,
                    "Document" : contentDocTrans,
                    "Creation" : createlinkDate,
                    "AccesCode": combineValue,
                    "validity" : 1
            };    

            $.ajax({
                type: 'POST',
                data: newExternalLink,
                url: '/linking/addLink',
                dataType: 'JSON'
            }).success(function( response ) {

                // Check for successful (blank) response
                if (response.msg === '') {

                    // Clear the form inputs
                    alert('The document is stored'); // put the result link there
                }
                else {

                    // If something goes wrong, alert the error message that our service returned
                    alert('Error: ' + response.msg);

                }
            });
        });
    
}
// Show User Info
function showEmployeeInfo() {

    var userName = $('span#username').text();
    var level = $('span#level').text();
    // jQuery AJAX call for JSON
    $.getJSON('/users/findUser/' + level + '/' + userName , function (data) {
        var Fullname = data.Name + ' ' + data.Firstname;
        $('span#fullname').text(Fullname);
        $('span#Mail').text(data.Mail);
        $('span#cinVal').text(data.Cin);
        populateDocTable();
    });
};
// uploading files
function upfile(){
    $.getJSON('/users/findUser/' + level + '/' + userName , function (data) {
        var Fullname = data.Name + ' ' + data.Firstname;
        $('span#fullname').text(Fullname);
        $('span#Mail').text(data.Mail);
        $('span#cinVal').text(data.Cin);
    });
};
// modify data
function modifyEmployee(event) {
    event.preventDefault();
    location.href = '/users/modifEmployee/' + $('span#accesscode').text() + '/' + $('span#username').text();
};
