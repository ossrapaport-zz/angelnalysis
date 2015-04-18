//My AngelList id is 1159294
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
    environment       = require("dotenv"),
    AngelListStrategy = require('passport-angellist').Strategy;


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
var Desired = models.desireds;

var currentAccessToken;

passport.use(new AngelListStrategy({
  clientID: process.env.ANGEL_LIST_CLIENT_ID,
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
app.use(express.static(__dirname + '/public'));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
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
    var userEmail = req.user._json.email;
    var imageURL = req.user._json.image;

    User.findOrCreate({
      where: {
        angellist_id: angellistID 
      },
      defaults: {
        name: userName,
        email: userEmail,
        image: imageURL
      }
    })
    .then(function(user) {
      req.session.currentUser = user[0].id; 
      res.send(user[0]);
    });
});

var authenticate = function(req, res, next) {
  req.session.token && req.session.currentUser ? next() : res.status(400).send({
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
  .findOne(req.params.id,{
    include: Desired
  })
  .then(function(user) {
    res.send(user);
  });

});

//When would this route be used?
app.put("/users/:user_id", authenticate, authorize, function(req, res) {

  User
  .findOne(req.params.id)
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

//Desired Routes

app.get("/users/:user_id/desireds", function(req, res) {

  Desired
  .findAll({
    where: {
      user_id: req.params.id
    } 
  })
  .then(function(desireds) {
    res.send(desireds);
  });
});

app.post("/users/:user_id/desireds/:desiredid", function(req, res) {


})

//TEST Route
app.get("/path_test/:id", authenticate, authorize, function(req, res) {
  var options = {
    url: "https://api.angel.co/1/paths?user_ids=155",
    headers: {
      Authorization: req.session.token
    }
  };

  request(options, function(error, response, body) {
    res.send(body);
  });
});

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});


app.listen(3000, function() {
  console.log("Server on 3000");
});