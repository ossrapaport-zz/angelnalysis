var express = require("express"),
    models  = require("../models"),
    async   = require("async"),
    request = require("request"),
    getPersonalityScores = require("../lib/personality_scores_finder.js"),
    getMostMessagedFriend = require("../lib/nested_async_functions/get_most_messaged_friend.js"),
    getMostFollowedFollower = require("../lib/nested_async_functions/get_most_followed_follower.js"),
    getMostFollowedFollowing = require("../lib/nested_async_functions/get_most_followed_following.js");

var User = models.users,
    Result = models.results;

var resultRouter = express.Router();

var options;

var authenticate = function(req, res, next) {
  req.session.token && req.session.angelID && req.session.currentUser ? next() : res.status(400).send({
    err: 400,
    msg: "You have to login first"
  });
};

var authorize = function(req, res, next) {
  var sessionID = parseInt( req.session.currentUser );
  var reqID = parseInt( req.params.user_id );

  sessionID === reqID ? next() : res.status(400).send({
    err: 400,
    msg: "You are not allowed to see that"
  });
};

// =====================

/*var getAllTheThings = require('./lib/angellistapicalls.js');
*/
// =====================

resultRouter.post("/:user_id", authenticate, authorize, function(req, res) {

  //First get all the text this user has ever written
  //and store it in an array for ease
  var userTextArray = [];

  //Start with profile text
  User
  .findOne(req.params.user_id)
  .then(function(user) {
    userTextArray.push(user.bio);
    userTextArray.push(user.what_ive_built);
    userTextArray.push(user.what_i_do);
    userTextArray.push(user.criteria);
    //Then create an options variable and id variables for request calls
    var userID = user.id;
    var angelID = user.angellist_id;
    var options = {
      url: "loremipsum",
      headers: {
        Authorization: req.session.token
      },
      json: true
    };
    //TODO: Make this much DRYer and more intelligible. How can I do that?
/*    getAllTheThings(function() {
      user.create.then(sendstuff)
    })*/


    async.parallel([
      function(bigCallback) {
        //Next, look at the user's status updates
        options.url = "https://api.angel.co/1/status_updates";
        request(options, function(error, response, body) {
          var userStatuses = body.status_updates;
          var statusArray = [];
          userStatuses.forEach(function(status) {
            userTextArray.push(status.message);
            statusArray.push(status.message);
          });
          bigCallback(null, statusArray);
          //TODO: If more than one page of results, account for it
        });
      },
      function(bigCallback) {
        //Then, get the user's messages
        async.waterfall([
          function(mediumCallback) {
            //Make an array of the IDs of all the threads in which
            //the user has written
            var threadsIDArray = [];
            options.url = "https://api.angel.co/1/messages";
            //TODO: Account for more than one page of messages
            request(options, function(error, response, body) {
              var messages = body.messages;
              messages.forEach(function(message) {
                threadsIDArray.push(message.thread_id);
              });
              mediumCallback(null, threadsIDArray);
            });
          //Pass the threads ID array along to the next function
          }, 
          function(threadsIDArray, mediumCallback) {
            //TODO: Find out why the below is console logged twice???
            console.log("1010");
            //Find those threads and request each one of them
            async.each(threadsIDArray, function(threadID, smallCallback) {
              options.url = "https://api.angel.co/1/messages/" + threadID,
              request(options, function(error, response, body) {
                //Get the messages array from each thread
                var messages = body.messages;
                messages.forEach(function(message) {
                  //If the user sent the message, get that text
                  if (parseInt( message.sender_id ) === parseInt( angelID )) {
                    userTextArray.push(message.body);
                  }
                });
                //Once the messages are in the text array, callback time
                smallCallback();      
              });
            }, function(err) {
              if (err) res.status(500).send({err: 500, msg: "Houston, we've got a problem"});
              //If no error, the text array has what it needs so callback
              mediumCallback();
            });
          }
        ], function(err, result) {
          //THE FINAL CALLBACK
          bigCallback();
        });
      }
    ],
    function(err, results) {
      //Now we find the most messaged and most followed connections
      //usng async parallel to get all the data
      //TODO: For all of these, account for more than one page
      async.parallel([
        //Most messaged
        function(mediumCallback) {
          getMostMessagedFriend(mediumCallback, options);
        },
        function(mediumCallback) {
          //TODO: Find out how to do this by getting the user ID from the router
          //Most followed follower
          getMostFollowedFollower(mediumCallback, options, angelID);
        },
        function(mediumCallback) {
          //TODO: Find out how to do this by getting the user ID from the router 
          //Most followed following
          getMostFollowedFollowing(mediumCallback, options, angelID);
        }
      ], function(err, userResults) {
        var userScores = getPersonalityScores(userTextArray);
        Result
        .create({
          agreeableness_score: userScores.openness,
          conscientiousness_score: userScores.conscientiousness,
          extraversion_score: userScores.extraversion,
          neuroticism_score: userScores.neuroticism,
          openness_score: userScores.openness,
          most_messaged_friend: userResults[0].name,
          most_messaged_friend_bio: userResults[0].bio,
          most_followed_follower: userResults[1].name,
          most_followed_follower_bio: userResults[1].bio,
          most_followed_following: userResults[2].name,
          most_followed_following_bio: userResults[2].bio,
          user_id: userID
        })
        .then(function(result) {
          res.send(result);
        });
      });
    });
  });
});

module.exports = resultRouter;