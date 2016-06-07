var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;
var mail = require("./utils/email.js");
var logic = require("./utils/logicalDB.js");

/* 
 * ------------------- External Link Query ---------------------- *
 */

/*
 * POST to External link.
 */
router.post('/addLink', function (req, res) {
    var db = req.db;
    var link = req.protocol + '://' + req.get('host') + ':3000/linking/justView/' + req.body.AccesCode;
    var mailOp = {
        from: 'bolzano.virtualhr@gmail.com', // sender address
        to: req.body.Mail, // list of receivers
        subject: 'Temporary Document acces ', // Subject line
        text: 'Click Here',
        html: '<a href="' + link + '">Click Here</a>' // plaintext body
    };

    db.collection('documentExternalAcces').insert(req.body, function (err, result) {
        if (err === null) {
            mail.sendEmail(mailOp).then(function (response) {
                logic.insert('mailcollection', mailOp);
                res.send({
                    msg: ''
                });
            });
        } else {
            res.send({
                msg: err
            });
        }

    });
});

router.get('/justView/:code', function (req, res) {
    var db = req.db;
    var docCode = req.params.code;
    logic.find('documentExternalAcces', {
        AccesCode: docCode
    }).then(function (items) {
        if (items) {
            var time = logic.getCurrentTime();
            if (time > items[0].Creation && time < items[0].Date) {
                res.render('externalDoc_view', {
                    title: 'External acces',
                    docContent: items[0].Document
                });
            } else {
                res.render('externalError_view', {
                    title: 'Code expired',
                    errorCode: 'The code already expired'
                });
            }
        } else {
            res.render('externalError_view', {
                title: 'Code Error',
                errorCode: 'Corrupt Access Code'
            });
        }
    });
});
module.exports = router;