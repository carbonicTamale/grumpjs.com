var express   = require('express');
var path      = require('path');
var router    = express.Router();
var Package   = require('../models/Package');
var User      = require('../models/User');
var request   = require('request');
var utils     = require('../helpers/route-utils');


//get the library of grumps that belong to you
router.get('/', function(req, res, next) {
  var token = req.headers['x-access-token'];

  if(req.body.userId) {
    User.findById(req.body.userId, function(err, res){
      if(err) {
        throw err;
      } else if(res !== null) {
        Package.find({ 'userId' : req.body.userId }, function (err, result) {
          res.send(result);
        });
      }
    })
  }
  else if( token === undefined) {
    res.send("You are not signed in");
  } else {

    User.findOne({token:token}, function (err, user) {
      if(err) {
        throw err;
      } else if(user !== null) {
        var grumps = Package.find({ 'author' : user.login }, function (err, result) {
          res.send(result);
        });
      }
    });
  }
});

//updates package  --TODO: offer meaningful updates?
router.put('/', function(req, res, next) {
  var token = req.headers['x-access-token'];
  var grumpID = req.body.grumpID;

  if (token === undefined) {
    res.send("You are not signed in");
  } else {
    User.findOne({token:token}, function (err, user) {
      if (err) { throw err; }

      //making sure that this person can actually update this package

      Package.findOne({_id: grumpID, 'author' : user.login }, function (err, pack) {
        if (err) { throw err; }
        else if (pack === undefined) {
          res.send("you dont have access to update this package stop trolling");
        } else {
          //remove the old package
          Package.findOne({_id: grumpID}).remove(function(err) {
            if(err) { throw err; }
            //now create a new record for the package
            utils.gitGet([pack.author, pack.repoName], function(err, info) {
              console.log("-------------------------------------------",pack);
              //keeps the original data attached to the grump
              info.defaultCommand = pack.defaultCommand;
              //defaults to previous description, unless github has one
              if(pack.description !== undefined) { info.description = pack.description; }

              var newPack = new Package(info);
              newPack.save(function (err) {
                if (err) {
                  res.sendStatus(500);
                } else {
                  res.sendStatus(200);
                }
              });
            });
          });
        }
      });
    });
  }
});

//deletes package
router.delete('/', function(req, res, next) {
  var token = req.headers['x-access-token'];
  var grumpID = req.body.grumpID;

  if (token === undefined) {
    res.send("You are not signed in");
  } else {
    User.findOne({token:token}, function (err, user) {
      if (err) { throw err; }
      //making sure that this person can actually update this package
      Package.findOne({_id: grumpID, 'author' : user.login }, function (err, pack) {
        if (err) { throw err; }
        else if (pack === undefined) {
          res.send("you dont have access to delete this package stop trolling");
        } else {
          //then junking it
          Package.findOne({_id: grumpID}).remove(function(err, pack) {
            if (err) { throw err; }
            res.sendStatus(200);
          });
        }
      });
    });
  }
});


module.exports = router;
