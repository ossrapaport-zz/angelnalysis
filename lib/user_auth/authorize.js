var authorize = function(req, res, next) {
  var sessionID = parseInt( req.session.currentUser );
  var reqID = parseInt( req.params.user_id );

  sessionID === reqID ? next() : res.status(400).send({
    err: 400,
    msg: "You are not allowed to see that"
  });
};

module.exports = authorize;