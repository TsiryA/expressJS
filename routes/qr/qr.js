var Canvas = require('canvas'),
    Image = Canvas.Image,
    qrcode = require('./src/QRCode.js')(Canvas),
    qr = require('qr-js');

exports.testqr = function (filepath) {
    /*
    we get the qr code from image filename
    it should be ease to scan on just take a capture of the QR code
    we suggest to take a scan for more efficiency of the programm
    RESULT MODEL
    =================================================================
    result = {
        result: "the original string",
        msg: "error if the re is a problem in decode"
    }
    
    INPUT
    =================================================================
    filename = "path of the image file"
    */
    var result = {};
    var filename = filepath;
    var image = new Image();
    image.src = filename;
    try {
        result.value = qrcode.decode(image);
        console.log('result of qr code: ' + result.value);
        result.msg = "";
    } catch (e) {
        console.log('unable to read qr code');
        result.msg = "error occured: " + e;
    }
    return result;
}

exports.generateqr = function(bruteText, result){
    /*
    we generate QR code from a string and we store it in a file.
    we use an image file (*png)
    the result is possible for a path or just a name
    */
    qr.saveSync(bruteText, result);
}