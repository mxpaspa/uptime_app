/*
 * helpers for various things
 */

// Dependencies
var crypto = require('crypto');
var config = require('./config');
var querystring = require('querystring');
var https = require('https');

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

helpers.sendTwilioSms = function(phone,msg,callback){
  // Validate parameters
  phone = typeof(phone) == 'string' && phone.trim().length == 10 ? phone.trim() : false;
  msg = typeof(msg) == 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false;
  if(phone && msg){

    // Configure the request payload
    var payload = {
      'From' : config.twilio.fromPhone,
      'To' : '+1'+phone,
      'Body' : msg
    };
    var stringPayload = querystring.stringify(payload);


    // Configure the request details
    var requestDetails = {
      'protocol' : 'https:',
      'hostname' : 'api.twilio.com',
      'method' : 'POST',
      'path' : '/2010-04-01/Accounts/'+config.twilio.accountSid+'/Messages.json',
      'auth' : config.twilio.accountSid+':'+config.twilio.authToken,
      'headers' : {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(stringPayload)
      }
    };

    // Instantiate the request object
    var req = https.request(requestDetails,function(res){
        // Grab the status of the sent request
        var status =  res.statusCode;
        // Callback successfully if the request went through
        if(status == 200 || status == 201){
          callback(false);
        } else {
          callback('Status code returned was '+status);
        }
    });

    // Bind to the error event so it doesn't get thrown
    req.on('error',function(e){
      callback(e);
    });

    // Add the payload
    req.write(stringPayload);

    // End the request
    req.end();

  } else {
    callback('Given parameters were missing or invalid');
  }
};
