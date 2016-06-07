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

/*------------------------------ POST ----------------------------------*/

var check_addPoste = function (elt) {
    var deferred = Q.defer();
    objCheck.checkPost(elt).then(function (result) {
        if (result.validate) {
            return logic.insert('posteCollection', elt);
        } else {
            result.msg = 'POSTE_ERROR_LINE_' + index + '_' + result.msg;
            result.validate = false;
            deferred.resolve(result);
        }
    }).then(function (result) {
        deferred.resolve(result);
    });
    return deferred.promise;
}

/*------------------------------ EMPLOYEE ----------------------------------*/

var check_Employee = function (elt) {
    var deferred = Q.defer();
    objCheck.checkEmployee(elt).then(function (result) {
        if (!result.validate) {
            result.msg = 'EMPLOYEE_ERROR_LINE_' + index + '_' + result.msg;
            result.validate = false;
            deferred.resolve(result);
        }
    }).then(function (result) {
        deferred.resolve(result);
    });
    return deferred.promise;
}

/*------------------------------ CORP ----------------------------------*/

var check_addCorp = function (elt) {
    var deferred = Q.defer();
    objCheck.checkCorp(elt).then(function (result) {
        if (result.validate) {
            return logic.insert('corpcollection', elt);
        } else {
            result.msg = 'CORP_ERROR_LINE_' + index + '_' + result.msg;
            result.validate = false;
            deferred.resolve(result);
        }
    }).then(function (result) {
        deferred.resolve(result);
    });
    return deferred.promise;
}

/*-------------------***********************--------------------------------------*/
                    /*    TREATING DATA    */
/*-------------------***********************-------------------------------------*/


//Treating UserValue
var treatEmployee = function (arrayEmployee) {
    var deferred = Q.defer();
    var tasks = [];
    // Treat element one by one
    arrayEmployee.forEach(function (elt, index) {
        elt.username = elt.Cin;
        // adding all element treatement to task
        tasks.push(check_Employee(elt));
    });

    //done all task
    Q.all(tasks).then(function (results) {
        results.validate = true;
        deferred.resolve(results);
    });

    return deferred.promise;
}



//Treating Postes
var treatPoste = function (arrayPoste, corp) {
    var deferred = Q.defer();
    var tasks = [];

    arrayPoste.forEach(function (elt, index) {
        elt.Corp = corp;
        tasks.push(check_addPoste(elt));
    });

    Q.all(tasks).then(function (results) {
        results.validate = true;
        deferred.resolve(results);
    });

    return deferred.promise;
}

//Treating Corporation
var treatCorp = function (arrayCorp, arrayEmployee) {
    var deferred = Q.defer();
    var tasks = [];
    arrayCorp.forEach(function (elt, index) {
        elt.representative = [{
            fullname: elt.repFullname,
            mail: elt.repMail,
            position: elt.repPosition
        }];
        elt.employee = arrayEmployee;
        delete elt.repFullname;
        delete elt.repMail;
        delete elt.repPosition;
        tasks.push(check_addCorp(elt));
    });
    Q.all(tasks).then(function (results) {
        results.validate = true;
        deferred.resolve(results);
    });
    return deferred.promise;
}

/*-------------------***********************--------------------------------------*/
                    /*     ROUTING DATA    */
/*-------------------***********************-------------------------------------*/


router.get('/templateFile', function (req, res) {
    var path = 'MyCorpData.xls';
    res.sendfile(path, {
        'root': './uploads/'
    });
});

router.post('/importingBase/:corpName', function (req, res) {
    var db = req.db;
    var companie = req.body.Company;
    var poste = req.body.Postes;
    var employee = req.body.Employee;
    var baseTitle = req.params.baseName;
    var corpName = req.params.corpName;

    treatPoste(poste, corpName).then(function(result){
        if (result.validate) {
            return treatEmployee(employee);
        } else {
            res.send({
                msg: result.msg
            });
        }
    }).then(function(result){
        console.log(result.validate);
        if (result.validate) {
            return treatCorp(companie, employee);
        } else {
            res.send({
                msg: result.msg
            });
        }
    });
});

module.exports = router;