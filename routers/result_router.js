var express                   = require("express"),
    models                    = require("../models"),
    async                     = require("async"),
    request                   = require("request"),
    authenticate              = require("../lib/user_auth/authenticate.js"),
    authorize                 = require("../lib/user_auth/authorize.js"), 
    getPersonalityScores      = require("../lib/personality_scores_finder.js"),
    getUserStatuses           = require("../lib/nested_async_functions/get_user_statuses.js"),
    getThreadIDs              = require("../lib/nested_async_functions/get_thread_ids.js"),
    getMessages               = require("../lib/nested_async_functions/get_messages.js"),
    getMostMessagedFriend     = require("../lib/nested_async_functions/get_most_messaged_friend.js"),
    getMostFollowedFollower   = require("../lib/nested_async_functions/get_most_followed_follower.js"),
    getMostFollowedFollowing  = require("../lib/nested_async_functions/get_most_followed_following.js");

var User = models.users,
    Result = models.results;

var resultRouter = express.Router();

resultRouter.post("/:user_id", authenticate, authorize, function(req, res) {
  
  User
  .findOne(req.params.user_id)
  .then(function(user) {
    var userTextArray = [];
    userTextArray.push(user.bio);
    userTextArray.push(user.what_ive_built);
    userTextArray.push(user.what_i_do);
    userTextArray.push(user.criteria);

    var userID = user.id;
    var angelID = user.angellist_id;
    var options = {
      url: "loremipsum",
      headers: {
        Authorization: req.session.token
      },
      json: true
    };

    async.waterfall([
      function(bigCallback) {
        //Next, look at the user's status updates
        getUserStatuses(bigCallback, options);
      }, function(statusArray, bigCallback) {
        //Make an IDs array for all the user's message threads
        getThreadIDs(bigCallback, options, statusArray);
      }, function(statusArray, threadsIDArray, bigCallback) {
        //Get the messages from each thread
        async.map(threadsIDArray, function(threadID, smallCallback) {
          getMessages(smallCallback, options, threadID, angelID);
        }, function(err, filteredMessageBodies) {
          //Flatten the results, then build the big text array 
          var flattenedMessages = [].concat.apply([], filteredMessageBodies);
          userTextArray = userTextArray.concat( statusArray.concat(flattenedMessages) );
          bigCallback(null);
        });        
      }, function(bigCallback) {
        //Find the most messaged friend
        getMostMessagedFriend(bigCallback, options);
      }, function(userConnections, bigCallback) {
        //Most followed follower
        getMostFollowedFollower(bigCallback, userConnections, options, angelID);
      }, function(userConnections, bigCallback) {
        //Most followed person the user is following
        getMostFollowedFollowing(bigCallback, userConnections, options, angelID);        
      }
    ], function(err, userConnections) {
      var userScores = getPersonalityScores(userTextArray);
      Result
      .create({
        agreeableness_score: userScores.openness,
        conscientiousness_score: userScores.conscientiousness,
        extraversion_score: userScores.extraversion,
        neuroticism_score: userScores.neuroticism,
        openness_score: userScores.openness,
        most_messaged_friend: userConnections[0].name,
        most_messaged_friend_bio: userConnections[0].bio,
        most_followed_follower: userConnections[1].name,
        most_followed_follower_bio: userConnections[1].bio,
        most_followed_following: userConnections[2].name,
        most_followed_following_bio: userConnections[2].bio,
        user_id: userID
      })
      .then(function(result) {
        res.send(result);
      });
    });
  });
});

module.exports = resultRouter;