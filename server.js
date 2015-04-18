var application_root = __dirname,
    express = require("express"),
    passport = require("passport"),
    AngelListStrategy = require("passport-angellist").Strategy,
    logger = require("morgan"),
    bodyParser = require("body-parser"),
    path = require("path"),
    session = require("express-session"),
    request = require("request");


var app = express();

var angelListClientID = "5b2e8928e19502edc3a05147d2a43c88ec57de4506c08b12";
var angelListClientSecret = "38c5cdc20a10af63cffc39e15c65dcf99340107a02b8730f";
var angelListAccessToken;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new AngelListStrategy({
  clientID: angelListClientID,
  clientSecret: angelListClientSecret,
  callbackURL: "http://localhost:3000/auth/angellist/callback"
}, function(accessToken, refreshToken, profile, done) {
  accessToken = angelListAccessToken;
  console.log("Refresh Token:", refreshToken);
  console.log("Profile", profile);
  process.nextTick(function() {
    return done(null, profile);
  });
}));

app.use(logger("dev"));
app.use(bodyParser());
app.use(session({
  secret: "graeme",
  saveUninitialized: false,
  resave: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(application_root + '/public'));

app.get("/login", function(req, res) {
  res.send("<a href=\"/auth/angellist\">Log in with angeleijflse</a>");
});

app.get("/omg", function(req, res) {
  res.send("OMG");
});

app.get("/toobad", function(req, res) {
  res.send("TOOBAD");
});

app.get('/auth/angellist',
  passport.authenticate('angellist'),
  function(req, res) {}
);

app.get("/logged_in", passport.authenticate("angellist", {failureRedirect: "/toobad" }),
  function(req, res) {

    var aListPostURL = "https://angel.co/api/oauth/token?client_id=" + angelListClientID + 
    "&client_secret=" + angelListClientSecret + "&code=" 
    + req.query.code + "&grant_type=authorization_code";
    
    request.post(aListPostURL, function(error, response, body) {
        console.log("Error:", error);
        console.log("Body:", body);
        //WTF?
        res.send(response);
    });
});

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

app.listen(3000, function() {
  console.log("Server on 3000");
});