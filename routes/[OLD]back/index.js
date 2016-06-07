var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Welcome to my APP' });
});


/* 
 * Login acces. 
 */
router.get('/login', function(req, res, next) {
  res.render('login_view', { title: 'Login' });
});

router.get('/new_user', function(req, res, next) {
  res.render('adduser_view', { title: 'New user' });
});


module.exports = router;




