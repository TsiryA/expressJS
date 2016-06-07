var Q = require('q');
var express = require('express');
var router = express.Router();
var valueCheck = require("./valueChecker.js");
var logic = require("./logicalDB.js");


//---------------------------- CHECK USER -----------------------------------//
exports.checkUser = function (userObj) {
    var deferred = Q.defer();
    var username = userObj.username;
    var email = userObj.email;
    valueCheck.valueTest("alphanumericspace", 4, 14, username).then(function (result) {
        if (result.validate) {
            return valueCheck.validateEmail(userObj.email);
        } else {
            result.msg = 'Username : ' + result.msg;
            deferred.resolve(result);
        }
    }).then(function (result) {
        if (result.validate) {
        } else {
            result.msg = 'Email : ' + result.msg;
        }
        deferred.resolve(result);
    });
    
    return deferred.promise;
}

//----------------------------- CHECK CORP (XLS FILE: OBSELETE) -------------//
exports.checkCorp = function (corp) {
    var deferred = Q.defer();
    var stage = '';
    valueCheck.valueTest("alphanumericspace", 4, 20, corp.name).then(function (result) {
        if (result.validate) {
            return valueCheck.valueTest("alphanumericspace", 4, 40, corp.adress);
        } else {
            result.msg = 'Corp name : ' + result.msg;
            deferred.resolve(result);
        }
    }).then(function (result) {
        if (result.validate) {
            return valueCheck.valueTest("allnumeric", 4, 20, corp.registrationnumber);
        } else {
            result.msg = 'Corp Adress : ' + result.msg;
            deferred.resolve(result);
        }
    }).then(function (result) {
        if (result.validate) {
            return valueCheck.valueTest("alphanumericspace", 4, 40, corp.representative[0].fullname);
        } else {
            result.msg = 'Corp Reg num : ' + result.msg;
            deferred.resolve(result);
        }
    }).then(function (result) {
        if (result.validate) {
            return valueCheck.validateEmail(corp.representative[0].Mail);
        } else {
            result.msg = 'Corp Rep Fullname : ' + result.msg;
            deferred.resolve(result);
        }
    }).then(function (result) {
        if (result.validate) {
            return valueCheck.valueTest("alphanumericspace", 4, 40, corp.representative[0].position);
        } else {
            result.msg = 'Corp Rep mail : ' + result.msg;
            deferred.resolve(result);
        }
    }).then(function (result) {
        result.msg = 'Corp Rep position : ' + result.msg;
        deferred.resolve(result);
    });
    return deferred.promise;
}

//----------------------------- CHECK POSTE --------------------------------//
exports.checkPost = function (postObj) {
    var deferred = Q.defer();
    valueCheck.valueTest("alphanumericspace", 4, 20, postObj.name).then(function (result) {
        if (result.validate) {
            return valueCheck.valueTest("alphanumeric", 4, 20, postObj.salary);
        } else {
            result.msg = 'Position name : ' + result.msg;
            deferred.resolve(result);
        }
    }).then(function (result) {
        if (result.validate) {
            return valueCheck.valueTest("alphanumeric", 4, 20, postObj.duration);
        } else {
            result.msg = 'Position salary : ' + result.msg;
            deferred.resolve(result);
        }
    }).then(function (result) {
        if (result.validate) {
            return valueCheck.valueTest("alphanumericspace", 4, 20, postObj.Corp);
        } else {
            result.msg = 'Position duration : ' + result.msg;
            deferred.resolve(result);
        }
    }).then(function (result) {
        result.msg = 'Position Corporation : ' + result.msg;
        deferred.resolve(result);
    });
    return deferred.promise;
}


//----------------------------- CHECK EMPLOYEE ----------------------------//
exports.checkEmployee = function (employee) {
    var deferred = Q.defer();
    valueCheck.valueTest("alphanumericspace", 4, 20, employee.Name).then(function (result) {
        if (result.validate) {
            return valueCheck.valueTest("alphanumericspace", 4, 20, employee.Firstname);
        } else {
            result.msg = 'Employee Name : ' + result.msg;
            deferred.reject(result);
        }
    }).then(function (result) {
        if (result.validate) {
            var genderArray = ["man","woman"];
            return valueCheck.validateArray(employee.Gender,genderArray);
        } else {
            result.msg = 'Employee Firstname : ' + result.msg;
            deferred.reject(result);
        }
    }).then(function (result) {
        if (result.validate) {
            var statusArray = ["single", "married","divorced","widowed","unknown"];
            return valueCheck.validateArray(employee.Status, statusArray);
        } else {
            result.msg = 'Employee gender : ' + result.msg;
            deferred.reject(result);
        }
    }).then(function (result) {
        if (result.validate) {
            return valueCheck.valueTest("allnumeric", 1, 2, employee.Children);
        } else {
            result.msg = 'Employee status : ' + result.msg;
            deferred.reject(result);
        }
    }).then(function (result) {
        if (result.validate) {
            return valueCheck.validateDate(employee.DateOfBirth);
        } else {
            result.msg = 'Employee children : ' + result.msg;
            deferred.reject(result);
        }
    }).then(function (result) {
        if (result.validate) {
            return valueCheck.valueTest("alphanumericspace", 4, 20, employee.PlaceOfBirth);
        } else {
            result.msg = 'Employee date of birth : ' + result.msg;
            deferred.reject(result);
        }
    }).then(function (result) {
        if (result.validate) {
            return valueCheck.valueTest("allLetter", 4, 15, employee.Nationality);
        } else {
            result.msg = 'Employee place of birth : ' + result.msg;
            deferred.reject(result);
        }
    }).then(function (result) {
        if (result.validate) {
            return valueCheck.valueTest("alphanumericspace", 1, 20, employee.Adress1);
        } else {
            result.msg = 'Employee nationality : ' + result.msg;
            deferred.reject(result);
        }
    }).then(function (result) {
        if (result.validate) {
            return valueCheck.valueTest("alphanumericspace", 1, 20, employee.Adress2);
        } else {
            result.msg = 'Employee adress 1 : ' + result.msg;
            deferred.reject(result);
        }
    }).then(function (result) {
        if (result.validate) {
            return valueCheck.valueTest("allnumeric", 1, 12, employee.Cin);
        } else {
            result.msg = 'Employee adress 2 : ' + result.msg;
            deferred.reject(result);
        }
    }).then(function (result) {
        if (result.validate) {
            return valueCheck.validateEmail(employee.Mail);
        } else {
            result.msg = 'Employee Cin : ' + result.msg;
            deferred.reject(result);
        }
    }).then(function (result) {
        if (!result.validate) {
            result.msg = 'Employee Mail : ' + result.msg;
            deferred.reject(result);
        }else{
            deferred.resolve(result);
        }
    });
    return deferred.promise;
}

//----------------------------- CORP BASIC INFO --------------------------//
exports.checkGeneralCorp = function (corp) {
    var deferred = Q.defer();
    valueCheck.valueExist(corp.corpName).then(function (result) {
        if (result.validate) {
            return valueCheck.valueExist(corp.corpAdress);
        } else {
            result.msg = 'Corp name : ' + result.msg;
            deferred.resolve(result);
        }
    }).then(function (result) {
        if (result.validate) {
            return valueCheck.valueExist(corp.corpLocation);
        } else {
            result.msg = 'Corp Adress : ' + result.msg;
            deferred.resolve(result);
        }
    }).then(function (result) {
        if (result.validate) {
            ;
        } else {
            result.msg = 'Corp Location : ' + result.msg;
        }
        deferred.resolve(result);
    });
    return deferred.promise;
}

//----------------------------- CORP XLS --------------------------//
exports.checkimportCorp = function (corp) {
    var deferred = Q.defer();
    valueCheck.valueTest("allnumeric", 4, 20, corp.registrationnumber).then(function (result) {
        if (result.validate) {
            return valueCheck.valueTest("alphanumericspace", 4, 40, corp.employee[0].fullname);
        } else {
            result.msg = 'Corp Reg num : ' + result.msg;
            deferred.resolve(result);
        }
    }).then(function (result) {
        if (result.validate) {
            return valueCheck.validateEmail(corp.employee[0].Mail);
        } else {
            result.msg = 'Corp Rep Fullname : ' + result.msg;
            deferred.resolve(result);
        }
    }).then(function (result) {
        if (result.validate) {
            return valueCheck.valueTest("alphanumericspace", 4, 40, corp.employee[0].position);
        } else {
            result.msg = 'Corp Rep mail : ' + result.msg;
            deferred.resolve(result);
        }
    }).then(function (result) {
        result.msg = 'Corp Rep position : ' + result.msg;
        deferred.resolve(result);
    });
    return deferred.promise;
}
