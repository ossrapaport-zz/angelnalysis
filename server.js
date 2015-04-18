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

passport.use(new AngelListStrategy({
  clientID: process.env.ANGEL_LIST_CLIENT_ID,
  clientSecret: process.env.ANGEL_LIST_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/logged_in"
}, function(accessToken, refreshToken, profile, done) {
  options.headers.Authorization = accessToken;
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

var options = {
  url: "loremipsum",
  headers: {
    Authorization: "vitamquae"
  }
};

function ensureAuthenticated(req, res, next) { //Middleware for later
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
};

app.get('/auth/angellist',
  passport.authenticate('angellist'),
  function(req, res) {}
);

app.get('/logged_in', 
  passport.authenticate('angellist', { failureRedirect: '/login' }),
  function(req, res) {
    var userName = req.user._json.name;
    var angellistID = req.user._json.id;
    var userEmail = req.user._json.email;
    var imageURL = req.user._json.image;
    console.log(userName);
/*    console.log(angellistID);
    console.log(userEmail);
    console.log(imageURL);*/
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
    .then(function(user, created) {
      console.log("User:", user);
      console.log("Created:", created);
      res.send("Logged in");
    });
});

//TODO: passport.authenticate always redirects to login, write
//your own middleware
app.get("/path_test", function(req, res) {
  options.url = "https://api.angel.co/1/paths?user_ids=155",
  request(options, function(error, response, body) {
    console.log("Error:", error);
    console.log("response:", response);
    console.log("Body:", body);
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