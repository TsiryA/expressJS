var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;
var Q = require("q");
var logic = require("../utils/logicalDB.js");
var objCheck = require("../utils/objectChecker.js");
var email = require("../utils/email.js");
var hashing = require("../utils/security/encryptions.js");
var qrCode = require("../qr/qr.js");


//function to generate an acces code
function generate(employee) {
    var deferred = Q.defer();
    var currentTime = logic.getCurrentTime();
    var passwordText = logic.alphanumeric_unique();
    var passwordStored = hashing.generateHash(passwordText);
    var newAcces = {
        username: employee.username,
        hash: passwordStored.hash,
        salt: passwordStored.salt,
        date: currentTime
    };
    var mailOptions = {
        from: 'bolzano.virtualhr@gmail.com', // sender address
        to: employee.Mail, // list of receivers
        subject: 'Acces Request', // Subject line
        text: 'Code: ' + passwordText,
        html: 'Code: ' + passwordText // plaintext body
    };
    email.sendEmail(mailOptions).then(function () {
        return logic.insert('userAccessCollection', newAcces);
    }).then(function () {
        var retVal = {
            salt: passwordStored.salt
        };
        deferred.resolve(retVal);
    });
    return deferred.promise;
}


/*
 * Routers =====================================================================
 */

/*
 * ------------------ CREATE FRONT OFFICE  [Employee - Representatives]---------------------------
 */
router.post('/getEmployeeData', function (req, res) {
    var db = req.db;
    var elt = req.body;
    var currentTime = logic.getCurrentTime();
    var primaryKey = {
        salt: elt.salt,
        hash: elt.hash
    };
    var secondaryKey = {
        _id: new ObjectID(elt.corp)
    };
    var employees = [];
    var userAccessElt;
    // exclude documents (too heavy)
    var projection = {
        documents: 0
    };
    logic.find('userAccessCollection', primaryKey, projection).then(function (items) {
        if (items.length != 0) {
            userAccessElt = items[0];
            var limitSup = userAccessElt.date + 1800000;
            if (currentTime <= userAccessElt.date || currentTime > limitSup){
                res.send({
                    msg: "access expired"
                });
            }else{
                return logic.find('corpcollection', secondaryKey);
            }
        }else{
            res.send({
                msg: "access unknown"
            });
        }
    }).then(function (items){
        if(items.length != 0){
           employees = items[0].employee;
            var result = {};
            result.corp = items[0].corpName;
            if(employees[parseInt(elt.code)].username == userAccessElt.username){
                result.employee = employees[parseInt(elt.code)];
                result.msg = '';
                res.send(result);
            }else{
                res.send({
                    msg: "access unknown"
                });
            }
        }else{
            res.send({
                msg: "access unknown"
            });
        }
    });
});


router.get('/showFront/:corpId/:code', function (req, res) {
    var data = {
        corp: req.params.corpId,
        code: req.params.code
    };
    var db = req.db;
    var key = {
        _id: new ObjectID(req.params.corpId)
    };

    var currentEmployee;
    var index = parseInt(req.params.code);
    logic.find('corpcollection', key).then(function (items) {
        if (items.length != 0) {
            currentEmployee = items[0].employee[index];
            /// GET ALL DATA FROM HERE
            return generate(currentEmployee);
        }
    }).then(function (result) {
        data.salt = result.salt;
        res.render('front/user', data);
    });
});


module.exports = router;