var express          = require('express'),
    app              = express(),
    request          = require('request'),
    async            = require('async'),
    program          = require('commander'),
    Conf             = require('./conf')
    Crawl            = require('./controllers/crawl');

var pageCount = 1;
program
    .version('0.0.1')
    .option('-p, --port <port>', 'specify the port [1337]', Number, 1337);

program
    .command('crawl')
    .description('Initiate the crawler')
    .action(function(){
      async.series([
        function(callback){
          var list = Conf.directories;
          setTimeout(function(){
            console.log('\n \n Choose directory:');
            program.choose(list, function(i){
              callback(null, i);
            });
          }, 1500);
        },
        function(callback){
          program.prompt('Location: ', function(location){
            callback(null, encodeURIComponent(location));
          });
        },
        function(callback){
          program.prompt('Keyword: ', function(keyword) {
            callback(null, encodeURIComponent(keyword));
          });
        }
      ], function(err, results){
        var directory = results[0]; // Number
        var location  = results[1];
        var keyword   = results[2];
        Crawl.crawlDirectory(pageCount, directory, location, keyword);
      });
    });

// $ deploy stage
// $ deploy production
program
    .command('*')
    .action(function(env){
      console.log('Please run crawler server with a valid command.');
    });

program.parse(process.argv);
app.listen(program.port);