var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;
var Q = require("q");
var logic = require("../utils/logicalDB.js");
var objCheck = require("../utils/objectChecker.js");
var email = require("../utils/email.js");
var hashing = require("../utils/security/encryptions.js");

//function to generate an acces code
function generate(user) {
    var deferred = Q.defer();
    var currentTime = logic.getCurrentTime();
    var passwordText = logic.alphanumeric_unique();
    var passwordStored = hashing.generateHash(passwordText);
    var newAcces = {
        username: user.username,
        hash: passwordStored.hash,
        salt: passwordStored.salt,
        userid: user._id,
        date: currentTime
    };
    var mailOptions = {
        from: 'bolzano.virtualhr@gmail.com', // sender address
        to: user.email, // list of receivers
        subject: 'Acces Request', // Subject line
        text: 'Code: ' + passwordText,
        html: 'Code: ' + passwordText // plaintext body
    };
    email.sendEmail(mailOptions).then(function () {
        return logic.insert('userAccessCollection', newAcces);
    }).then(function () {
        var retVal = {
            username: user.username,
            userid: user._id,
            salt: passwordStored.salt
        };
        deferred.resolve(retVal);
    });
    return deferred.promise;
}

/*
 * Routers =====================================================================
 */

router.post('/registration', function (req, res) {
    var db = req.db;
    var elt = req.body;

    /*
    registration run on 3 steps
    1 - check values pattern
    2 - check if these values are aleady used
    3 - register the new user
    */

    objCheck.checkUser(elt).then(function (result) {
        if (result.validate) {
            return logic.find('usercollection', {
                username: elt.username
            });
        } else {
            res.send({
                msg: "ERROR: INPUT DATA ERROR"
            });
        }
    }).then(function (items) {
        if (items.length == 0) {
            return logic.find('usercollection', {
                email: elt.email
            });
        } else {
            res.send({
                msg: "username already used"
            });
        }
    }).then(function (items) {
        if (items.length == 0) {
            return logic.insert('usercollection', elt);
        } else {
            res.send({
                msg: "email already used"
            });
        }
    }).then(function (result) {
        res.send({
            msg: '',
            redirect: '/login'
        });
    });

});

// CHECK USER and SEND ACCESS CODE
router.post('/checkUser', function (req, res) {
    var db = req.db;
    var searchKey = req.body;
    logic.find('usercollection', searchKey).then(function (items) {
        //Username should be unique
        if (items.length != 0) {
            if (items[0].active == false) {
                res.send({
                    msg: 'Please reactivate the account first'
                });
            } else {
                return generate(items[0]);
            }

        } else {
            res.send({
                msg: 'USER_UNKNOWN : internal error'
            });
        }
    }).then(function (result) {
        res.send({
            salt: result.salt,
            msg: ''
        });
    });
});

// VERIFY THE ACCESS CODE
router.post('/enterSite', function (req, res) {
    var db = req.db;
    var searchKey = req.body;
    logic.find('userAccessCollection', searchKey).then(function (items) {
        //Username should be unique
        if (items.length != 0) {
            var currentTime = logic.getCurrentTime();
            var possibilityTime = items[0].date;
            var validityTime = items[0].date + 300000;
            if (currentTime <= possibilityTime || currentTime >= validityTime) {
                res.send({
                    msg: 'Acces Expired'
                });
            } else {
                res.send({
                    msg: '',
                    redirect: '/authorised/dashboard/' + items[0]._id + '/' + items[0].username + '/' + items[0].salt
                });
            }
        } else {
            res.send({
                msg: 'USER_UNKNOWN : internal error'
            });
        }
    }).then(function (result) {
        res.send({
            msg: ''
        });
    });
});

// User informations
router.post('/getUserInfo', function (req, res) {
    var db = req.db;
    var key = {};
    key._id = new ObjectID(req.body.userid);
    key.username = req.body.username;
    logic.find('usercollection', key).then(function (items) {
        res.send(items);
    });

});

// we suppose that we only can desactivate user never remove it
router.get('/close/:userId', function (req, res) {

    /*
    we suppose that users can only be desactivated
    and the corporation access is attached with the user
    so we can access the front side of a corproration even if 
    the user is disable
    
    ==========================================================
    closing user mean closing the back office
    for this time we desactivate the user and add a link to reactivate the account
    */

    var db = req.db;
    var key = {
        _id: new ObjectID(req.params.userId)
    };
    var key2 = {
        userid: new ObjectID(req.params.userId)
    };

    var reactivateVal = logic.alphanumeric_unique();

    //an email with a link of reactivation will be sent to the user

    var mailOptions = {
        from: 'bolzano.virtualhr@gmail.com', // sender address
        to: "user.email", // list of receivers
        subject: 'Desactivate the account', // Subject line
        text: 'http://localhost:3000/users/reactivation/' + reactivateVal,
        html: 'http://localhost:3000/users/reactivation/' + reactivateVal // plaintext body
    };


    logic.updateKey('usercollection', key, {
        active: false,
        reactivelink: reactivateVal
    }).then(function () {
        return logic.updateKey('corpcollection', key2, {
            active: false
        });
    }).then(function () {
        return logic.find('usercollection', key);
    }).then(function (items) {
        var sendTo = items[0].email;
        mailOptions.to = sendTo;
        return email.sendEmail(mailOptions);
    });

});

// account reactivation
router.get('/reactivation/:key', function (req, res) {

    var db = req.db;

    var key = {};
    key.reactivelink = req.params.key;

    logic.find('usercollection', key).then(function (items) {
        if (items.length != 0) {
            var key2 = {
                active: "",
                reactivelink: ""
            };
            key.userId = items[0]._id;
            return logic.deleteKey('usercollection', {
                _id: key.userId
            }, key2);
        }
    }).then(function () {
        return logic.deleteKey('corpcollection', {
            userid: key.userId
        }, {
            active: ""
        });
    }).then(function () {
        res.render('map/main', {
            title: 'Corporation Localisation'
        });
    });
});

// Change user informations
router.post('/saveChange/:userid', function (req, res) {
    var db = req.db;
    var elt = req.body;
    var key = req.params.userid;

    objCheck.checkUser(elt).then(function (result) {
        if (result.validate) {
            return logic.find('usercollection', {
                username: elt.username
            });
        } else {
            res.send({
                msg: "ERROR: INPUT DATA ERROR"
            });
        }
    }).then(function (items) {
        if (items.length == 0) {
            return logic.find('usercollection', {
                email: elt.email
            });
        } else {
            if (items[0]._id != new ObjectID(key)) {
                res.send({
                    msg: "username already used"
                });
            }
        }
    }).then(function (items) {
        if (items.length == 0) {
            return logic.updateKey('usercollection', {
                _id: new ObjectID(key)
            }, elt);
        } else {
            if (items[0]._id != new ObjectID(key)) {
                res.send({
                    msg: "email already used"
                });
            }
        }
    }).then(function (result) {
        res.send({
            msg: '',
        });
    });

});

module.exports = router;