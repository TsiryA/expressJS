var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;
var Q = require("q");
var logic = require("../utils/logicalDB.js");
var logicdb = require("../mongodb/logic.js");



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

/*

This class is for routing all request concernig employee
Theoritically we don't need corporations or user to access to an'employee data
in the model employee is an array object
there is 2 ways to access to data:
1 - using index like in organigram
2 - using $elemMatch a mongoDB native request

There is also 2 options to modify data
1 - overwrite all data: you need to backup all specifications
2 - just overwrite specified field

*/

// ==================================== FIND ============================= //
// all employee in a corp
router.get('/findAll/:userid', function (req, res) {

    var key = {};
    key.userid = new ObjectID(req.params.userid);

    logic.find('corpcollection', key).then(function (items) {
        if (items.length != 0) {
            var result = {};
            result.corp = items[0]._id;
            result.employee = items[0].employee;
            res.json(result);
        }
    })
});

// specified employee
router.get('/find/:username/:type', function (req, res) {
    /*
    in the model we set that the data for representatives and simple employee
    does not have the same structure (caused in the template file)
    so we need to separate them but using a same routing because they are also employee
    */

    // we separate representatives and simple employee by their types
    var data = {}; // key used to locate the corp
    var dataKey = {}; // key used to locate the employee object

    
    // find the corp first
    var key = {
        collection: "corpcollection",
        arrayname: "employee",
        object: []
    };
    
    
    
    if (req.params.type == "representatives") {
        data = {

            fullname: req.params.username,
            type: req.params.type
        };
        key.object.push({key:"type", value: req.params.type});
        
        dataKey = {
            key: "fullname",
            value: req.params.username
        };
    } else {
        data = {
            username: req.params.username,
            type: req.params.type
        };
        key.object.push({key:"type", value: req.params.type});
        dataKey = {
            key: "username",
            value: req.params.username
        };
    }
    
    key.object.push(dataKey);
    
    var projection = {
        arrayname: "employee",
        projection:[
            {key: "employee", value:"$employee"}
        ]
    };
    
    logicdb.array_search(key, projection).then(function(result){
        console.log(JSON.stringify(result, null, 4));
    });
    
    
    
   
    db.collection('corpcollection').find({
        employee: {
            $elemMatch: data
        }
    }).toArray(function (err, result) {
        if (result.length != 0) {
            // searching the employee in the employee array
            var currentEmployee = logic.searchObjectArray(dataKey.key, dataKey.value, result[0].employee);
            res.send(currentEmployee);
        }
    });
});

// find using post command
router.post('/findOne', function (req, res) {
    // input elements
    var collectionName = "corpcollection";
    var arrayName = "employee";
    var key = req.body.key;
    var resultForm = req.body.result;

    // search function
    logic.specifiedArraySearch(collectionName, arrayName, key, resultForm).then(function(result){
        res.send(result);
    });
});

// ============================ ADD =========================================== //
// add new employee 
router.post('/addEmployee/:corpName', function (req, res) {
    /*

    adding an employee is updating the employee array of the compagnie
    by adding a lew element in it.

    */
    var db = req.db;
    var key = {
        corpName: req.params.corpName
    };
    var employeeData = {
        employee: req.body
    };

    logic.addArrayElement('corpcollection', key, employeeData).then(function () {
        res.send({
            msg: ""
        });
    });
});

// =========================== REMOVE ========================================= //

// remove all employee (representatives not included)
router.get('/dropEmployee/:corpName', function (req, res) {
    /*
    for some reasons we need to be able to remove all employee
    we suggest to not include representatives for safety
    */
    var db = req.db;
    var key = {
        corpName: req.params.corpName
    };

    db.collection('corpcollection').update(key, {
        $pull: {
            employee: {
                type: "employee"
            }
        }
    }, function (err, result) {
        res.send({
            msg: "All employee deleted"
        });
    });
});

// remove specified employee
router.post('/remove/:corpName', function (req, res) {
    /*

    we are going to remove a specified employee of any type
    to remove the employee we don't need a perfect match
    but at least whe should use 2 or 3 keys to specify the employee to delete

    */
    var db = req.db;
    var key = {
        corpName: req.params.corpName
    };
    var employeeData = {
        employee: req.body
    };

    logic.deleteArrayElement('corpcollection', key, employeeData).then(function () {
        res.send({
            msg: ""
        });
    });
});


// ============================= UPDATE ====================================== //

router.post('/update/:corpName', function (req, res) {
    {
        /*
        update an employee data
        We suppose that there are 3 levels of informations for all employee
        1 - About the employee
            * General informations
            * Details
        2 - Work
        3 - Contacts

        On the data structure we're gonna set in the client side
        for simplicity we're gonna send also the identification of the employee
        bruteData = {
            key,
            data
        } 
        basically we use username, mail to detect the employee
        DATA MODEL
        =================================================================
        About > general
        data = {
            "employee.$.Firstname": "firstname",
            "employee.$.Name": "name",
            "employee.$.Status": "Status",
            "employee.$.Gender": "Gender"
        }

        About > detail
        data = {
            "employee.$.Children": "child",
            "employee.$.DateOfBirth": "date",
            "employee.$.PlaceOfBirth": "place",
            "employee.$.Nationality": "nationality"
        }

        Work
        data = {
            "employee.$.Poste": "poste"
        }

        Contact
        data = {
            "employee.$.Adress1": "adress",
            "employee.$.Adress2": "adress",
            "employee.$.Mail": "mail",  (employee.$.mail for representatives)
            "employee.$.Cin": "cin"
        }
        */
    }

    var db = req.db;
    var updateobject = req.body;
    var key = {
        corpName: req.params.corpName,
        employee: updateobject.key
    };
    var newdata = updateobject.data;
    logic.updateKey('corpcollection', key, newdata).then(function () {
        res.send({
            msg: ""
        });
    });
});


// upgrade
router.post('/upgrade/:corpName', function (req, res) {
    {


        /*upgrade an amployee means change his type
        1 - need to change type and create fullname and change mail key add position
        2 - remove key Poste
        bruteData = {
            key,
            data
        }*/
    }

    var db = req.db;

    var updateobject = req.body; // brute data
    var data = updateobject.data; // the original value

    var key = {
        corpName: req.params.corpName,
        employee: data
    };
    // the values need to be set
    var newData = {
        "employee.$.fullname": data.Name + " " + data.Firstname,
        "employee.$.type": "representatives"
    };

    logic.updateKey('corpcollection', key, newData).then(function () {
        res.send({
            msg: ""
        });
    });

});

// downgrade
router.post('/downgrade/:corpName', function (req, res) {
    {


        /*upgrade an amployee means change his type
        Downgrade
        1 - change values and add values
            Type: employee
            Name: fullname.split[0]
            Firstname: fullname.split[1]
            Mail: Mail
            Poste: position
        2 - delete key:
            Fullname
            Position
        =============================================
        bruteData = {
            key,
            data
        }*/
    }

    var db = req.db;

    var updateobject = req.body; // brute data
    var data = updateobject.data; // the original value

    var key = {
        corpName: req.params.corpName,
        employee: data
    };
    var nameArray = data.fullname.split(' ');
    var Name = nameArray[0];
    var FirstName = "";
    for (var i = 1; i < nameArray.length; i++) {
        FirstName = FirstName + nameArray[i];
    };
    // the values need to be set
    var newData = {
        "employee.$.Name": Name,
        "employee.$.Firstname": FirstName,
        "employee.$.type": "employee",
    };

    logic.updateKey('corpcollection', key, newData).then(function () {
        res.send({
            msg: ""
        });
    });

});

// remove specified employee
router.post('/detach/:corpName', function (req, res) {
    /*

    deleted employee is transfered in a virtual corporation so all the data will be available but
    by another routes.

    */
    var db = req.db;
    var key = {
        corpName: req.params.corpName
    };
    var defaultKey = {
        corpName: "unattached"
    };

    //var currentEmployee = req.body;
    //currentEmployee.type = "employee"; // when people get fired the type is automaticaly get to employee
    // and his position is set to "unemployed"

    var employeeData = {
        employee: req.body
    };

    var historyEntry = {
        corpName: "unattached",
        newposition: "unemployed",
        date: logic.getCurrentTime().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    };


    logic.deleteArrayElement('corpcollection', key, employeeData).then(function () {
        employeeData.employee.type = "employee";
        employeeData.employee.position = "unemployed";
        employeeData.employee.history.push(historyEntry);
        return logic.addArrayElement('corpcollection', defaultKey, employeeData);
    }).then(function () {
        res.send({
            msg: ""
        });
    });
});

// find index
router.post('/generateLink/:corpName', function (req, res) {
    /*

    deleted employee is transfered in a virtual corporation so all the data will be available but
    by another routes.

    */
    var db = req.db;
    var key = {
        corpName: req.params.corpName
    };
    var currentEmployee = req.body;

    logic.find('corpcollection', key).then(function (items) {
        if (items.length != 0) {
            var employee = items[0].employee;
            employee.forEach(function (element, index) {
                if (element.type == currentEmployee.type && element.username == currentEmployee.username && currentEmployee.username !== undefined) {
                    res.send({
                        msg: "",
                        link: "http://localhost:3000/testing/showFront/" + items[0]._id + "/" + index
                    });
                };
                if (element.type == currentEmployee.type && element.fullname == currentEmployee.fullname && currentEmployee.fullname !== undefined) {
                    res.send({
                        msg: "",
                        link: "http://localhost:3000/testing/showFront/" + items[0]._id + "/" + index
                    });
                };
            });
        } else {
            res.send({
                msg: "No link available"
            });
        }
    });
});


router.post('/importingBase', function (req, res) {
    var db = req.db;
    var data = req.body.data;
    var employee = data.Employee;
    var corpName = searchkey.corpName;
    //treat array one by one
    treatemployee(employee).then(function (result) {

        if (result.validate) {
            res.send({
                msg: ""
            });
        } else {
            res.send({
                msg: result.msg
            });
        }
    });
});


// change the position
/*
we expect that employee does not have the right to change his position in the corporation
so this route is only vailable for the user only.
*/
router.post('/changePosition/:corpName', function (req, res) {
    var db = req.db; {


        /*upgrade an amployee means change his type
        1 - need to change type and create fullname and change mail key add position
        2 - remove key Poste
        bruteData = {
            key,
            data
        }*/
    }


    var brutedata = req.body; // brute data
    var key = {
        corpName: req.params.corpName,
        employee: brutedata.key
    }; // the original value

    var newData = {
        "employee.$.position": brutedata.data.position
    };

    var empHistory = {
        corpName: req.params.corpName,
        newposition: brutedata.data.position,
        date: logic.getCurrentTime()
    };

    logic.updateKey('corpcollection', key, newData).then(function () {
        key.employee.position = brutedata.data.position;
        return logic.updateaddtoset('corpcollection', key, {
            "employee.$.history": empHistory
        });
    }).then(function () {
        res.send({
            msg: ""
        });
    });
});


// ================================= DOCUMENTS ================================= //

// we store documents in the database so it solve
/*
1 - the object conflict
2 - the storage space

DATA STRUCTURE
=============================================
    document = {
    title: "title of the groupt"
    date: "the uploading date"
    description: "few lines to describe the pack"
    files:[
            {file, data(data64) } (each file is saved in 2 parts the brute file and the data in it)
        ] 
    }
    
    employee = {
        ...
        documents: [document],
        ...
    }
*/

router.post('/addDocuments/:corpName', function (req, res) {
    var db = req.db;


    var brutedata = req.body; // brute data
    var key = {
        corpName: req.params.corpName,
        employee: brutedata.key
    }; // the original value
    
    //console.log(JSON.stringify(brutedata.documentnewEnrty,null,4));
    var newDocument = brutedata.documentnewEnrty;
    newDocument.date = logic.getCurrentTime();

    var newData = {
        "employee.$.documents": newDocument
    };


    logic.updateaddtoset('corpcollection', key, newData).then(function () {
        res.send({
            msg: ""
        });
    });

});


// searching documents
router.post('/ducuments/all/:corpName', function (req, res) {
    // input elements
    var collectionName = "corpcollection";
    var arrayName = "employee.documents";
    var key = req.body.key;
    var resultForm = req.body.result;

    // search function
    logic.specifiedArraySearch(collectionName, arrayName, key, resultForm).then(function(result){
        //console.log(JSON.stringify(result,null,4));
        res.send(result);
    });
});




// ====================== FUNCTIONS =========================== //
{
    /*
    adding employee from file:
    the file should have the same patter as the template so
    we suggest to use the template file
    */

    var treatEmployee = function (arrayEmployee) {
        var deferred = Q.defer();
        var tasks = [];
        // Treat element one by one
        arrayEmployee.forEach(function (elt, index) {
            elt.username = elt.Cin;
            elt.type = "employee";
            // adding all element treatement to task
            tasks.push(check_Employee(elt));
        });
        //done all task
        Q.all(tasks).then(function (results) {
            results.validate = true;
            deferred.resolve(results);
        });

        return deferred.promise;
    };



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
    };
}

module.exports = router;