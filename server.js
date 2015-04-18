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
    AngelListStrategy = require('passport-angellist').Strategy;

var angelListClientID = "5b2e8928e19502edc3a05147d2a43c88ec57de4506c08b12";
var angelListClientSecret = "38c5cdc20a10af63cffc39e15c65dcf99340107a02b8730f";
var returnedAccessToken;

var app = express();

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new AngelListStrategy({
  clientID: angelListClientID,
  clientSecret: angelListClientSecret,
  callbackURL: "http://localhost:3000/logged_in"
}, function(accessToken, refreshToken, profile, done) {
  returnedAccessToken = accessToken;
  process.nextTick(function() {
    return done(null, profile);
  });
}));

app.use(logger("dev"));
app.use(cookieParser());
app.use(bodyParser());
app.use(methodOverride());
app.use(session({
  secret: "graeme",
  saveUninitialized: false,
  resave: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));

function ensureAuthenticated(req, res, next) { //Middleware for later
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

app.get("/login", function(req, res) {
  res.send("<a href=\"/auth/angellist\">Log in with angeleijflse</a>");
});

app.get("/toobad", function(req, res) {
  res.send("TOOBAD");
});

app.get('/auth/angellist',
  passport.authenticate('angellist'),
  function(req, res) {}
);

app.get('/logged_in', 
  passport.authenticate('angellist', { failureRedirect: '/login' }),
  function(req, res) {
    console.log("Code:", req.query.code);
    console.log("Access:", returnedAccessToken);
    request.get("https://api.angel.co/1/users/1159294/followers?access_token=" + returnedAccessToken,
    function(error, response, body) {
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