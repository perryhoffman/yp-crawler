var Conf    = require('../conf'),
    MyUtils = require('../helpers/utils'),
    _       = require('underscore'),
    request = require('request'),
    cheerio = require('cheerio');

var lastUrl = '';

exports.crawl = function(company, callback) {
  request({
    uri: company.websiteUrl
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      callback(error, body);
    }
  });
};

exports.findCareersUrl = function(html, callback) {
  var $ = cheerio.load(html),
      foundCareersPageUrl = [];
  _.each(Conf.careerKeywords, function(keyword){
    $('*:contains("'+ keyword +'")')
        .each(function(i, elem){
          var careersPageUrl = '';
          if($(this).attr('href')) {
            careersPageUrl = $(this).attr('href');
          }else{
            careersPageUrl = $(this).parent('a').attr('href');
          }
          if(careersPageUrl && !Conf.bannedCareerChars[careersPageUrl]) {
            if(MyUtils.startsWith(careersPageUrl, '..')){
              careersPageUrl = careersPageUrl.replace('..', '');
            }
            foundCareersPageUrl.push(careersPageUrl);
          }
        });
  });

  callback(foundCareersPageUrl);
};

exports.findIframe = function(careersUrl, callback) {
  request({
    uri: MyUtils.notSelf(careersUrl, lastUrl)
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var $      = cheerio.load(body),
          iframe = $('html').find("iframe");

      iframe.length ? iframe = true : iframe = false;
      lastUrl = careersUrl;
      return callback(iframe);
    }
  });
  lastUrl = careersUrl;
};