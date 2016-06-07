var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;
var Q = require("q");
var logic = require("../utils/logicalDB.js");
var objCheck = require("../utils/objectChecker.js");


/*
 * Routers =====================================================================
 */

// Change corporation informations
router.post('/saveChange/:userid', function (req, res) {
    var db = req.db;
    var elt = req.body;
    var key = req.params.userid;
    
    /*
    this function only check basics informations of a corporation:
    - name
    - adress
    - location
    in this case we don't mind if there are mistakes in the description and registration number at all
    DATA MODEL
    =========================================================================
    data = {
        corpName: "name"
        corpDescription: "Description"
    }
    */
    
    objCheck.checkGeneralCorp(elt).then(function (result) {
        if (result.validate) {
            return logic.find('corpcollection', {
                corpName: elt.corpName
            });
        } else {
            res.send({
                msg: "ERROR: INPUT DATA ERROR"
            });
        }
    }).then(function (items) {
        if (items.length == 0) {
            return logic.updateKey('corpcollection', {
                userid: new ObjectID(key)
            }, elt);
        } else {
            if (items[0].userid != new ObjectID(key)) {
                res.send({
                    msg: "Corp name already used"
                });
            }
        }
    }).then(function (result) {
        res.send({
            msg: '',
        });
    });

});

router.post('/slider', function (req, res) {
    var db = req.db;
    var elt = req.body.addinfo;
    var key = req.body.key;
    key.userid = new ObjectID(key.userid);
    
    logic.updateaddtoset("corpcollection",key,elt).then(function(){
        res.send({
            msg: ""
        });
    });

});

router.post('/getslider', function (req, res) {
    var db = req.db;
    var key = req.body;
    
    logic.find("corpcollection",key).then(function(items){
        if(items.length !=0){
            res.json(items[0].slider);
        }else{
            res.send({
                msg: ""
            });
        }
    });
});

module.exports = router;