var util = require("util");
var express = require('express');
var ObjectID = require('mongodb').ObjectID;
var Q = require("q");
var mongo = require('mongoskin');
//-------------------------- DB ACCESS ---------------------------//
var config = require('config.json')('./defaultData.json');
var dbconf = config.dataBase;
var dburl = "";
if (dbconf.dbuser != "" && dbconf.dbpass != "") {
    dburl = dbconf.dbtype + "://" + dbconf.dbuser + ":" + dbconf.dbpass + "@" + dbconf.dbhost + ":" + dbconf.dbport + "/" + dbconf.dbname;
} else {
    dburl = dbconf.pureurl;
}
var db = mongo.db(dburl, {
    native_parser: true
});

// ================================= MONGO DB BASICS ========================= //

//all basic functions in mongo db

// --------------------------------- ADDING --------------------------------- //
// add an element in a collection
exports.insert = function (collectionTitle, elt) {
    var deferred = Q.defer();
    db.collection(collectionTitle).insert(elt, function (err, result) {
        deferred.resolve(result);
    });
    return deferred.promise;
}

// add an element in an array in a document
exports.array_insert = function (key, elt) {

    /*
    elt is an array of object
    key contain all data used to locate the specified Array
    KEY TEMPLATE
    ======================================================
    key = {
        collection: "collection_name",
        document: "<object_used_to_select_document>",
        arrayname: "arrayname"
    };
    
    
    for nested array
    KEY TEMPLATE
    ======================================================
    key = {
        collection: "collection_name",
        document: "<object_used_to_select_document><object_used_to_select_nested_array>",
        arrayname: "arrayname.$.nestedarrayname"
    };
    */

    var insert_element = {};
    insert_element[key.arrayname] = {
        "$each": elt
    };

    var deferred = Q.defer();
    db.collection(key.collection).update(key.document, insert_element, function (err, result) {
        deferred.resolve(result);
    });
    return deferred.promise;
}

// --------------------------------- MODIFY -------------------------------- //

exports.update = function (key, elt) {

    /*
    to update an element
    KEY TEMPLATE
    ===============================================================================
    key = {
        collection: "collectionname",
        document: {
            level1_spec: "spec",
            "level1_spec.level2_spec": "spec" 
        }
    }
    
    ELT TEMPLATE
    ==============================================================================
    elt = {
        level1_spec: "spec",
        "level1_spec.$.level2_spec": "spec",
        "level1_array.$": "spec" ==> used to change a value of an array element
    }
    */

    var modif_element = {};
    modif_element["$set"] = elt;

    var deferred = Q.defer();
    db.collection(key.collection).update(key.document, modif_element, function (err, result) {
        deferred.resolve(result);
    });
}

// -------------------------------- DELETE --------------------------------- //

exports.delete = function (key) {

    /*
    we assume to delete all element matching the data
    KEY TEMPLATE
    ==========================================================================
    key = {
        collection: "collectionname",
        object: "<matching>"
    };
    */

    var deferred = Q.defer();

    db.collection(key.collection).remove(key.object, function (err, result) {
        deferred.resolve(err, result);
    });
}

// ------------------------------- FIND ---------------------------------- //
exports.find = function (key, projection) {

    /*
    find return only the document matching the search
    projection is the output template
    KEY TEMPLATE
    ============================================================
    key = {
        collection: "collectionname",
        object: "<object>"
    };
    */

    var deferred = Q.defer();
    db.collection(key.collection).find(key.object, projection).toArray(function (err, result) {
        deferred.resolve(result);
    });
    return deferred.promise;
}

// ------------------------------ AGGREGATE ----------------------------- //
exports.array_search = function (key, projection) {

    /*
    aggregate is used to get a specified result of search
    usualy used for array or nested array search
    aggregate have 3 part:
        - match: detect mathing element
        - unwind: decompose the document to get precise data
        - projection: "group" or "project" format of the result
    KEY TEMPLATE
    =======================================================================
    key = {
        collection: "collectionname",
        arrayname: "arrayname",
        object: [
           {key: "key", value: "value"},
           {key: "key", value: "value"}
       ]
    };
    
    PROJECTION TEMPLATE
    ======================================================================
    
    projection = {
        arrayName: "arrayname",
        projection: [{
            key: "key",
            value: "$value.in.the.object"
        },{
            key: "key",
            value: "$value.in.the.object"
        }]
    };
    */
    var searchKey = []; // the key container
    var projectkey = {}; // create projection
    var keyObject = {}; // object for matching
    var matchingKey = {};



    // Create matching element
    key.object.forEach(function (elt) {
        keyObject[key.arrayname + "." + elt.key] = {
            "$in": [new RegExp(elt.value,'i')]
        };
    });


    // matching key structure
    matchingKey = {
        $match: {
            "$and": [
                keyObject
            ]
        }
    }

    searchKey.push(matchingKey);
    console.log(JSON.stringify(searchKey, null, 4));
    // create and add unwind
    incrementalKeys(key.arrayname).forEach(function (elt) {
        searchKey.push(elt);
    })


    // create projection



    var obj = {};
    projection.projection.forEach(function (elt) {
        obj[elt.key] = elt.value;
    });
    projectkey = {
        $group: {
            "_id": {
                "_id": "$_id"
            }
        }
    };
    projectkey["$group"][projection.arrayname] = {
        "$push": obj
    };
    searchKey.push(projectkey);

    var deferred = Q.defer();
    console.log("=====================NESTED====================");
    console.log(JSON.stringify(searchKey, null, 4));
    db.collection(key.collection).aggregate([{
        "$match": {
            "$and": [{
                "employee.type": {
                    "$in": [/employee/i]
                },
                "employee.username": {
                    "$in": [/13/i]
                }
            }]
        }
    }, {
        "$unwind": "$employee"
    }, {
        "$group": {
            "_id": {
                "_id": "$_id"
            },
            "employee": {
                "$push": {
                    "employee": "$employee"
                }
            }
        }
    }], function (err, result) {
        console.log(JSON.stringify(err, null, 4));
        deferred.resolve(result);
    });
    return deferred.promise;
}



function incrementalKeys(longkey) {

    /*
    function used to create incremental level of keys
    long key ex = "person.children.name"
    */

    var minKeys = [];
    minKeys = longkey.split('.');

    var incKey = [];
    var currKey = "$";
    minKeys.forEach(function (elt, index) {

        if (index == 0) {
            currKey += elt;
        } else {
            currKey += '.' + 'elt';
        }
        var obj = {
            '$unwind': currKey
        };
        incKey.push(obj);
    });
    return incKey;
}