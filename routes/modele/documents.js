var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;
var Q = require("q");
var logic = require("../utils/logicalDB.js");
var email = require("../utils/email.js");

/* 
 * ------------------- Documents ---------------------- *
 */

// ================== SAVE DATA HISTORY =================== //

router.post("/saveDoc", function (req, res, next) {

    /* Data is the document itself and all references used for it.
    DATA MODEL:
    =======================================================================================
    data = {
        name: "NAME OF THE DOCUMENT",
        type: "The type of the document",
        owner: username,
        authorisation: "access attribution", **
        corp: ObjectID(corpId),
        content: Object("THE FULL DOCUMENT OR LINK")
    }
    owner, corp and content are essentials because there are used to identify the document
    ** authorisation is classified by level
    LEVEL AND RULES
    ======================================================================================
    1 -> public     => for everybody
    2 -> admin      => for owner, representatives and admins
    3 -> private    => for owner only
    */
    var data = req.body;
    data.validity = true; // We suppose that the document is active by default (contract, CV, ...)
    data.registryTime = logic.getCurrentTime() // We save the time when the document is saved
        // Authorisation is the keyLevel needed to access to the document
    if (data.authorisation === undefined || data.authorisation == "") {
        data.authorisation = 3; // By defalut we set that it's the owner only who can see the document
    };

    /*
    we save the document in an independant table to store all documents.
    we assume that when you delete the document from an account you only delete the user access not the document
    so we add a new level saying that the file is available for user or not
    */
    data.virtualAccess = true; // default: the document is visible
    /*
    DATA MODEL FOR STORAGE
    =========================================================================================
    data = {
        name: "NAME OF THE DOCUMENT",
        type: "The type of the document",
        owner: username,
        authorisation: "access attribution",
        corp: ObjectID(corpId),
        content: Object("THE FULL DOCUMENT OR LINK"),
        registryTime: registrationTime_millisecond,
        validity: active_or_not ,
        virtualAccess: accessible
    }
    */
    logic.insert('docCollection', data).then(function (result) {
        res.send({
            msg: ""
        });
    });

});

// ================== GET DOCUMENT LIST ================== //

/*
    we have 2 types of request:
        1- all document for corporation
        2- all document for user
*/

// CORPORATION
//this request should be available only for the user(admin) or representatives
router.get('/userDocList/:username', function (req, res) {

    var docArray = [];

    /*all document are identified by owner and corporation
    but we must apply 2 rules:
    1 - we must verify that the document is available for front access
    2 - we also must verify the level access of the request **
    ** we cannot allow anyone to access to all private files
    the resticted access is verified every request for more security
    */
    var db = req.db;
    var usernameVal = req.params.username;
    var corpId;
    logic.find('usercollection', {
        username: usernameVal
    }).then(function (items) {
        if (items.length != 0) {
            var searchId = items[0]._id;
            return logic.find('corpcollection', {
                userid: searchId
            });
        }
    }).then(function (items) {
        if (items.length != 0) {
            corpId = items[0]._id;
            // Basicaly we don't allow users to access to some field of the document
            return logic.find('docCollection', {
                corp: corpId,
                virtualAccess: true
            }, {
                corp: 0,
                content: 0,
                virtualAccess: 0
            });
        }
    }).then(function (items) {
        if (items.length != 0) {
            docArray = items;
            res.send(items);
        }
    });
});


// EMPLOYEE
router.get('/docList/:corp/:username', function (req, res) {

    var docArray = {};
    var docArray.publicAdmin = [];
    var docArray.private = [];
    var employeeArray = [];

    /*
    custom access for individual documents or compagnie documents
    the representatives should access for a larger range of documents than employee
    */

    var db = req.db;
    var usernameVal = req.params.username;
    var corp = req.params.corp;
    var corpId;

    logic.find('corpcollection', {
        corpName: corp
    }).then(function (items) {
        if (items.legth != 0) {
            var currentType;
            corpId = items[0]._id;
            employeeArray = items[0].employee;
            employeeArray.forEach(function (elt, index) {
                if (elt.username == usernameVal) {
                    currentType = elt.type;
                }
            });
            return currentType;
        }
    }).then(function (type) {
        // TASK 1 AND TASK 2 NEEDED TO BE DONE
        if (type == "representatives") {
            // task 1
            db.collection('docCollection').find({
                corp: corpId,
                authorisation:{$lt: 3}
            }, {
                corp: 0,
                content: 0,
                virtualAccess: 0
            }).toArray(function (err, result) {
                docArray.publicAdmin = result;
            });
            
            // task 2
            db.collection('docCollection').find({
                corp: corpId,
                owner: usernameVal,
                authorisation: 3
            }, {
                corp: 0,
                content: 0,
                virtualAccess: 0
            }).toArray(function (err, result) {
                docArray.private = result;
            });
            // CONCAT RESULT HERE
            
        }else if(type == "employee"){
            db.collection('docCollection').find({
                corp: corpId,
                owner: usernameVal
            }, {
                corp: 0,
                content: 0,
                virtualAccess: 0
            }).toArray(function (err, result) {
                docArray.private = result;
            });
        }
        res.send(docArray);
    });
});


// PUBLIC
router.get('/docList/:corp/:username', function (req, res) {

    var docArray = {};
    var docArray.publicAdmin = [];
    var docArray.private = [];
    var employeeArray = [];

    /*
    custom access for individual documents or compagnie documents
    the representatives should access for a larger range of documents than employee
    */

    var db = req.db;
    var usernameVal = req.params.username;
    var corp = req.params.corp;
    var corpId;

    logic.find('corpcollection', {
        corpName: corp
    }).then(function (items) {
        if (items.legth != 0) {
            var currentType;
            corpId = items[0]._id;
            return corpId
        }
    }).then(function (corpId) {
        
            db.collection('docCollection').find({
                corp: corpId,
                owner: usernameVal,
                authorisation: 1
            }, {
                corp: 0,
                content: 0,
                virtualAccess: 0
            }).toArray(function (err, result) {
                docArray.private = result;
            });
        res.send(docArray);
    });
});



// VIEW A DOCUMENT CONTENT
// PUBLIC
router.get('/docList/:corp/:username', function (req, res) {

    var docArray = {};
    var docArray.publicAdmin = [];
    var docArray.private = [];
    var employeeArray = [];

    /*
    custom access for individual documents or compagnie documents
    the representatives should access for a larger range of documents than employee
    */

    var db = req.db;
    var usernameVal = req.params.username;
    var corp = req.params.corp;
    var corpId;

    logic.find('corpcollection', {
        corpName: corp
    }).then(function (items) {
        if (items.legth != 0) {
            var currentType;
            corpId = items[0]._id;
            return corpId
        }
    }).then(function (corpId) {
        
            db.collection('docCollection').find({
                corp: corpId,
                owner: usernameVal,
                authorisation: 1
            }, {
                corp: 0,
                content: 0,
                virtualAccess: 0
            }).toArray(function (err, result) {
                docArray.private = result;
            });
        res.send(docArray);
    });
});

module.exports = router;