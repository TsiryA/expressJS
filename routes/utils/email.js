var nodemailer = require('nodemailer');
var Q = require('q');
var mailConf = require('config.json')('./defaultData.json');
var valueCheck = require("./valueChecker.js");
var mailOp = mailConf.defaultMail;

var sendingMail = function (mailOption) {
    var deferred = Q.defer();
    var smtpTransport = nodemailer.createTransport(mailOp);
    smtpTransport.sendMail(mailOption, function (error, response) {
         if (error) {
            return deferred.resolve(error);
        } else {
            return deferred.resolve(response);
        }
    });
    return deferred.promise;
}

exports.sendEmail = function (mailOptions) {
    var deferred = Q.defer();
    console.log(mailOptions);
    valueCheck.validateEmail(mailOptions.from).then(function (result) {
        if (result.validate) {
            return valueCheck.validateEmail(mailOptions.to);
        } else {
            res.send({
                msg: "eMail Sender error"
            });
        }
    }).then(function (result) {
        if (result.validate) {
            return sendingMail(mailOptions);;
        } else {
            res.send({
                msg: "eMail Recipient error"
            });
        }
    }).then(function (response) {
        return deferred.resolve(response);
    });
    return deferred.promise;
};
