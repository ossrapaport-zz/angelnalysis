var request = require("request"),
    findMostFollowed = require("../find_most_followed.js");


var getMostFollowedFollower = function(mediumCallback, requestOptions, userAngelID) {
  requestOptions.url = "https://api.angel.co/1/users/" + 
  userAngelID + "/followers";
  request(requestOptions, function(error, response, body) {
    var mostFollowedFollowerObject = findMostFollowed(body.users);
    mediumCallback(null, mostFollowedFollowerObject);
  });
};

module.exports = getMostFollowedFollower;