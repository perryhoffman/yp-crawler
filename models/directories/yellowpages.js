var Base_m      = require('../../models/base_m'),
    MyUtils     = require('../../helpers/utils'),
    request     = require('request'),
    cheerio     = require('cheerio');

var errors = [];

function saveTrace(name, category, url, cnt, crawled, errors, callback) {
  var traceObj = {
    directoryName: name,
    directoryCategory: category,
    directoryCategoryUrl: url,
    entriesCnt: cnt,
    crawledEntriesCnt: crawled,
    errors: errors
  };
  traceObj = Base_m.traces.serialize(traceObj);
  Base_m.traces.create(traceObj).done(function(err, newTrace) {
    if (err || !newTrace) return console.error('Failed to create trace.');
    callback(newTrace);
  })
}

exports.findEmail = function findEmail(data, cb) {
  var $     = cheerio.load(data);
  var email = $('.primary-email').attr('href') || '';
  if(MyUtils.startsWith(email, 'mailto:')) email = email.slice(7);
  cb(email);
};

exports.crawl = function(body, category, url, callback) {
  var $ = cheerio.load(body),
      directory = 'Yellow Pages',
      listings = [];

  //if($('html').find(".error-page")) return callback({continue: false, reason: 'Search Error, probably ran out of pages'});
  $('#results .result').each(function(i, elem) {
    var result = $(this);
    var company = {
      name: result.find('.srp-business-name a').text(),
      websiteUrl: result.find('a.track-visit-website').attr('href') || '',
      sector: result.find('.business-categories li').eq(0).first().text(),
      phone: result.find('.business-phone').text().replace(/(\r\n|\n|\r)/gm,""), // Adding \n's to phone number,
      emailsFound: '',
      directory: directory,
      directoryCategory: category,
      directoryPage: result.find('.track-more-info').attr('href') || null
    };
    if(company.directoryPage) company.directoryPage = 'http://www.yellowpages.com' + company.directoryPage;
    listings.push(company);
  });
  if(!listings.length) errors.push({continue: false, reason: 'No listing websites found'});
  saveTrace(directory, category, url, listings.length, listings.length, errors, function(){
    // Callback once saved
    var err = null;
    if(errors.length) err = errors;
    callback(err, listings);
  });
};