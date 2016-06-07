var express = require('express');
var util = require('util');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;
var Q = require("q");
var logic = require("../utils/logicalDB.js");

router.get('/showslider/:reg', function (req, res) {
    var db = req.db;
    var key = {
        corpName: req.params.reg
        };

    logic.find('corpcollection',key).then(function (items) {
        if(items.length !=0 ){
            res.render('utils/slider', {corpName: items[0].corpName, corpLocation: items[0].corpLocation });
        }
    });

});

module.exports = router;