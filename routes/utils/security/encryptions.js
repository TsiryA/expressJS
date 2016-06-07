                                // --------------------------------------------------------//
                                //           ENCRYPTION ACCESS SERVER SIDE                 //
                                // --------------------------------------------------------//

var crypto = require('crypto');

// --------------------------------- CREATING SALT -------------------------------------//
// Default hash
function generateSalt(size){
    var result;
    crypto.randomBytes(size,function(ex, buf){
        result = buf.toString('hex');
    });
    return crypto.createHash('sha256').update('result').digest('hex');
};

// --------------------------------- HASH -> SALT + PASS ---------------------------------//

exports.generateHash = function(password){
    var result = {};
    var salt = generateSalt(48);
    var hashing = crypto.createHash('sha256').update(password + salt).digest('hex');
    result = {
        salt: salt,
        hash: hashing
    };
    return result;
};