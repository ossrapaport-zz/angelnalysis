var request = require("request");

var getThreadIDs = function(bigCallback, requestOptions, statusArray) {
  var threadsIDArray = [];
  requestOptions.url = "https://api.angel.co/1/messages";
  request(requestOptions, function(error, response, body) {
    var messages = body.messages;
    messages.forEach(function(message) {
      threadsIDArray.push(message.thread_id);
    });
    //TODO: Account for more than one page of messages
    bigCallback(null, statusArray, threadsIDArray);
  });
};

module.exports = getThreadIDs;