var request           = require("request"),
    findMostMessaged  = require("../find_most_messaged.js");

var getMostMessagedFriend = function(bigCallback, requestOptions) {
  requestOptions.url = "https://api.angel.co/1/messages"
  request(requestOptions, function(error, response, body) {
    var userConnections = [];
    userConnections.push( findMostMessaged(body.messages) );
    bigCallback(null, userConnections);
  });
};

module.exports = getMostMessagedFriend;