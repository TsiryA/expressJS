var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;
var util = require("util");
var fs = require("fs");


router.post("/upload", function (req, res, next) {
    if (req.files) {
        //console.log(util.inspect(req.files));

        if (req.files.myFile.size === 0) {
            return next(new Error("Hey, first would you select a file?"));
        }
        var db = req.db;
        var currentFile = req.files.myFile;
        currentFile.owner = req.body.userid;

        db.collection('filesCollection').insert(currentFile, function (err, result) {
            console.log(
            (err === null) ? { msg: '' } : { msg: err }
            );
        });
        
        //$addToSet
        db.collection('corpcollection').update({
            userid: new ObjectID(req.body.userid)
        }, {
            $addToSet: {
                "images": {"name": currentFile.originalname , "path" : currentFile.path}
            }
        }, function (err, result) {
            res.send({
                error : err,
                result: result
            });
        });
    }
});



module.exports = router;