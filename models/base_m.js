var Sequelize   = require("sequelize");
var Sql         = new Sequelize('crawler', 'root', 'root', {
  dialect : 'mysql',
  host    : 'localhost',
  port    : 3306
});

function safeSer(argsArry, obj) {
  argsArry.forEach(function(k) {
    try {
      if (obj[k] && obj[k] instanceof Object) {
        obj[k] = JSON.stringify(obj[k]);
      }
    } catch (e) {console.error(e)}
  });
  return obj;
}

function safeDes(argsArry, obj) {
  argsArry.forEach(function(arg) {
    try {
      if (obj[arg] && obj[arg] != 'null')
        obj[arg] = JSON.parse(obj[arg]);
    } catch (e) {console.error(e)}
  });
}
exports.db = Sql;

exports.companies = Companies = Sql.define('companies', {
  'directory'         : Sequelize.STRING,
  'directoryCategory' : Sequelize.STRING,
  'directoryPage'     : Sequelize.STRING,
  'name'              : Sequelize.STRING,
  'websiteUrl'        : Sequelize.STRING,
  'sector'            : Sequelize.STRING,
  'careersSiteUrl'    : Sequelize.STRING,
  'emailsFound'       : Sequelize.TEXT,
  'employeeCount'     : Sequelize.STRING,
  'contacts'          : Sequelize.TEXT,
  'linkedInId'        : Sequelize.STRING,
  'phone'             : Sequelize.STRING,
  'errors'            : Sequelize.TEXT
}, {
  instanceMethods: {
    authorize: function(session, cb) {
      cb(true);
    },
    deserialize: function() {
      safeDes(['errors'], this);
    },
    cleanUp: function() {}
  },
  classMethods : {
    serialize : function(data){
      return safeSer(['errors', 'emailsFound'], data);
    }
  }
});

exports.traces = Traces = Sql.define('traces', {
  'directoryName'        : Sequelize.STRING,
  'directoryCategory'    : Sequelize.STRING,
  'directoryCategoryUrl' : Sequelize.STRING,
  'entriesCnt'           : Sequelize.INTEGER,
  'crawledEntriesCnt'    : Sequelize.INTEGER,
  'errors'               : Sequelize.TEXT
}, {
  instanceMethods: {
    authorize: function(session, cb) {
      cb(true);
    },
    deserialize: function() {
      safeDes(['errors'], this);
    },
    cleanUp: function() {}
  },
  classMethods : {
    serialize : function(data){
      return safeSer(['errors'], data);
    }
  }
});