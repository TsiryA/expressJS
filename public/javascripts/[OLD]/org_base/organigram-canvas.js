// USER BOX
var userBox = function (context, username, usermail, xPosition, yPosition) {


    //User bloc
    drawBox(context, xPosition, yPosition, 100, 50, 20, "rgba(112,60,115,0.5)", "rgb(97,51,99)");

    //USER TEXT
    var xText = xPosition + 20;
    var yText1 = yPosition + 22;
    var yText2 = yText1 + 10;
    drawText(context, username, xText, yText1, "rgb(255,255,255)", "bold 10px Arial");
    drawText(context, usermail, xText, yText2, "rgb(255,255,255)", "9px Arial");

};

//EMPLOYEE BOX
var employeeBox = function (context, name, firstname, email, poste, xPosition, yPosition, borderStyle, boxStyle) {

    //User bloc
    drawBox(context, xPosition, yPosition, 120, 70, 20, borderStyle, boxStyle);

    //USER TEXT
    var xText = xPosition + 15;
    var yText1 = yPosition + 20;
    var yText2 = yText1 + 12;
    drawText(context, name, xText, yText1, "rgb(255,255,255)", "bold 10px Arial");
    drawText(context, firstname, xText, yText2, "rgb(255,255,255)", "10px Arial");
    drawText(context, email, xText, yText2 + 12, "rgb(255,255,255)", "10px Arial");
    drawText(context, poste, xText, yText2 + 24, "rgb(255,255,255)", "10px Arial");
};

//DRAW ALL BOX
var place_all = function (context, repTable, employeeTable) {

    var allEmp = repTable.concat(employeeTable);
    //ALL EMPLOYEE
    {
        //proprity style
        var xPositionEmp = 10,
            yPositionEmp = 0;
    }
    var previousType = "representatives";
    var lineXposition = [];
    for (var i = 0; i < allEmp.length; i++) {

        if (allEmp[i].type != previousType) {

            //JUMP
            xPositionEmp = xPositionEmp + 150;
            yPositionEmp = 100;
            // SEPARATION LINE
            lineXposition.push(xPositionEmp - 15);
            previousType = allEmp[i].type;
        } else {
            // NORMAL POSITIONNING
            if (yPositionEmp >= 400) {
                xPositionEmp = xPositionEmp + 150;
                yPositionEmp = 100;
            } else {
                yPositionEmp = yPositionEmp + 100;
            }
        }

        if (allEmp[i].sex == "male") {
            employeeBox(context, allEmp[i].Name, allEmp[i].Firstname, allEmp[i].Mail, allEmp[i].Poste, xPositionEmp, yPositionEmp, "rgba(0,50,200,0.5)", "rgb(0,0,200)");
        } else {
            employeeBox(context, allEmp[i].Name, allEmp[i].Firstname, allEmp[i].Mail, allEmp[i].Poste, xPositionEmp, yPositionEmp, "rgba(200,50,0,0.5)", "rgb(200,0,0)");
        }
    }

    for (var i = 0; i < lineXposition.length; i++) {
        draw_vertical_line(context, "dotted", lineXposition[i], 80, 500, 'rgb(72,249,249)', 1);
        draw_vector_textH(context, "REPRESENTATIVES", 9, "Arial", "", 10, 90, lineXposition[i] - 10, 'rgb(65,123,47)');
        draw_vector_textH(context, "EMPLOYEE", 9, "Arial", "", lineXposition[i] + 10, 90, xPositionEmp + 200, 'rgb(231,91,44)');
    };
};

//DRAW ERROR BOX
var errorBox = function (canvas, context, errorResult, errorDetailTitle, errorDetail, errorType) {
    drawBox(context, 10, 10, canvas.width - 20, canvas.height - 20, 20, "rgba(200,50,0,0.5)", "rgb(200,0,0)");
    drawText(context, errorResult, canvas.width / 2 - 195, canvas.height / 2 - 20, "rgb(255,255,255)", "Bold 30px Arial");
    drawText(context, errorDetailTitle, canvas.width / 2 - 195, canvas.height / 2 + 20, "rgb(255,255,255)", "Bold 15px Arial");
    drawText(context, errorDetail, canvas.width / 2 - 195, canvas.height / 2 + 40, "rgb(255,255,255)", "Bold 15px Arial");
    drawText(context, errorType, canvas.width / 2 - 195, canvas.height / 2 + 60, "rgb(255,255,255)", "10px Arial");
}