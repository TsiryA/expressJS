var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('map/main', { title: 'Corporation Localisation' });
});

router.get('/search-employee', function(req, res, next) {
  res.render('map/search-employee', { title: 'Corporation Localisation' });
});

/* 
 * Login acces. 
 */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});


/* 
 * Register new user. 
 */

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'New user' });
});

module.exports = router;