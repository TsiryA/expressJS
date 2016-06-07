var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;
var Q = require("q");
var logic = require("./utils/logicalDB.js");
var email = require("./utils/email.js");


//function to generate an acces code
function generate(user) {
    var deferred = Q.defer();
    var currentTime = logic.getCurrentTime();
    var newAcces = {
        username: user.username,
        password: logic.alphanumeric_unique(),
        level: user.level,
        userid: user._id,
        date: currentTime
    };
    var mailOptions = {
        from: 'bolzano.virtualhr@gmail.com', // sender address
        to: user.Mail, // list of receivers
        subject: 'Acces Request', // Subject line
        text: 'Code: ' + newAcces.password,
        html: 'Code: ' + newAcces.password // plaintext body
    };
    email.sendEmail(mailOptions).then(function () {
        return logic.insert('userAccessCollection', newAcces);
    }).then(function () {
        var retVal = {
            username: user.username,
            userid: user._id
        };
        deferred.resolve(retVal);
    });
    return deferred.promise;
}

/*
 * Routers =====================================================================
 */

router.get('/findUser/:level/:login', function (req, res) {
    var db = req.db;
    var levelAcces = req.params.level;
    switch (levelAcces) {
    case 'employee':
        var collection = 'employeecollection';
        break;
    case 'user':
        var collection = 'usercollection';
        break;
    case 'guest':
        var collection = 'employeecollection';
        break;
    }
    var findVal = {
        'username': req.params.login
    };

    logic.find(collection, findVal).then(function (items) {
        if (items) {
            res.send(items[0]);
        } else {
            res.send({
                msg: 'User unknown: internal error'
            });
        }
    });
});

router.get('/addAcces/:level/:login', function (req, res) {
    var db = req.db;
    var levelAcces = req.params.level;
    switch (levelAcces) {
    case 'employee':
        var collection = 'employeecollection';
        break;
    case 'user':
        var collection = 'usercollection';
        break;
    case 'guest':
        var collection = 'employeecollection';
        break;
    }
    var findVal = {
        'username': req.params.login
    };

    logic.find(collection, findVal).then(function (items) {
        if (items) {
            items[0].level = levelAcces;
            return generate(items[0]);
        } else {
            res.send({
                msg: 'User unknown: internal error'
            });
        }
    }).then(function (retVal) {
        var identityVal = retVal.username;
        var pageTitle = 'Acces for ' + identityVal;
        res.render('login2_view', {
            title: pageTitle,
            identity: identityVal
        });
    });
});

router.get('/loginAcces/:login/:password', function (req, res) {
    var db = req.db;
    var findAcces = {
        username: req.params.login,
        password: req.params.password
    };
    logic.find('userAccessCollection', findAcces).then(function (items) {
        if (items) {
            var currentTime = logic.getCurrentTime();
            var possibilityTime = items[0].date;
            var validityTime = items[0].date + 300000;
            if (currentTime <= possibilityTime || currentTime >= validityTime) {
                res.send({
                    msg: 'Acces Expired'
                });
            } else {
                switch (items[0].level) {
                case 'employee':
                    res.render('employee_view', {
                        title: 'Employee ' + items[0].username,
                        usernameVal: items[0].username,
                        levelAccesVal: items[0].level,
                        code: findAcces.password
                    });
                    break;
                case 'user':
                    res.render('login2_view', {
                        title: 'User ' + items[0].username
                    });
                    break;
                case 'guest':
                    res.render('login2_view', {
                        title: 'Guest for ' + items[0].username
                    });
                    break;
                }
                res.send(items[0]);
            }
        } else {
            res.send({
                msg: 'Access denied'
            });
        }
    }).then(function () {
        res.send({
            msg: ''
        });
    });
});

router.post('/checkUser', function (req, res) {
    var db = req.db;
    var searchKey = req.body;
    logic.find('usercollection', searchKey).then(function (items) {
        res.send(items);
    });
});

router.post('/adduser', function (req, res) {
    var db = req.db;
    logic.insert('usercollection', req.body).then(function () {
        res.send({
            msg: ''
        });
    });
});

router.get('/userval/:login/:password', function (req, res) {
    var db = req.db;
    var findAcces = {
        username: req.params.login,
        password: req.params.password
    };
    logic.find('userAccessCollection', findAcces).then(function (items) {
        if (items) {
            var currentTime = logic.getCurrentTime();
            var possibilityTime = items[0].date;
            var validityTime = items[0].date + 300000;
            if (currentTime <= possibilityTime || currentTime >= validityTime) {
                res.send({
                    msg: 'Acces Expired'
                });
            } else {
                logic.find('employeecollection', {
                    username: items[0].username
                }).then(function (items) {
                    res.render('employeemodif_view', {
                        title: 'Employee ' + items[0].username,
                        code: items[0]._id
                    });
                });
            }
        } else {
            res.send({
                msg: 'Access denied'
            });
        }
    }).then(function () {
        res.send({
            msg: ''
        });
    });
});

router.get('/findemployeeById/:id', function (req, res) {
    logic.find(collection, {
        _id: new ObjectID(req.params.id)
    }).then(function (items) {
        if (items) {
            res.send(items[0]);
        } else {
            res.send({
                msg: 'User unknown: internal error'
            });
        }
    });
});

router.post('/modifyEmployee/:id', function (req, res) {
    var empUpdate = req.body;
    logic.checkGeneralEmployee(empUpdate).then(function (result) {
        return logic.update('employeecollection', {
            _id: req.params.id
        }, empUpdate);
    }).then(function (err, result) {
        if (!err) {
            res.send({
                msg: ''
            });
        } else {
            res.send({
                msg: err
            });
        }
    });
});

module.exports = router;


