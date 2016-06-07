var Q = require('q');

exports.valueTest = function (type, minRange, maxRange, stringToTest) {
    var comaratives;
    var message;
    var deferred = Q.defer();
    switch (type) {
        case 'allnumeric':
            comparatives = /^[0-9]+$/;
            message = "not an all numeric input";
            break;
        case 'allLetter':
            comparatives = /^[A-Za-z]+$/;
            message = "not an all letter input";
            break;
        case 'alphanumeric':
            comparatives = /^[0-9a-zA-Z]+$/;
            message = "not an alpha-numeric input";
            break;
        case 'alphanumericspace':
            comparatives = /^[0-9a-zA-Z ]+$/;
            message = "not an alpha-numeric with space input";
            break;
    }
    required(stringToTest).then(function (result) {
        if (result.validate) {
            return stringlength(stringToTest, minRange, maxRange);
        } else {
            deferred.resolve(result);
        }
    }).then(function (result) {
        if (result.validate) {
            if (stringToTest.match(comparatives)) {
                var result = {
                    validate: true,
                    msg: ''
                };
            } else {
                var result = {
                    validate: false,
                    msg: message
                };
            }
        } else {
            var result = {
                validate: false,
                msg: result.msg
            };
        }
        deferred.resolve(result);
    });
    return deferred.promise;
}


function stringlength(inputtxt, minlength, maxlength) {
    var field = inputtxt;
    var mnlen = minlength;
    var mxlen = maxlength;
    var deferred = Q.defer();
    var result = {
        validate: false,
        msg: ''
    };
    if (field.length > mnlen || field.length < mxlen) {
        result.validate = true;
    } else {
        result.validate = false;
        result.msg = 'String lenght between ' + mnlen + ' and ' + mxlen;
    }
    deferred.resolve(result);
    return deferred.promise;
}

function required(emplacement) {
    var deferred = Q.defer();
    var result = {
        validate: false,
        msg: ''
    };
    if (emplacement) {
        result.validate = true;
    } else {
        result.validate = false;
        result.msg = 'Please fill all field';
    }
    deferred.resolve(result);
    return deferred.promise;
}

exports.validateDate = function (inputtxt) {
    var deferred = Q.defer();
    // (dd/mm/yyyy)
    var pattern = /^([0-9]{1,2})\/([0-9]{2})\/([0-9]{2,4})$/; // check format in template
    var result = {
        validate: false,
        msg: ''
    };
    if (inputtxt.match(pattern)) {
        result.validate = true;
    } else {
        result.validate = false;
        result.msg = 'not a valide date';
    }
    deferred.resolve(result);
    return deferred.promise;
}

exports.validateEmail = function (inputtxt) {
    var deferred = Q.defer();
    var compare = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
    var result = {
        validate: false,
        msg: ''
    };
    if (inputtxt.match(compare)) {
        result.validate = true;
    } else {
        result.validate = false;
        result.msg = 'not a valide mail';
    }
    
    deferred.resolve(result);
    return deferred.promise;
}

exports.valueExist = function (inputtxt) {
    var deferred = Q.defer();

    if (inputtxt == '' || inputtxt === undefined) {
        var result = {
            validate: false,
            msg: 'insert something'
        };
    } else {
        var result = {
            validate: true,
            msg: ''
        };
    }
    
    deferred.resolve(result);
    return deferred.promise;
}



// Gender

exports.validateArray = function(inputtxt, arraycompare){
    // ignore case function
    var deferred = Q.defer();
    var result = {
        validate: false,
        msg: 'Input possibilities are ' + JSON.stringify(arraycompare) + ' please rectify'
    };
    var tasks = [];
    
    arraycompare.forEach(function(elt){
        var reg = new RegExp(elt, "i");
        if(reg.test(inputtxt)){
            result.validate = true;
            result.msg = "";
        }
    });
    
    deferred.resolve(result);
    return deferred.promise;
}

