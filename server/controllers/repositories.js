// Repositories controller for GitHub integration
'use strict';

var markdown = require( "markdown" ).markdown;
var request = require('request');
var async = require('async');

var Repository = require('../models/repository');


// Makes request to github for all repo info under developer's guild
// Gets a list of their names and then renders a list of repos
// and links to a route that will show their individual README files 
exports.refreshRepoList = function(req, res) {
    Repository.saveRepo();
};

exports.renderRepoList = function(req, res) {
  // fetch from db
  var nameArr = [];
  
  // render
  res.render('repoList', {
      projects: nameArr,
    });
};

/**
 * Function makes a github api request for repo list information
 * of all the repositories that belong to Developers' Guild
 * Then it makes individual requests to each repo and saves to db
 */
// RUNNING MULTIPLE TIMES RATE LIMITS YOU -- NEED AUTH
exports.saveRepo = function(req, res) {
  // var URL = 'https://api.github.com/authorizations';

  // var reqOptions = {
  //   url: url,
  //   headers: {
  //     'id' : '6b8b5cc27df6484a26a0',
  //     'secret': '4e5ade6a17b233b5b4674c5459fe7fcdc89b64cc',
  //     'User-Agent': 'vihanchaudhry'
  //   }
  // };

  // request(reqOptions, function(err, response, body) {

  // });

  var URL = 'https://api.github.com/orgs/DevelopersGuild/repos';

  var reqOptions = {
    url: URL,
    headers: {
      'User-Agent' : 'BlueAccords'
    }
  };

  request(reqOptions, function (err, response, body) {

    console.log(body);

    if (err || response.statusCode !== 200) {
      return res.send(err);
    }

    body = JSON.parse(body);

    async.each(body, function(item, callback) {
      var URL = 'https://api.github.com/repos/DevelopersGuild/' + item.name;

      var reqOptions = {
        url: URL,
        headers: {
          'User-Agent' : 'BlueAccords'
        }
      };

      requestRepository(reqOptions, function() {
        callback();
      });
    }, function() { // Called when everything else is done
      console.log("Saved everything.");
      res.send("lol");
    });
  });
}

/**
 * Renders readme of ONE respository via github api
 */
exports.getRepository = function(req, res) {
  // TODO: get individual repository object from db
  Repository.find({}, function(err, repositories) {
    if (err) return res.send(err);
    res.send(repositories);
  });
};

// Request individual repository from github api and saves to db
function requestRepository(reqOptions, callback) {
  request(reqOptions, function (err, response, body) {
    if (err || response.statusCode !== 200) {
      return callback(err);
    } else {
      body = JSON.parse(body); 
      var repository = new Repository(body);

      repository.save(function(err, repository) {
        if (err) return callback(err);
        callback(repository);
      });
    }
  });
};

// Gets a Repo's README
// @url; the url for the api call on github
// @done; the callback to call when the api call is done.
//  Also returns null or the html body of the readme
function getRepoReadMe(url, done) {
  console.log('API CALL');

  var reqOptions = {
    url: url,
    headers: {
      'User-Agent' : 'BlueAccords'
    }
  };

  request(reqOptions, function (err, response, body) {

    if (err || response.statusCode !== 200) {
      console.log(err);
      return done(null);
    }

    body = markdown.toHTML( body );

    done(body);
  });
}
