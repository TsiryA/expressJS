var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;
var Q = require("q");
var logic = require("../utils/logicalDB.js");



var historyArray = [];
/*

this class is just to look or remove access history
as historic it should be stored by date
*/

/*
we are going to ad an unique route but defered result
the result depend of the level access of the request
- user & representatives: corporation access 
*/

// get access history
router.get('/gethistory/:username', function (req, res) {
    var db = req.db;
    var key = {
        username: req.params.username
    };
    
    logic.find('usercollection', key).then(function (items) {
        if (items.length != 0) {
            return logic.find('corpcollection', {
                userid: items[0]._id
            });
        } else {
            res.send({
                msg: "access violation"
            });
        }
    }).then(function (items) {
        if (items.length != 0) {
            historyArray = [];
            return employeeAccessList(items[0].employee, key.username);
        } else {
            res.send({
                msg: "Internal error"
            });
        }
    }).then(function () {
        res.json(historyArray);
    })
});


// clear history
router.get('/clearhistory/:username', function (req, res) {
    var db = req.db;
    var key = {
        username: req.params.username
    };
    logic.find('usercollection', key).then(function (items) {
        if (items.length != 0) {
            return logic.find('corpcollection', {
                userid: items[0]._id
            });
        } else {
            res.send({
                msg: "access violation"
            });
        }
    }).then(function (items) {
        if (items.length != 0) {
            return employeeAccessDelete(items[0].employee, key.username);
        } else {
            res.send({
                msg: "Internal error"
            });
        }
    }).then(function () {
        res.send({
            msg: ""
        });
    })
});



// ============================== function ============================ //
//GET HISTORY LIST
{
    function getAccesslist(usernameVal) {
        var deferred = Q.defer();
        logic.find('userAccessCollection', {
            username: usernameVal
        }).then(function(items){
            return addDataToArray(items);
        }).then(function(result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    }

    function addDataToArray(arrayStart){
        var deferred = Q.defer();
        var tasks = [];
        
         arrayStart.forEach(function (elt, index) {
            // adding all element treatement to task
            tasks.push(historyArray.push(elt));
        });
        //done all task
        Q.all(tasks).then(function (results) {
            results.validate = true;
            deferred.resolve(results);
        });        
        return deferred.promise;
    }
    
    function employeeAccessList(arrayEmployee, username) {
        var deferred = Q.defer();
        var tasks = [];
        // Treat element one by one
        tasks.push(getAccesslist(username));
        arrayEmployee.forEach(function (elt, index) {
            // adding all element treatement to task
            tasks.push(getAccesslist(elt.username));
        });
        
        //done all task
        Q.all(tasks).then(function (results) {
            results.validate = true;
            deferred.resolve(results);
        });

        return deferred.promise;
    }
}

// clear History
{
    function delAcessList(element) {
        var deferred = Q.defer();
        var data = {};
        if(element.type == "representatives")
        {
            data.username = element.fullname;
        }else{
            data.username = element.username;
        }
        logic.delete('userAccessCollection', data).then(function (result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    }


    function employeeAccessDelete(arrayEmployee, username) {
        var deferred = Q.defer();
        var tasks = [];
        // Treat element one by one
        tasks.push(delAcessList(username));
        arrayEmployee.forEach(function (elt, index) {
            // adding all element treatement to task
                tasks.push(delAcessList(elt));
        });
        //done all task
        Q.all(tasks).then(function (results) {
            results.validate = true;
            deferred.resolve(results);
        });

        return deferred.promise;
    }
}


module.exports = router;



