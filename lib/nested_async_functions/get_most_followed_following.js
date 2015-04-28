var request = require("request"),
    findMostFollowed = require("../find_most_followed.js");
    
var getMostFollowedFollowing = function(mediumCallback, requestOptions, userAngelID) {
  requestOptions.url = "https://api.angel.co/1/users/" +
  userAngelID + "/following?type=user";
  request(requestOptions, function(error, response, body) {
    var mostFollowedFollowingObject = findMostFollowed(body.users);
    mediumCallback(null, mostFollowedFollowingObject);
  });
};

module.exports = getMostFollowedFollowing