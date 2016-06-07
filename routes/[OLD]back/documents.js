var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;

/* 
 * ------------------- Documents ---------------------- *
 */

/*
 * GET Historic List.
 */

router.get('/searchDoc/:cin/:level', function (req, res) {
    var db = req.db;
    switch (req.params.level) {
    case 'employee':
        var docLevel = 2;
        break;
    case 'user':
        var docLevel = 3;
        break;
    case 'guest':
        var docLevel = 1;
        break;
    }
    var employeecin = req.params.cin;
    db.collection('formHistoricCollection').find({
        Cin: employeecin,
        level : { "&lte" : docLevel } 
    }).toArray(function (err, items) {
        res.json(items);
    });
});

router.get('/searchDocById/:id', function (req, res) {
    var db = req.db;
    var docId = req.params.id;
    db.collection('formHistoricCollection').find({
        _id: new ObjectID(docId) 
    }).toArray(function (err, items) {
        res.json(items);
    });
});

router.put('/modifyValidity/:id', function (req, res) {
    var db = req.db;
    var tempToUpdate = req.params.id;
    db.collection('formHistoricCollection').update({
        _id: new ObjectID(tempToUpdate)
    }, {
        $set: {
            "validity": 0,
            "Resiliate": new Date().getTime()
        }
    }, function (err, result) {
        res.send(
            (err === null) ? {
                msg: ''
            } : {
                msg: err
            }
        );
    });
});



module.exports = router;