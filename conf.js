module.exports = function () {
  conf = {};

  conf.db = {
    name: 'crawler',
    user: 'root',
    pw: 'root',
    host: 'localhost',
    port: 3306
  };

  conf.directories = [
  'Yellow Pages'
  ];
  conf.directoryUrl = function(directory, count, location, keyword) {
    switch (directory)
    {
      case 0:
        return 'http://www.yellowpages.com/'+location+'/'+keyword+'?page='+ count;
        break;
      default:
        console.log('Could Not Find Directory');
        break;
    }
  };
  conf.careerKeywords = [
    'Careers',
    'Jobs',
    'Career Opportunities',
    'Job Opportunities',
    'Available Positions'
  ];
  conf.bannedCareerChars = {
    '#': 1,
    '/': 2
  };

  return conf;
}();