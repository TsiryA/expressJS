var util = require("util");
var express = require('express');
var ObjectID = require('mongodb').ObjectID;
var Q = require("q");
var mongo = require('mongoskin');
//-------------------------- DB ACCESS ---------------------------//
var config = require('config.json')('./defaultData.json');
var dbconf = config.dataBase;
var dburl = "";
if(dbconf.dbuser != "" && dbconf.dbpass != ""){
    dburl = dbconf.dbtype + "://" + dbconf.dbuser + ":" + dbconf.dbpass + "@" + dbconf.dbhost + ":" + dbconf.dbport + "/" + dbconf.dbname;
}else{
    dburl = dbconf.pureurl;
}
var db = mongo.db(dburl, {
    native_parser: true
});


//insert data
exports.insert = function (collectionTitle, elt) {
    var deferred = Q.defer();
    db.collection(collectionTitle).insert(elt, function (err, result) {
        deferred.resolve(result);
    });
    return deferred.promise;
}


//---------------------- GET ALL COMPAGNIE HOME SEARCH ----------------------------//
exports.findCorpNameOnly = function () {

    var deferred = Q.defer();
    db.collection('corpcollection').find({}, {
        corpName: 1,
        _id: 0
    }).toArray(function (err, result) {
        deferred.resolve(result);
    });
    return deferred.promise;
}

//---------------------- GET ALL ELEMENT FOR MARKER ----------------------------//
exports.findelementMarker = function (key) {

    var deferred = Q.defer();
    db.collection('corpcollection').find(key, {
        corpName: 1,
        corpAdress: 1,
        corpLocation: 1,
        corpDescription: 1

    }).toArray(function (err, result) {
        deferred.resolve(result);
    });
    return deferred.promise;
}

//getting current time
exports.getCurrentTime = function () {
    var d = new Date();
    var currentTime = d.getTime();
    return currentTime;
}

//overwritting data
exports.overwrite = function (collectionTitle, eltSpec, eltUpdate) {
    var deferred = Q.defer();
    db.collection(collectionTitle).update(eltSpec, eltUpdate, function (err, result) {
        deferred.resolve(err, result);
    });
    return deferred.promise;
}

//updating data
exports.update = function (collectionTitle, eltSpec, eltUpdate) {
    var deferred = Q.defer();
    db.collection(collectionTitle).update(eltSpec, {
        $set: eltUpdate
    }, function (err, result) {
        deferred.resolve(err, result);
    });
    return deferred.promise;
}

//addtoset
exports.updateaddtoset = function (collectionTitle, eltSpec, eltUpdate) {
    var deferred = Q.defer();
    db.collection(collectionTitle).update(eltSpec, {
        $addToSet: eltUpdate
    }, function (err, result) {
        deferred.resolve(err, result);
    });
    return deferred.promise;
}

//delete data
exports.delete = function (collectionTitle, eltSpec) {
    var deferred = Q.defer();
    db.collection(collectionTitle).remove(eltSpec, function (err, result) {
        deferred.resolve(err, result);
    });
    return deferred.promise;
}


// generate unique code
exports.alphanumeric_unique = function () {
    return Math.random().toString(36).split('').filter(function (value, index, self) {
        return self.indexOf(value) === index;
    }).join('').substr(2, 8);
}

// ================================== DB NATIVE ACTIONS =================== //
// Updating keys values
exports.updateKey = function(collectionTitle, eltSpec, objectChange){
	var deferred = Q.defer();
    db.collection(collectionTitle).update(eltSpec, {
		$set: objectChange
	}, function (err, result) {
        deferred.resolve(err, result);
    });
    return deferred.promise;
}

// Delete key
exports.deleteKey = function(collectionTitle, eltSpec, objectChange){
	var deferred = Q.defer();
    db.collection(collectionTitle).update(eltSpec, {
		$unset: objectChange
	}, function (err, result) {
        deferred.resolve(err, result);
    });
    return deferred.promise;
}

//finding data
exports.find = function (collectionTitle, elt) {

    var deferred = Q.defer();
    db.collection(collectionTitle).find(elt).toArray(function (err, result) {
        deferred.resolve(result);
    });
    return deferred.promise;
}



/* 
 * specified search in nested array
 */

exports.specifiedArraySearch = function(collectionTitle, arrayName, key, resultobject){
    /*
     * the data structure of the "elt" should be:
     * key = [
     *      {key: "key", value: "value"}
     *  ];
     *  resultobject = {
     *   '_id': '$_id',
     *   arrayName : {$push: arraytitle}
     * }
     */
    
    
    
    var deferred = Q.defer();
    var arrayTitle = "$" + arrayName;
    
    var keyObject = {};
    key.forEach(function (elt) {   
        keyObject[arrayName + ".public." + elt.key] = {
            "$in": [new RegExp(elt.value,"i")]
        };
    });
    
    
    db.collection(collectionTitle).aggregate([
        {
            $unwind: arrayTitle
        }, {
            '$match': {
                '$and': [
                    keyObject
                ]
            }
    }, {
            $group: resultobject
        }
    ], function (err, result) {
        deferred.resolve(result);
    });
    
    return deferred.promise;
};


/*

the pattern of the object changes when you want to affect an array element
OBJECT MODELE
==============================================================
    data = {
    "arrayName": object
}

*/

// Delete Array Element
exports.deleteArrayElement = function(collectionTitle, eltSpec, objectDelete){
	var deferred = Q.defer();
    db.collection(collectionTitle).update(eltSpec, {
		$pull: objectDelete
	}, function (err, result) {
        deferred.resolve(err, result);
    });
    return deferred.promise;
}

// add array element
exports.addArrayElement = function(collectionTitle, eltSpec, obejectAdd){
	var deferred = Q.defer();
    db.collection(collectionTitle).update(eltSpec, {
		$addToSet: obejectAdd
	}, function (err, result) {
        deferred.resolve(err, result);
    });
    return deferred.promise;
}


// ================================== TOOLS =============================== //
//find object element in array
exports.searchObjectArray = function(key,keyval, array){
    var size = array.length;
    for (var i = 0; i < size; i++){
        if(array[i][key] == keyval){
            return array[i];
        }
    }
}