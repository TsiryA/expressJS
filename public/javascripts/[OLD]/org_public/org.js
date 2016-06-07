function draw() {
    var latlng = $('input#latlng').val();

    // ----------------- INITIALIZE --------------//
    var canvas = document.getElementById("graph"); // select canvas element

    // Verification pris en charge
    if (canvas.getContext) {

        getData(latlng, canvas);
        // CANVAS
    }

};


//GET CORP NEEDED DATA
var getData = function (latlng, canvas) {
    var user = {};
    var corpStruct = {};
    var corpData = {
        corpLocation: latlng
    };
    // jQuery AJAX call for JSON
    $.ajax({
        type: 'POST',
        data: corpData,
        url: '../../organigram/getInfo',
        dataType: 'JSON'
    }).success(function (response) {
        var livecontent = canvas.getContext('2d'); // specify livecontent
        var corpStruct = {};
        corpStruct = response.corporation;
        //alert(JSON.stringify(response.corporation));
        user = response.user;
        
        if(corpStruct != undefined && user != undefined){
        
        //DATA VARIABLES
        {
            var mSize = 0;
            var fSize = 0;
            var employees = corpStruct.employee;
        }
        userBox(livecontent, user.username, user.email, 10, 10);

        var repTable = [];
        var employeeTable = [];

        for (var i = 0; i < employees.length; i++) {
            if (employees[i].type == "employee") {
                employeeTable.push(employees[i]);
            } else {
                repTable.push(employees[i]);
            }
        }
        place_all(livecontent, repTable, employeeTable);
        }else{
            var errorResult = "MISSING VALUES";
            var errorDetailTitle = "Access Violation";
            var errorDetail = "You are attempting to access an invalide entry on the data base";
            var errorType = "ERROR_TYPE: 500 INTERNAL ERROR";
            errorBox(canvas, livecontent, errorResult, errorDetailTitle, errorDetail, errorType);
        }

    });
};