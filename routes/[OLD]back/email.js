var util = require("util");
var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;
var Q = require("q");
var mail = require("./utils/email.js");
var logic = require("./utils/logicalDB.js");

/*
 *  SMS Router --------------------------------------------
 */

router.get('/sendTest', function (req, res) {
    var db = req.db;
    var mailOptions = {
        from: 'bolzano.virtualhr@gmail.com', // sender address
        to: 'allen09chezar@live.fr', // list of receivers
        subject: 'Hello ', // Subject line
        text: 'Hello world',
        html: 'Hello world'// plaintext body
    };
    mail.sendEmail(mailOptions).then(function (response) {
        mailOptions.Date= logic.getCurrentTime();
        logic.insert('mailcollection', mailOptions);
    }).then(function () {
        res.send({
            msg: ''
        });
    });
});


router.post('/sendVerification', function (req, res) {
    var db = req.db;
    var mailOptions = req.body;
    mailOptions.from = 'bolzano.virtualhr@gmail.com';
    mail.sendEmail(mailOptions).then(function (response) {
        mailOptions.Date = logic.getCurrentTime();
        logic.insert('mailcollection', mailOptions);
    }).then(function () {
        res.send({
            msg: ''
        });
    });
});

module.exports = router;