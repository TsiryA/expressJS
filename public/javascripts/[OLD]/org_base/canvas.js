//----------------------------- DRAW LINES ---------------------------------------//
//                     GENERAL
var draw_line = function (context, style, xStart, yStart, xFinish, yFinish, color, lineWidth) {


    context.strokeStyle = color;
    context.lineWidth = parseInt(lineWidth);
    context.translate(0.1, 0.1);
    context.beginPath();
    if (style == "dotted") {
        context.setLineDash([2]);
    } else {
        context.setLineDash([]);
    }
    context.lineTo(xStart, yStart);
    context.lineTo(xFinish, yFinish);
    context.stroke();
};

//                     VERTICAL
var draw_vertical_line = function (context, style, xStart, yStart, yFinish, color, lineWidth) {
    draw_line(context, style, xStart, yStart, xStart, yFinish, color, lineWidth);
};

//                     HORIZONTAL
var draw_horizontal_line = function (context, style, xStart, yStart, xFinish, color, lineWidth) {
    draw_line(context, style, xStart, yStart, xFinish, yStart, color, lineWidth);
};

//                     LINE WITH ARROW
var draw_vector_line = function (context, style, xStart, yStart, xFinish, yFinish, color, lineWidth) {

    var arrow = [
        [2, 0],
        [-10, -4],
        [-10, 4]
    ];
    draw_line(context, style, xStart, yStart, xFinish, yFinish, color, lineWidth);
    var ang = Math.atan2(yFinish - yStart, xFinish - xStart);
    drawFilledPolygon(context, translateShape(rotateShape(arrow, ang), xFinish, yFinish), color);
};

// DRAW VECTOR
{
    function drawFilledPolygon(context, shape, color) {
        context.fillStyle = color;
        context.beginPath();
        context.moveTo(shape[0][0], shape[0][1]);

        for (p in shape)
            if (p > 0) context.lineTo(shape[p][0], shape[p][1]);

        context.lineTo(shape[0][0], shape[0][1]);
        context.fill();
    };

    function translateShape(shape, x, y) {
        var rv = [];
        for (p in shape)
            rv.push([shape[p][0] + x, shape[p][1] + y]);
        return rv;
    };

    function rotateShape(shape, ang) {
        var rv = [];
        for (p in shape)
            rv.push(rotatePoint(ang, shape[p][0], shape[p][1]));
        return rv;
    };

    function rotatePoint(ang, x, y) {
        return [
            (x * Math.cos(ang)) - (y * Math.sin(ang)),
            (x * Math.sin(ang)) + (y * Math.cos(ang))
    ];
    };
}

//                      VECTOR WITH TEXT
var draw_vector_textH = function (context, text, font_size, font_police, style, xStart, yStart, xFinish, color) {
    //  STRING 
    var strSize = text.length * parseInt(font_size);
    var fontStyle = font_size + "px " + font_police;

    var totalLenght = xFinish - (xStart + strSize);

    if (totalLenght >= 2 * strSize) {
        draw_line(context, style, xStart, yStart, totalLenght / 2 + xStart, yStart, color, parseInt(font_size / 10));
        draw_vector_line(context, style, (totalLenght / 2) + strSize + xStart, yStart, xFinish, yStart, color, parseInt(font_size / 10));
    }

    drawText(context, text, totalLenght / 2 + xStart + 10, yStart, color, fontStyle);
};


//                      BLOC STYLE
var drawBox = function (context, xPosition, yPosition, boxWidth, boxHeight, cornerRadius, boxBorderStyle, boxFillStyle) {

    // STROKE RECT
    var strXPos = xPosition + (cornerRadius / 2);
    var strYPos = yPosition + (cornerRadius / 2);
    var strWidth = boxWidth - cornerRadius;
    var strHeight = boxHeight - cornerRadius;

    // FILL RECT
    var fillXPos = xPosition + (cornerRadius / 2);
    var fillYPos = yPosition + (cornerRadius / 2);
    var fillWidth = boxWidth - cornerRadius;
    var fillHeight = boxHeight - cornerRadius;


    // Set faux rounded corners
    context.lineJoin = "round";
    context.lineWidth = cornerRadius;

    // SET STYLE
    context.fillStyle = boxFillStyle;
    context.strokeStyle = boxBorderStyle;

    // Change origin and dimensions to match true size (a stroke makes the shape a bit larger)

    context.fillRect(fillXPos, fillYPos, fillWidth, fillHeight);
    context.strokeRect(strXPos, strYPos, strWidth, strHeight);
};

//                      TEXT STYLE
var drawText = function (context, textValue, xPosition, yPosition, textStyle, fontStyle) {

    // SET PROP 
    context.fillStyle = textStyle;
    context.font = fontStyle;
    context.fillText(textValue, xPosition, yPosition);
};