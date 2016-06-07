var express = require('express');
var util = require('util');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;
var Q = require("q");
var logic = require("./utils/logicalDB.js");
var objCheck = require("./utils/objectChecker.js");


                        /***********************/
                        /* PROMISES: CHECK AND */
                        /***********************/

/*------------------------------ BASICS ----------------------------------*/

var basicInfo = function (elt) {
    var deferred = Q.defer();
    elt.userid = new ObjectID(elt.userid);
    objCheck.checkGeneralCorp(elt).then(function (result) {
        if (result.validate) {
            return logic.insert('corpcollection', elt);
        } else {
            result.msg = 'CORP_ERROR_' + result.msg;
            result.validate = false;
            deferred.resolve(result);
        }
    }).then(function (result) {
        deferred.resolve(result);
    });
    return deferred.promise;
}

/*-------------------***********************--------------------------------------*/
                    /*     ROUTING DATA    */
/*-------------------***********************-------------------------------------*/

//--------------------- NEW CORP DATA ----------------------------//
router.post('/addnewcorp', function (req, res) {
    var db = req.db;
    var corpData = req.body;
    basicInfo(corpData).then(function(result){
        if (result.validate) {
            res.send({
                msg: 'SUCCESS'
            });
        } else {
            res.send({
                msg: ''
            });
        }
    });
});

module.exports = router;