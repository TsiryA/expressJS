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
 * ------------------ FIND FOR AUTOCOMPLETE LOCATION [Name Only]---------------------------
 */
router.get('/autocomplete', function (req, res) {
    var db = req.db;

    //console.log(JSON.stringify(key));
    logic.findCorpNameOnly().then(function (items) {
        res.send(items);
    });

});


/*
 * ------------------ FIND FOR MARKER CREATION ---------------------------
 */
router.get('/placeMarker/:reg', function (req, res) {
    var db = req.db;
    var key = {
        corpName: {
            $regex: '.*' + req.params.reg + '.*',
            $options: "s"
        }
    };

    logic.findelementMarker(key).then(function (items) {
        res.send(items);
    });

});



/*
 * ------------------ INSERT FAKE VALUES ---------------------------
 */
router.get('/insertPlace', function (req, res) {
    var db = req.db;
    var deferred = Q.defer();
    var tasks = [];


    var fakeData = {
        corpName: "Aspire Hotel Sydney",
        corpAdress: "383 - 389 Bulwara Rd, Sydney NSW 2000, Australie",
        corpLocation: "(-33.880399, 151.19861500000002)",
        corpDescription: "test",
        registrationnumber: "13216546"
    };
    
    
    for(var i = 0; i <= 20; i++){
        fakeData.corpName = logic.alphanumeric_unique();
        fakeData.corpDescription = logic.alphanumeric_unique();
        fakeData.corpAdress = logic.alphanumeric_unique();
        var lat = -33.880399 + Math.random();
        var lng = 151.19861500000002 + Math.random();
        fakeData.corpLocation = "(" + lat + "," + lng + ")";
        tasks.push(logic.insert('corpcollection', fakeData));
    };
    
    Q.all(tasks).then(function (results) {
        deferred.resolve(results);
    });

});



module.exports = router;