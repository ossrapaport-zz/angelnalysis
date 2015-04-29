var express = require("express"),
    userRouter = express.Router(),
    models = require("../models"),
    authenticate = require("../lib/user_auth/authenticate.js"),
    authorize = require("../lib/user_auth/authorize.js");

var User = models.users,
    Result = models.results;

userRouter.get("/:user_id", authenticate, authorize, function(req, res) {
  console.log("HERE");
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
userRouter.put("/:user_id", authenticate, authorize, function(req, res) {

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

userRouter.delete("/:user_id", authenticate, authorize, function(req, res) {

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

userRouter.get("/:user_id/results", authenticate, authorize, function(req, res) {

  Result
  .findAll({
    where: {user_id: req.params.user_id}
  })
  .then(function(results) {
    res.send(results);
  });
});

userRouter.get("/:user_id/results/:result_id", authenticate, authorize, function(req, res) {

  Result
  .findOne(req.params.result_id)
  .then(function(result) {
    res.send(result);
  });
});


module.exports = userRouter;