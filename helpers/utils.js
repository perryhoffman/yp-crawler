/*
* Utility funcitons
* */

// Deep get.
exports.deepGet = function (data, keys) {
  if (typeof data == 'undefined' || !data) return null;
  var deepData = data;
  for (var i=0; i<keys.length; i++) {
    if (deepData[keys[i]]){
      deepData = deepData[keys[i]];
    }else{
      return null;
    }
  }
  return deepData;
};

exports.startsWith = function (stringToCheck, value) {
  return stringToCheck.indexOf(value) == 0;
};

exports.notSelf = function (url, oldUrl) {
  oldUrl == url ? url = null : url = url;
  return url;
};

exports.stripProtocol = function (url) {
  url = url.replace(/.*?:\/\//g, "");
  return url.replace(/^www\./,"");
};