//My AngelList id is 1159294
var application_root = __dirname,
    express = require('express'),
    passport = require('passport'),
    util = require('util'),
    bodyParser = require("body-parser"),
    cookieParser = require("cookie-parser"),
    methodOverride = require("method-override"),
    request = require("request"),
    logger = require("morgan"),
    session = require("express-session"),
    path = require("path"),
    environment = require("dotenv"),
    AngelListStrategy = require('passport-angellist').Strategy;

environment.load();
var options = {
  url: "loremipsum",
  headers: {
    Authorization: "vitamquae"
  }
};

var app = express();

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


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

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
    console.log("HERE:", req.user._json);
    console.log(options);
    res.send("Logged in");
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