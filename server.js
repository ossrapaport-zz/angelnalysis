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
    environment       = require("dotenv"),
    //Note that you added options._scope in below.
    AngelListStrategy = require('passport-angellist-e_and_m').Strategy;

var userRouter = require("./routers/user_router.js"),
    resultRouter = require("./routers/result_router.js");

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
app.use(express.static(__dirname + '/public'));

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
    var userName = req.user._json.name;
    var angellistID = req.user._json.id;
    var userEmail = req.user._json.email;
    var imageURL = req.user._json.image;
    var whatIveBuilt = req.user._json.what_ive_built;
    var whatIDo = req.user._json.what_i_do;
    var userBio = req.user._json.bio;
    var userCriteria = req.user._json.criteria;

    req.session.token = currentAccessToken;
    req.session.angelID = angellistID;

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

app.use("/users", userRouter);
app.use("/results", resultRouter);

app.listen(process.env.PORT || 3000, function() {
  console.log("Server on 3000");
});