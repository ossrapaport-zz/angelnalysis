var expect = require("chai").expect,
    User   = require("../models").users;

describe("User", function() {

  var nullUser,
      invalidUser,
      validUser;

  context("null user", function() {

    beforeEach("build a null user", function() {
      nullUser = User.build();
    });

    it("should validate the presence of a name", function(done) {
      nullUser
      .validate()
      .then(function(err) {
        var error_fields = err.errors.map(function(error) {
          return error.path;
        });
        expect(error_fields).to.include("name");
        done();
      });
    });






  })






});