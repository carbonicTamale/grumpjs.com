var express   = require('express');
var path      = require('path');
var request   = require('request');
var url       = require('url');
var router    = express.Router();
var utils     = require('../helpers/route-utils');
var Package   = require('../models/Package');

// Submitting a package into Grump Library
router.post('/', function(req, res, next) {
  if(req.body.internal) {
    var info = {};
    info.defaultCommand = req.body.defaultCommand;
    info.category = req.body.category;
    info.description = req.body.description;
    info.repoName = req.body.repo;
    info.userId = req.body.userId;

    console.log(info);

    var pack = new Package(info);
    pack.save(function (err) {
      if (err) {
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });

    return;
  }

  // user-friendly input parsing: pull github user/reponame (for github API call) out of a variety of reasonable formats
  var repo = url.parse(req.body.repo).path.split('/');  //ok with/without https
  if (repo.length > 2) { //ok with/without github.com domain
    repo.shift();
  }
  if (repo[1].slice(-4) === ".git") {  //ok with/without .git ending
    repo[1] = repo[1].slice(0,-4);
  }

  utils.gitGet(repo, function(err, info){
    if (err) {
      res.sendStatus(500);   //TODO: catch this on frontend (is 500 right num?)
    } else {
      //bundle git response + frontend data
      info.defaultCommand = req.body.defaultCommand;
      info.category = req.body.category;
      info.description = req.body.description;

      // post to mongo
      var pack = new Package(info);
      pack.save(function (err) {
        if (err) {
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
        }
      });
    }
  });
});

module.exports = router;
