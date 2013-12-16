var Base_m      = require('../models/base_m'),
    request     = require('request'),
    cheerio     = require('cheerio');

exports.checkIfCrawled = function(url, callback) {
  Base_m.traces.find({where: {directoryCategoryUrl: url}}).done(function(err, foundUrl) {
    if(err) return callback(err);
    if(foundUrl) return callback({continue: 'Already crawled this url'});
    callback(null, {msg: 'This url has not been crawled'});
  });
};

exports.getContent = function(url, callback) {
  request({
    uri: url
  }, function (error, response, body) {
    if(error) {
      return callback({continue: false, reason: 'Request error ==' + error});
    }
    if(response.statusCode != 200) {
      return callback({continue: false,  reason: 'Response status code ==' + response.statusCode});
    }
    if (!error && response.statusCode == 200) {
      callback(null, body);
    }
  });
};