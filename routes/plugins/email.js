var util = require("util");
var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;
var Q = require("q");
var mail = require("../utils/email.js");
var logic = require("../utils/logicalDB.js");

/*
 *  EMAIL Router --------------------------------------------
 */

router.post('/sendVerification', function (req, res) {
    var db = req.db;
    var mailOptions = req.body;
    mailOptions.from = 'aiza.bolzano@gmail.com';
    mail.sendEmail(mailOptions).then(function (response) {
        console.log(JSON.stringify(response));
        res.send({
            msg: ''
        });
    });
});

module.exports = router;