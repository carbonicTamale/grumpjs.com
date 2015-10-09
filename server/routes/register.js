var express   = require('express');
var path      = require('path');
var router    = express.Router();
var User      = require('../models/User');
var request   = require('request');
var utils     = require('../helpers/route-utils');
var bcrypt    = require('bcrypt');

//get the library of grumps that belong to you
router.post('/', function(req, res, next) {
  var newUser = req.body;

  // hash the password
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(newUser.password, salt);
  newUser.password = hash;

  // post to mongo
  var user = new User(newUser);
  user.save(function (err) {
    if (err) {
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
});

module.exports = router;
