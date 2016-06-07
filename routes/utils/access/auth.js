var cypher = require('../security/encryptions.js');
var logic = require("../logicalDB.js");

// --------------------------- ADD ACCESS -------------------- //

function insertAccess(pass, protected){
    var newentry = cypher.generateAccess(pass, protected);
    logic.insert('usercollection', newentry).then(function(){
        res.send({
            msg: ''
        });
    });
};

