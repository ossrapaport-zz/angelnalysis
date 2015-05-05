var expect = require("chai").expect,
    User   = require("../../models").users;

describe("User", function() {

  var nullUser,
      invalidUser,
      validUser,
      test;

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

    it("should validate the presence of an AngelList ID", function(done) {
      console.log(nullUser);
      nullUser
      .validate()
      .then(function(err) {
        var error_fields = err.errors.map(function(error) {
          return error.path;
        });
        expect(error_fields).to.include("angellist_id");
        done();
      });
    });

    it("should validate the presence of an image", function(done) {
      nullUser
      .validate()
      .then(function(err) {
        var error_fields = err.errors.map(function(error) {
          return error.path;
        });
        expect(error_fields).to.include("image");
        done();
      });
    });

    it("should validate the presence of an email", function(done) {
      nullUser
      .validate()
      .then(function(err) {
        var error_fields = err.errors.map(function(error) {
          return error.path;
        });
        expect(error_fields).to.include("email");
        done();
      });
    });

    it("should validate the presence of a bio", function(done) {
      nullUser
      .validate()
      .then(function(err) {
        var error_fields = err.errors.map(function(error) {
          return error.path;
        });
        expect(error_fields).to.include("bio");
        done();
      });
    });

    it("should validate the presence of an what_ive_built field", function(done) {
      nullUser
      .validate()
      .then(function(err) {
        var error_fields = err.errors.map(function(error) {
          return error.path;
        });
        expect(error_fields).to.include("what_ive_built");
        done();
      });
    });

    it("should validate the presence of a what_i_do field", function(done) {
      nullUser
      .validate()
      .then(function(err) {
        var error_fields = err.errors.map(function(error) {
          return error.path;
        });
        expect(error_fields).to.include("what_i_do");
        done();
      });
    });

    it("should validate the presence of criteria", function(done) {
      nullUser
      .validate()
      .then(function(err) {
        var error_fields = err.errors.map(function(error) {
          return error.path;
        });
        expect(error_fields).to.include("criteria");
        done();
      });
    });
  });

  context("invalid user", function() {

    beforeEach("build an invalid user", function() {
      invalidUser = User.build({
        name: "",
        angellist_id: "string",
        image: "beep",
        email: "Not a valid email",
        bio: "",
        what_ive_built: "",
        what_i_do: "",
        criteria: ""
      });
    });

    it("should validate the need for a name", function(done) {
      invalidUser
      .validate()
      .then(function(err) {
        var error = err.errors.filter(function(error) {
          return error.path === "name";
        })[0];
        expect(error.message).to.equal("You must enter a name");
        done();
      });
    });

    it("should validate the integer nature of AngelList ID", function(done) {
      invalidUser
      .validate()
      .then(function(err) {
        var error = err.errors.filter(function(error) {
          return error.path === "angellist_id";
        })[0];
        expect(error.message).to.equal("angellist_id must be an integer");
        done();
      });
    });

    it("should validate the URL nature of the image", function(done) {
      invalidUser
      .validate()
      .then(function(err) {
        var error = err.errors.filter(function(error) {
          return error.path === "image";
        })[0];
        expect(error.message).to.equal("The image must be a URL link");
        done();
      });
    });

    it("should validate the email nature of email", function(done) {
      invalidUser
      .validate()
      .then(function(err) {
        var error = err.errors.filter(function(error) {
          return error.path === "email";
        })[0];
        expect(error.message).to.equal("The email must be a valid email");
        done();
      });
    });

    it("should validate the need for a bio", function(done) {
      invalidUser
      .validate()
      .then(function(err) {
        var error = err.errors.filter(function(error) {
          return error.path === "bio";
        })[0];
        expect(error.message).to.equal("The bio must be a valid bio");
        done();
      });
    });

    it("should validate the need for a what_ive_built field", function(done) {
      invalidUser
      .validate()
      .then(function(err) {
        var error = err.errors.filter(function(error) {
          return error.path === "what_ive_built";
        })[0];
        expect(error.message).to.equal("The What I've Built section must be a valid What I've Built section");
        done();
      });
    });

    it("should validate the need for a what_i_do field", function(done) {
      invalidUser
      .validate()
      .then(function(err) {
        var error = err.errors.filter(function(error) {
          return error.path === "what_i_do";
        })[0];
        expect(error.message).to.equal("The What I Do section must be a valid What I Do section");
        done();
      });
    });

    it("should validate the need for criteria", function(done) {
      invalidUser
      .validate()
      .then(function(err) {
        var error = err.errors.filter(function(error) {
          return error.path === "criteria";
        })[0];
        expect(error.message).to.equal("The criteria must be valid criteria");
        done();
      });
    });
  });


  context("valid user", function() {

    beforeEach("make a valid user", function() {
      validUser = User.build({
        name: "Owen Rapaport",
        angellist_id: 12345,
        image: "http://www.placecage.com/200/300",
        email: "ossr@gmail.com",
        bio: "Love testing!!",
        what_ive_built: "So many tests",
        what_i_do: "Test all day every day",
        criteria: "Lots of tests wherever I go plz"
      });
    });

    it("should not have any errors", function(done) {
      validUser
      .validate()
      .then(function(err) {
        expect(err).to.be.undefined;
        done();
      });
    });
  });
});