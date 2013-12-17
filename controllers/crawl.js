var Base_m      = require('../models/base_m'),
    Conf        = require('../conf'),
    MyUtils     = require('../helpers/utils'),
    _           = require('underscore'),
    Async       = require('async'),
    Directories = require('../models/directories'),
    Sites       = require('../models/sites'),
    Yellowpages = require('../models/directories/yellowpages');



// 1) Crawl Directory
exports.crawlDirectory = crawlDirectory =  function(count, directory, location, keyword) {
  var directoryName = Conf.directories[directory];
  var url           = Conf.directoryUrl(directory, count, location, keyword);

  console.log('Starting to crawl ' + directoryName + ' page ' + count + '! ' +
      'Remember to stop / cancel at any time, press CTRL + C');

  Async.waterfall([checkTraces, getContent, crawl, crawlAdditionalPage], function(err, results){
    if(err && err.continue) return continueCrawl(count, directory, location, keyword);
    if(err) return console.log('Stopping: Error crawling directory', err);

    // Move on to crawling sites with list
    //crawlSites(results);

    continueCrawl(count, directory, location, keyword);
  });

  // Check to see if this page has already been crawled
  function checkTraces(callback){
    Directories.checkIfCrawled(url, callback);
  }

  // Get the HTML content from the crawled page
  function getContent(trace, callback){
    Directories.getContent(url, callback);
  }

  // Look through and save any information
  function crawl(content, callback) {
    Yellowpages.crawl(content, directoryName, url, function(err, listings){
      callback(err, listings);
    });
  }

  function crawlAdditionalPage(listings, callback) {
    Async.forEachSeries(listings, findEmail, function(err){
      callback(err, listings);
    });

    function findEmail(company, cb) {
      if(company.directoryPage) {
        Directories.getContent(company.directoryPage, function(err, data){
          if(err) cb(err);
          Yellowpages.findEmail(data, function(email){
            company.emailsFound = email;

            //TODO temp while not actually crawling the website
            Base_m.companies.findOrCreate(company).done(function(err, newCompany) {
              if (err || !newCompany) return console.error('Failed to create company. Reason == ', err);
            });

            // Intentional delay
            setTimeout(function(){ cb(null); }, 4500); // callback an err if there is one, will stop the eachSeries
          });
        });
      } else {
        cb(null);
      }
    }
  }

  function continueCrawl(count, directory, location, keyword) {

    // Increase pg number.
    setTimeout(function(){
      count = count + 1;
      crawlDirectory(count, directory, location, keyword);
    }, 10000);
  }

};

// 2) Crawl Site. Currently not being used.
exports.crawlSites = crawlSites = function(listing) {

  // Loop through each listing
  _.each(listing, function(company) {
    Async.waterfall([getSiteContent, findCareersUrl, crawlCareersUrl], function (err, result) {
      if(err) console.log('An error occured crawling a site ',  err);
      Base_m.companies.findOrCreate(company).done(function(err, newCompany) {
        if (err || !newCompany) return console.error('Failed to create company.');
      });
    });

    // Get site content (html)
    function getSiteContent(callback) {
      Sites.crawl(company, callback);
    }

    // Find career url
    function findCareersUrl(content, callback){
      Sites.findCareersUrl(content, function(foundUrls){
        if(foundUrls[0] && _.isString(foundUrls[0])){
          company.careersSiteUrl = foundUrls[0];
          if(!MyUtils.startsWith(company.careersSiteUrl[0], 'http')) {
            company.careersSiteUrl = company.websiteUrl + company.careersSiteUrl;
          }
          callback(null, company.careersSiteUrl);
        } else {
          // Pass in an error to skip to done function.
          callback({errMsg: 'No Careers Site Found'}, null);
        }
      });
    }

    // Crawl found url
    function crawlCareersUrl(careersSiteUrl, callback){
      Sites.findIframe(careersSiteUrl, function(foundIframe){
        company.hasIframe = foundIframe;

        // Save Company.
        callback(null, company.hasIframe);
      });
    }
  }); // End each
};