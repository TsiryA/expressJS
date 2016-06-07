var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;
var Q = require("q");
var logic = require("../utils/logicalDB.js");
var email = require("../utils/email.js");


/*
 * Routers =====================================================================
 */
//--------------------- ACCESS TO DASHBOARD ------------------------------//
router.get('/dashboard/:id/:username/:salt', function (req, res) {

    var accesUser = {
        _id: new ObjectID(req.params.id),
        username: req.params.username,
        salt: req.params.salt
    };
    var valueid = req.params.id;
    var currentTime = logic.getCurrentTime();
    var corpForm = "";
    var userid = "";
    //verify the validity of an access
    logic.find('userAccessCollection', accesUser).then(function (items) {
        if (items.length != 0) {
            var possibilityTime = items[0].date;
            var validityTime = items[0].date + 300000;
            var registeredUser = {
                userid: new ObjectID(items[0].userid)
            };
            userid = new ObjectID(items[0].userid);
            if (currentTime <= possibilityTime || currentTime >= validityTime) {
                //redirection to login
                res.render('login', {
                    error: 'ACCESS DENIED: EXPIRED CODE'
                });
            } else {
                //test if the user already have a corp
                return logic.find('corpcollection', registeredUser);
            }
        } else {
            //redirection to login
            res.render('login', {
                error: 'ACCESS DENIED: UNKNOWN USER'
            });
        }
    }).then(function (items) {
        if (items.length == 0) {
            //First time connexion
            res.render('board/dash_board_new_user', {
                userval: userid,
                username: accesUser.username
            });
        } else {
            res.render('board/dash_board', {
                userval: userid,
                username: accesUser.username,
                corp: items[0].corpName,
                adress: items[0].corpAdress,
                location: items[0].corpLocation,
                description: items[0].corpDescription
            });
        }
    });
});


module.exports = router;