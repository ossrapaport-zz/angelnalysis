var request           = require("request"),
    findMostFollowed  = require("../find_most_followed.js");
    
var getMostFollowedFollowing = function(bigCallback, userConnections, requestOptions, userAngelID) {
  requestOptions.url = "https://api.angel.co/1/users/" +
  userAngelID + "/following?type=user";
  request(requestOptions, function(error, response, body) {
    userConnections.push( findMostFollowed(body.users) );
    bigCallback(null, userConnections);
  });
};

module.exports = getMostFollowedFollowing;