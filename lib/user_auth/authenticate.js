var authenticate = function(req, res, next) {
  req.session.token && req.session.angelID && req.session.currentUser ? next() : res.status(400).send({
    err: 400,
    msg: "You have to login first"
  });
};

module.exports = authenticate;