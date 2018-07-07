/*
 * helpers for various things
 */

// Dependencies
var crypto = require('crypto');
var config = require('./config')

// container for the helpers
var helpers = {};

// Create a SHA256 hash
helpers.hash = function(str){
  if(typeof(str) == 'string' && str.length > 0){
    var hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
    return hash;
  } else {
    return false;
  }
};

helpers.parseJsonToObject = function(str){
  try{
    var obj = JSON.parse(str);
    return obj;
  }catch(e){
    return {};
  }
};
// export our helpers
module.exports = helpers


// create a sting of random alphanumeric characters of a given lenght
helpers.createRandomString = function(stringLength) {
  var stringLength = typeof(stringLength) == 'number' && stringLength > 0 ? stringLength : false;
  if(stringLength){
    // define all the possible chars that could go into the string
    var possibleCharachters = 'abcdefghijklmnopqrstuvwxyz0123456789';

    // start the string
    var str = '';

    for (let i = 1; i<=stringLength;i++){
      // get a random character from possibleCharachters string then append append char to final string
      var randomChar = possibleCharachters.charAt(Math.floor(Math.random() * possibleCharachters.length));
      str += randomChar;
    }
    // return the final string
    return str;

  } else {
    return false;
  }
};
