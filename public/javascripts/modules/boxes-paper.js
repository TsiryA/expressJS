var corpId;
var currentCode;
var allElement = [];
var nameText = document.getElementById('name');
var mailcase = document.getElementById('mailcase');
var empName = document.getElementById('boxtitle');
var profileImage = document.getElementById('img#profile');

var nameString = "";

$(document).ready(function () {
    var latlng = $('input#latlng').val();
    $('a#sendAccess').on('click', requestAccess);
    createVal(latlng);
});


////////////////////////////////////////////////////////////////////////////////////////////
function requestAccess() {
    closebox();
    var research = {
        corpId: corpId,
        code: currentCode
    };
    $.ajax({
        type: 'POST',
        data: research,
        url: '/front/accessFront',
        dataType: 'JSON'
    }).success(function (response) {
        // Check for successful (blank) response
        if (response.msg === '') {
            currentSalt = response.salt;
            Materialize.toast('test', 4000, 'rounded');
        } else {
            // If something goes wrong, alert the error message that our service returned
            Materialize.toast('Error: ', 4000, 'rounded');
        }
    });
};




//                   DRAW TEST
// DRAW IN A CANVAS 800*600
function drawing(employeeArray, representativesArray, user) {
    var all = representativesArray.concat(employeeArray);
    var path = new createUserBox(user._id, user.username, user.email, 10, 10);
    var currentType = "representatives";
    var xStart = 10;
    var yStart = 0;
    for (var i = 0; i < all.length; i++) {
        var style = {
            bloc: "rgb(124, 192, 171)",
            text: "rgb(255,255,255)"
        };
        if (currentType != all[i].type) {
            currentType = all[i].type;
            xStart = xStart + 310;
            yStart = 0;
        };
        if (yStart >= 500) {
            xStart = xStart + 310;
            yStart = 65;
        } else {
            yStart = yStart + 65;
        };
        if (!all[i].Gender) {
            style = {
                bloc: "rgb(71, 104, 131)",
                text: "rgb(255,255,255)"
            };
        } else if (all[i].Gender == "male") {
            style = {
                bloc: "rgb(69, 132, 111)",
                text: "rgb(255,255,255)"
            };
        };
        var name;
        var mail;
        var poste;

        if (all[i].type == "representatives") {
            name = all[i].fullname;
            mail = all[i].Mail;
            poste = all[i].position;

        } else {
            name = all[i].Name + " " + all[i].Firstname;
            mail = all[i].Mail;
            poste = all[i].position;
        };

        if (xStart <= 600) {
            var path = new createEmployeeBox(name, mail, poste, xStart, yStart, style.bloc, style.text, all[i].index);
        };

    };
}




// ------------------- ORGANIGRAMM ELEMENT ------------------------------//

function createUserBox(id, name, mail, xStart, yStart) {
    var shape = new createBasicBox(xStart, yStart, xStart + 300, yStart + 35);
    var textX = xStart + 15;
    var textY = yStart + 15;
    var textStyle = {
        fontFamily: 'Courier New',
        fontWeight: 'bold',
        fontSize: 12,
        fillColor: 'rgb(255,255,255)',
        justification: 'left'
    };
    var nameText = new createText("NAME :" + name, textStyle, textX, textY, false);
    var mailText = new createText("EMAIL :" + mail, textStyle, textX, textY + 15, false);
    var idText = new createText(id, "", textX, textY + 15, true);
    var groupe = new Group([shape, nameText, mailText, idText]);
    shape.style = {
        fillColor: 'rgb(137,131,109)',
        strokeColor: 'rgba(191,187,162,0.5)',
        strokeWidth: 5
    };
    return groupe;
};

function createEmployeeBox(name, mail, poste, xStart, yStart, shapeColor, textColor, index) {
    var shape = new createBasicBox(xStart, yStart, xStart + 300, yStart + 50);
    shape.fillColor = shapeColor;
    var textX = xStart + 15;
    var textY = yStart + 15;
    var textStyle = {
        fontFamily: 'Courier New',
        fontWeight: 'bold',
        fontSize: 12,
        fillColor: textColor,
        justification: 'left'
    };
    var nameText = new createText("NAME :" + name, textStyle, textX, textY, false);
    var mailText = new createText("EMAIL :" + mail, textStyle, textX, textY + 15, false);
    var posteText = new createText("POSTE :" + poste, textStyle, textX, textY + 30, false);
    var index = new createText(index, "", textX, textY + 10, true);
    var groupe = new Group([shape, nameText, mailText, posteText, index]);
    return groupe;
};


// ------------------- BASICS SHAPES -------------//

//                      BOX
function createBasicBox(xStart, yStart, xFinish, yFinish) {
    var rectangle = new Rectangle(new Point(xStart, yStart), new Point(xFinish, yFinish));
    var cornerSize = new Size(20, 20);
    var path = new Path.RoundRectangle(rectangle, cornerSize);
    return path;
};

//                     TEXT
function createText(content, objectStyle, xPosition, yPosition, hide) {
    var text = new PointText(new Point(xPosition, yPosition));
    text.content = content;
    if (objectStyle == undefined || objectStyle == "") {
        text.style = {
            fontFamily: 'Courier New',
            fontWeight: 'bold',
            fontSize: 12,
            fillColor: 'red',
            justification: 'left'
        };
    } else {
        text.style = objectStyle;
    };
    if (hide) {
        text.fillColor.alpha = 0;
    };

    return text;
};

// ------------------- MOUSE EVENT ---------------//
function onMouseDown(event) {
    var nameVal = event.item.children[1].content.split(':')[1];
    var emailVal = event.item.children[2].content.split(':')[1];
    if (event.item) {

        event.item.selected = true; // Select Item when you clic on it
        empName.innerHTML = nameVal;
        nameText.innerHTML = nameVal;
        //profileImage.setAttribute('src', employeeImage);
        currentCode = parseInt(event.item.children[4].content);
        mailcase.innerHTML = '<a href="mailto:' + emailVal + '">Send mail</a> <p><a href="/front/showFront/' + corpId + '/' + currentCode + '">Login</a></p>';
    }
};

function onMouseDrag(event) {
    if (event.item && event.item.selected)
        event.item.position = event.point; // drag only the selected item
};

function onMouseUp(event) {
    if (event.item) {
        event.item.selected = false; // deselect item on mouse realise
        openbox(nameString, 1);
    }

};

///////////////////////////////////////////////////////////////////////////////////////

//GET CORP NEEDED DATA
function createVal(latlng) {
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
        var corpStruct = {};
        corpStruct = response.corporation;
        //alert(JSON.stringify(response.corporation));
        user = response.user;

        if (corpStruct != undefined && user != undefined) {

            //DATA VARIABLES
            {
                var mSize = 0;
                var fSize = 0;
                var employees = corpStruct.employee;
            }

            var repTable = [];
            var employeeTable = [];

            for (var i = 0; i < employees.length; i++) {
                employees[i].index = i;
                if (employees[i].type == "employee") {
                    employeeTable.push(employees[i]);
                } else {
                    repTable.push(employees[i]);
                }
                allElement.push(employees[i]);
            }
            corpId = corpStruct._id;
            drawing(employeeTable, repTable, user);
        } else {;
        }

    });
};

