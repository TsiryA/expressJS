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
        }
        deferred.resolve(result);
        return deferred.promise;
    }, function(result){
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


/*------------------------------ TREAT IMPORT CORP DB ----------------------------------*/

var import_corp = function (key, elt) {
    var deferred = Q.defer();
        var searchkey = key;
        searchkey.userid = new ObjectID(key.userid);
    objCheck.checkimportCorp(elt).then(function (result) {
        //console.log("Corp Val: " + util.inspect(elt, {showHidden: false, depth: null}) + "--->" + result.validate);
        if (result.validate) {
            return logic.update('corpcollection', searchkey, elt);
        } else {
            result.msg = 'CORP_ERROR_LINE_' + index + '_' + result.msg;
            result.validate = false;
            deferred.reject(result);
        }
    }).then(function (result) {
        deferred.resolve(result);
    }, function (result){
        deferred.resolve(result);
    });
    return deferred.promise;
}


/*-------------------***********************--------------------------------------*/
                    /*    TREATING DATA    */
/*-------------------***********************-------------------------------------*/


//------------------------ Treating UserValue ----------------------------------//
var treatEmployee = function (arrayEmployee) {
    var deferred = Q.defer();
    var tasks = [];
    // Treat element one by one
    
    arrayEmployee.forEach(function (elt) {
        
        elt.username = elt.Cin;
        elt.type = "employee";
        // adding all element treatement to task
        tasks.push(check_Employee(elt));
    });
    //done all task
    Q.all(tasks).then(function (results) {
        results.validate = true;
        deferred.resolve(results);
    }, function(results){
        results.validate = false;
        deferred.resolve(results);
    });

    return deferred.promise;
}

var createBackUp = function (obj){
    return JSON.parse(JSON.stringify(obj));
}
//-------------------------- Treating Postes --------------------------------------//
var treatPoste = function (arrayPoste, corp) {
    var deferred = Q.defer();
    var tasks = [];
    arrayPoste.forEach(function (elt, index) {
        delete elt.Corp;
        elt.Corp = corp;
        tasks.push(check_addPoste(elt));
    });

    Q.all(tasks).then(function (results) {
        results.validate = true;
        deferred.resolve(results);
    });

    return deferred.promise;
}

//--------------------------- Treating Corporation ----------------------------//
var treatCorp = function (key, arrayCorp, arrayEmployee) {
    var deferred = Q.defer();
    var tasks = [];
    arrayCorp.forEach(function (elt) {
        elt.employee = [{
            fullname: elt.repFullname,
            Mail: elt.repMail,
            position: elt.repPosition,
            type: "representatives"
        }];
        elt.employee[0].public = createBackUp(elt.employee[0]);
        arrayEmployee.forEach(function(element){
            delete element.Corporation;
            element.public = createBackUp(element);
            elt.employee.push(element);
        });
        //delete some attributes
        delete elt.name;
        delete elt.repFullname;
        delete elt.repMail;
        delete elt.repPosition;
        delete elt.adress;
        tasks.push(import_corp(key, elt));
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

//--------------------- GETTING TEMPLATE FILE ---------------------------------//
router.get('/templateFile', function (req, res) {
    var path = 'MyCorpData.xls';
    res.sendfile(path, {
        'root': './uploads/'
    });
});

//--------------------- IMPORTING DATA: XLS FILE ----------------------------//
router.post('/importingBase', function (req, res) {
    var db = req.db;
    
    /*
    req.body = {
        data:{
            Employee,
            Postes,
            Compagnie
        },
        key:{
            userid,
            copname
        }
    }
    */
    var data = req.body.data;
    var searchkey = req.body.key;
    var companie = data.Company;
    var poste = data.Postes;
    var employee = data.Employee;
    var corpName = searchkey.corpName;
    //treat array one by one
    
    
    treatPoste(poste, corpName).then(function(result){
        if (result.validate) {
            return treatEmployee(employee);
        } else {
            res.send({
                msg: result.msg
            });
        }
    }).then(function(result){
        if (result.validate) {
            return treatCorp(searchkey, companie, employee);
        } else {
            res.send({
                msg: result.msg
            });
        }
    }).then(function(result){
        res.send({
            msg: result.msg
        });
    });
});

module.exports = router;