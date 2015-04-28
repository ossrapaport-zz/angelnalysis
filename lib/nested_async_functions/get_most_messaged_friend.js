var request = require("request"),
    findMostMessaged = require("../find_most_messaged.js");

var getMostMessagedFriend = function(mediumCallback, requestOptions) {
  requestOptions.url = "https://api.angel.co/1/messages"
  request(requestOptions, function(error, response, body) {
    var mostMessagedObject = findMostMessaged(body.messages);
    mediumCallback(null, mostMessagedObject);
  });
};

module.exports = getMostMessagedFriend;