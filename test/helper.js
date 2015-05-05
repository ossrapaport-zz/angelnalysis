process.env.NODE_ENV = "test";

var app       = require('../server.js'),
   server;

before(function(done) {
 server = app.listen(3000);
});

after(function(done) {
 server.close(done);
})