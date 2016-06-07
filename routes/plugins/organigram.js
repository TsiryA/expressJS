var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;
var Q = require("q");
var logic = require("../utils/logicalDB.js");
var objCheck = require("../utils/objectChecker.js");
var email = require("../utils/email.js");


/*
 * Routers =====================================================================
 */



/*
 * ------------------ ORGANIGRAM VIEW ---------------------------
 */
router.get('/public/:reg', function (req, res) {
    var db = req.db;
    var key = {
        corpName: req.params.reg
        };

    logic.find('corpcollection',key).then(function (items) {
        if(items.length !=0 ){
            res.render('paper/crop_paper', {corpLocation: items[0].corpLocation });
        }
    });

});


router.post('/getInfo', function (req, res) {
    var db = req.db;
    var key = req.body;
    var corp;

    logic.find('corpcollection',key).then(function (items) {
        corp = items[0];
        var key2 = {
            _id: new ObjectID(corp.userid)
        };
        return logic.find('usercollection',key2);
    }).then(function (items) {
        var result = {
            corporation: corp,
            user: items[0]
        };
        res.send(result);
    });

});






module.exports = router;