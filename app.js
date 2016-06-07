var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer  = require('multer');


//-------------- Routes files ---------------------------//
var mail = require('./routes/plugins/email');                   // Mails
var upload = require('./routes/plugins/upload');                // uploading files
var external = require('./routes/external');                    // External acces on server
var request = require('./routes/request');                      // Manipulation request
var test = require('./routes/test');                            // Testing
//                * MODELS *                           //
var users = require('./routes/modele/users');                   // Users
var employee = require('./routes/modele/employee');             // Employee
var corporation = require('./routes/modele/corporation');       // Corporation
var history = require('./routes/modele/log');                   // Hitsory
//                * RENDERING*                         //
var front = require('./routes/rendering/front');                // Front Side
var map = require('./routes/rendering/map');                    // Data for map
var organigram = require('./routes/plugins/organigram');        // Organigram Data
var authorised = require('./routes/rendering/authorised');      // Authorised user
var routes = require('./routes/rendering/index');               // Basics
var slider = require('./routes/rendering/slider');              // Slider






//-------------- DATABASE INITIATE ----------------------//
var mongo = require('mongoskin');
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

//-------------- STARTING EXPRESS ----------------------//
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// --------------- MULTER: FILE UPLOAD -----------------//
app.use(multer({
    dest: './uploads/',
    rename: function (fieldname, filename) {
        return filename + Date.now();
    },
    onFileUploadStart: function (file) {
        console.log(file.originalname + ' is starting ...');
    },
    onFileUploadComplete: function (file) {
        console.log(file.fieldname + ' uploaded to  ' + file.path);
        done = true;
    }
}));


// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

// ------------------ Request limit ------------------------//


// ------------------- Using routes -----------------------//
app.use('/slider', slider);
app.use('/front', front);
app.use('/history', history);
app.use('/corporation', corporation);
app.use('/employee', employee);
app.use('/users', users);
app.use('/testing', test);
app.use('/organigram', organigram);
app.use('/map', map);
app.use('/request', request);
app.use('/uploads', upload);
app.use('/external', external);
app.use('/authorised', authorised);
app.use('/mail', mail);
app.use('/', routes);

//-------------- ERROR HANDLERS --------------------------//

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
