//My AngelList id is 1159294
//For AngelList pagination, just put in a query param of page="pagenumber"
var application_root  = __dirname,
    express           = require('express'),
    passport          = require('passport'),
    util              = require('util'),
    bodyParser        = require("body-parser"),
    cookieParser      = require("cookie-parser"),
    methodOverride    = require("method-override"),
    request           = require("request"),
    logger            = require("morgan"),
    session           = require("express-session"),
    models            = require("./models"),
    path              = require("path"),
    async             = require("async"),
    environment       = require("dotenv"),
    //Note that you added options._scope in below.
    AngelListStrategy = require('passport-angellist').Strategy,
    findMostMessaged = require("./lib/find_most_messaged.js"),
    findMostFollowed = require("./lib/find_most_followed.js"),
    getPersonalityScores = require("./lib/personality_scores_finder.js");


var app = express();

environment.load();
app.use(logger("dev"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(session({
  secret: "graeme",
  saveUninitialized: false,
  resave: false
}));

var User = models.users;
var Result = models.results;

var currentAccessToken;

passport.use(new AngelListStrategy({
  clientID:     process.env.ANGEL_LIST_CLIENT_ID,
  clientSecret: process.env.ANGEL_LIST_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/logged_in"
}, function(accessToken, refreshToken, profile, done) {
  currentAccessToken = accessToken;
  process.nextTick(function() {
    return done(null, profile);
  });
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/test_public'));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.get("/login", function(req, res) {
  request.get("/auth/angellist", 
    passport.authenticate("angellist"),
    function(error, response, body) {
    });
});


app.get('/auth/angellist',
  passport.authenticate('angellist'),
  function(req, res) {}
);

app.get('/logged_in', 
  passport.authenticate('angellist', { failureRedirect: '/login' }),
  function(req, res) {
    req.session.token = currentAccessToken;
    var userName = req.user._json.name;
    var angellistID = req.user._json.id;
    req.session.angelID = angellistID;
    var userEmail = req.user._json.email;
    var imageURL = req.user._json.image;
    var whatIveBuilt = req.user._json.what_ive_built;
    var whatIDo = req.user._json.what_i_do;
    var userBio = req.user._json.bio;
    var userCriteria = req.user._json.criteria;

    User.findOrCreate({
      where: {
        angellist_id: angellistID 
      },
      defaults: {
        name: userName,
        email: userEmail,
        image: imageURL,
        what_ive_built: whatIveBuilt,
        what_i_do: whatIDo,
        bio: userBio,
        criteria: userCriteria
      }
    })
    .then(function(user) {
      req.session.currentUser = user[0].id;
      res.redirect("/#home/" + req.session.currentUser);
    });
});


app.delete("/logout", function(req, res) {
  delete req.session.currentUser;
  delete req.session.token;
  delete req.session.angelID;
  req.logout();
  res.send({msg: "Logged out"});
});

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

//User Routes

app.get("/users/:user_id", authenticate, authorize, function(req, res) {

  User
  .findOne({
    where: {id: req.params.user_id},
    include: Result
  })
  .then(function(user) {
    res.send(user);
  });

});

//When would this route be used?
app.put("/users/:user_id", authenticate, authorize, function(req, res) {

  User
  .findOne(req.params.user_id)
  .then(function(user) {
    user
    .update(req.body)
    .then(function(updatedUser) {
      res.send(updatedUser);
    });
  });
});

app.delete("/users/:user_id", authenticate, authorize, function(req, res) {

  User
  .findOne(req.params.id)
  .then(function(user) {
    user
    .destroy()
    .then(function() {
      res.send(user);
    });
  });
});

//Result Routes

app.get("/:user_id/results", authenticate, authorize, function(req, res) {

  Result
  .findAll({
    where: {user_id: req.params.user_id}
  })
  .then(function(results) {
    res.send(results);
  });
});

app.get("/:user_id/results/:result_id", authenticate, authorize, function(req, res) {

  Result
  .findOne(req.params.result_id)
  .then(function(result) {
    res.send(result);
  });
});

//TODO: Change this to a post request, is just a get for easier view
//TODO: Add user auth middleware, not currently in here for easier view
app.get("/results/:user_id", function(req, res) {

  //First get all the text this user has ever written
  //and store it in an array for ease
  var userTextArray = [];

  //Start with profile text
  User
  .findOne(req.params.user_id)
  .then(function(user) {
    var userID = user.id;
    var angelID = user.angellist_id;
    userTextArray.push(user.bio);
    userTextArray.push(user.what_ive_built);
    userTextArray.push(user.what_i_do);
    userTextArray.push(user.criteria);
    //Then create a general options variable to go with each request
    var options = {
      url: "loremipsum",
      headers: {
        Authorization: req.session.token
      },
      json: true
    };
    //TODO: Make this much DRYer and more intelligible. How can I do that?
    async.parallel([
      function(bigCallback) {
        //Next, look at the user's status updates
        options.url = "https://api.angel.co/1/status_updates";
        request(options, function(error, response, body) {
          var userStatuses = body.status_updates;
          userStatuses.forEach(function(status) {
            userTextArray.push(status.message);
          });
          bigCallback(null);
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
          }, function(threadsIDArray, mediumCallback) {
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
                  if (parseInt( message.sender_id ) === parseInt( req.session.angelID )) {
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
          options.url = "https://api.angel.co/1/messages"
          request(options, function(error, response, body) {
            var mostMessaged = findMostMessaged(body.messages);
            mediumCallback(null, mostMessaged);
          })
        },
        function(mediumCallback) {
          //TODO: Find out how to do this by getting the user ID from the router
          //Most followed follower
          options.url = "https://api.angel.co/1/users/" + 
          req.session.angelID + "/followers";
          request(options, function(error, response, body) {
            var mostFollowedFollower = findMostFollowed(body.users);
            mediumCallback(null, mostFollowedFollower);
          });
        },
        function(mediumCallback) {
          //TODO: Find out how to do this by getting the user ID from the router 
          //Most followed following
          options.url = "https://api.angel.co/1/users/" +
          req.session.angelID + "/following?type=user";
          request(options, function(error, response, body) {
            var mostFollowedFollowing = findMostFollowed(body.users);
            mediumCallback(null, mostFollowedFollowing);
          });
        }
      ], function(err, userResults) {
        var userScores = getPersonalityScores(userTextArray);
        console.log(userResults);
        Result
        .create({
          agreeableness_score: userScores.openness,
          conscientiousness_score: userScores.conscientiousness,
          extraversion_score: userScores.extraversion,
          neuroticism_score: userScores.neuroticism,
          openness_score: userScores.openness,
          most_messaged_friend: userResults[0],
          most_followed_follower: userResults[1],
          most_followed_following: userResults[2],
          user_id: userID
        })
        .then(function(result) {
          res.send(result);
        });
      });
    });
  });
});

//A test to see a user's messages
app.get("/messages_test", function(req, res) {
  var options = {
    url: "https://api.angel.co/1/messages",
    headers: {
      Authorization: req.session.token
    },
    json: true
  };
  request(options, function(error, response, body) {
    res.send(body);
  });
});

//A test to see an individual thread between two users
app.get("/thread_test", function(req, res) {
  var options = {
    url: "https://api.angel.co/1/messages/50301740",
    headers: {
      Authorization: req.session.token
    },
    json: true
  }
  request(options, function(error, response, body) {
    res.send(body);
  });
});

//A test to see a user's status updates
//This returns every single status of a user
app.get("/status_test", function(req, res) {
  var options = {
    url: "https://api.angel.co/1/status_updates",
    headers: {
      Authorization: req.session.token
    },
    json: true
  };
  request(options, function(error, response, body) {
    res.send(body);
  });
});

app.get("/follow_test", function(req, res) {
  var options = {
    url: "https://api.angel.co/1/users/1159294/following?type=user",
    headers: {
      Authorization: req.session.token
    },
    json: true
  };
  request(options, function(error, response, body) {
    var currentHighest = 0;
    var mostFollowedFollower = "No One";
    body.users.forEach(function(user) {
      if (user.follower_count > currentHighest) {
        currentHighest = user.follower_count;
        mostFollowedFollower = user.name;
      }
    })
    res.send(mostFollowedFollower);
  });
})

app.listen(3000, function() {
  console.log("Server on 3000");
});