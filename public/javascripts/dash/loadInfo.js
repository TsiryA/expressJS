var currentElement={};
//insert all employee data
var employeeTable = [];
var repTable = [];
var historyTable = [];
var currentLink = "";
var currentEmployee = {};

$(document).ready(function () {
    loadUserInfo(); // Load user additional info
    loadEmployeeList(); // All employee list
    loadHistoryeList(); // load history list
    // repname link click
    $('table#repList tbody').on('click', 'td a.linkshowRep', showRepInfo);
    $('table#employeeList tbody').on('click', 'td a.linkshowEmployee', showEmployeeInfo);
});

//---------------------- LOADING INFO ----------------------------//
// USER INFO
function loadUserInfo() {
    var usermail = document.getElementById('useremail');
    //get elements detail
    var userData = {
        username: $('input#username').val(),
        userid: $('input#userid').val()
    }

    //ajax to get user info
    $.ajax({
        type: 'POST',
        data: userData,
        url: '/users/getUserInfo',
        dataType: 'JSON'
    }).success(function (items) {
        // get info
        usermail.value = items[0].email;
    });
};

// EMPLOYEE LIST
function loadEmployeeList() {
    //get elements detail
    // Empty content string
    var tableContent = '';
    var table2Content = '';
    var userid = $('input#userid').val();
    var corpName = $('input#name').val();

    // jQuery AJAX call for JSON
    $.getJSON('/employee/findAll/' + userid, function (data) {
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data.employee, function (i, element) {
            if (element.type == 'representatives') {
                tableContent += '<tr>';
                tableContent += '<td><a href="#" class="linkshowRep" rel="' + element.fullname + '">' + element.fullname + '</a></td>';
                tableContent += '<td>' + element.Mail + '</td>';
                tableContent += '<td><a href="#" class="linkdelRep" rel="' + element.fullname + '">Fired</a></td>';
                tableContent += '<td><a href="#" class="linkdowngrade" rel="' + element.fullname + '">downgrade</a></td>';
                tableContent += '</tr>';
                repTable.push(element); // add each representant in a table
            } else {
                table2Content += '<tr>';
                if(element.Name == "" || element.Name === undefined){
                    table2Content += '<td><a href="#" class="linkshowEmployee" rel="' + element.username + '">Not set yet</a></td>';
                }else{
                    table2Content += '<td><a href="#" class="linkshowEmployee" rel="' + element.username + '">' + element.Name + ' ' + element.Firstname + '</a></td>';
                }
                table2Content += '<td>' + element.Mail + '</td>';
                table2Content += '<td><a href="#" class="linkdeleteuser" rel="' + element.username + '">Fired</a></td>';
                table2Content += '<td><a href="#" class="linkupgrade" rel="' + element.username + '">Upgrade</a></td>';
                table2Content += '</tr>';
                employeeTable.push(element); // add each employee in a table
            }
        });

        // Inject the whole content string into our existing HTML table
        $('table#repList tbody').html(tableContent);
        $('table#employeeList tbody').html(table2Content);
    });
};



// Show Representant Info
function showRepInfo(event) {
    // Prevent Link from Firing
    event.preventDefault();


    // Retrieve rep fullname from link rel attribute
    var thisRep = $(this).attr('rel');
    // Get Index of object based on id value
    var arrayPosition = repTable.map(function (arrayItem) {
        return arrayItem.fullname;
    }).indexOf(thisRep);
    
    // Get our representant Object
    var thisRepObject = repTable[arrayPosition];
    //Populate INFO card
    $('#repFullname').text(thisRepObject.fullname);
    $('#repMail').text(thisRepObject.mail);
    $('#repPosition').text(thisRepObject.position);
    
    //ajax to get representant link
    
    var corpName = $('input#name').val();
    
    $.ajax({
        type: 'POST',
        data: thisRepObject,
        url: '/employee/generateLink/' + corpName,
        dataType: 'JSON'
    }).success(function (result) {
        // get info
        if(result.msg == ""){
            currentLink = result.link;
        }else{
            currentLink = "NOT FOUND";
        }
    });
    currentEmployee = thisRepObject;
};



// Show Employee Info
function showEmployeeInfo(event) {
    // Prevent Link from Firing
    event.preventDefault();
    
    var corpName = $('input#name').val();


    // Retrieve rep fullname from link rel attribute
    var thisEmployee = $(this).attr('rel');
    // Get Index of object based on id value

    var arrayPosition = employeeTable.map(function (arrayItem) {
        return arrayItem.username;
    }).indexOf(thisEmployee);
    

    // Get our representant Object
    var thisEmployeeObject = employeeTable[arrayPosition];
    var image = document.getElementById('employeeAvatar');
    if (thisEmployeeObject.Gender == "male") {
        image.src = '../../../../images/male.png';
    } else {
        image.src = '../../../../images/female.png';
    }
    //Populate INFO card
    $('#employeeName').text(thisEmployeeObject.Name);
    $('#employeeFirstname').text(thisEmployeeObject.Firstname);
    $('#employeeMail').text(thisEmployeeObject.Mail);
    $('#employeeAdress1').text(thisEmployeeObject.Adress1);
    $('#employeeStatus').text(thisEmployeeObject.Status);
    
    $.ajax({
        type: 'POST',
        data: thisEmployeeObject,
        url: '/employee/generateLink/' + corpName,
        dataType: 'JSON'
    }).success(function (result) {
        // get info
        if(result.msg == ""){
            currentLink = result.link;
        }else{
            currentLink = "NOT FOUND";
        }
    });
    currentEmployee = thisEmployeeObject;
};


// History LIST
function loadHistoryeList() {
    //get elements detail
    // Empty content string
    var tableContent = '';
    var username = $('input#username').val();

    // jQuery AJAX call for JSON
    $.getJSON('/history/gethistory/' + username, function (data) {

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function (i, element) {
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="showUser" rel="' + element.username + '">' + element.username + '</a></td>';
            tableContent += '<td align="center">' + new Date(element.date).toLocaleDateString() + " at " + new Date(element.date).toLocaleTimeString() + '</td>';
            tableContent += '<td><a href="#" class="deleteAcess" rel="' + element.username + '">delete</a></td>';
            tableContent += '</tr>';
            historyTable.push(element);
        });

        // Inject the whole content string into our existing HTML table
        $('table#logList tbody').html(tableContent);
    });
};