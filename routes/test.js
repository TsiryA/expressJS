var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;
var Q = require("q");
var logic = require("./utils/logicalDB.js");
var objCheck = require("./utils/objectChecker.js");
var email = require("./utils/email.js");
var hashing = require("./utils/security/encryptions.js");
var qrCode = require("./qr/qr.js");

router.get('/testqr', function (req, res) {
		qrCode.testqr();
});

router.get('/testqrGen', function (req, res) {
		qrCode.generateqr("hide this text");
});

module.exports = router;