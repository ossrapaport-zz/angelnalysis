var expect = require("chai").expect;
var Result = require("../../models").results;

describe("Results", function() {

  var nullResult,
      invalidResult,
      validResult;

  context("null result", function() {

    beforeEach("build a null result", function() {
      nullResult = Result.build();
    });

    it("should validate the presence of an openness score", function(done) {
      nullResult
      .validate()
      .then(function(err) {
        var error_fields = err.errors.map(function(error) {
          return error.path;
        });
        expect(error_fields).to.include("openness_score");
        done();
      });
    });

    it("should validate the presence of an extraversion score", function(done) {
      nullResult
      .validate()
      .then(function(err) {
        var error_fields = err.errors.map(function(error) {
          return error.path;
        });
        expect(error_fields).to.include("extraversion_score");
        done();
      });
    });

    it("should validate the presence of a conscientiousness score", function(done) {
      nullResult
      .validate()
      .then(function(err) {
        var error_fields = err.errors.map(function(error) {
          return error.path;
        });
        expect(error_fields).to.include("conscientiousness_score");
        done();
      });
    });

    it("should validate the presence of an agreeableness score", function(done) {
      nullResult
      .validate()
      .then(function(err) {
        var error_fields = err.errors.map(function(error) {
          return error.path;
        });
        expect(error_fields).to.include("agreeableness_score");
        done();
      });
    });

    it("should validate the presence of a neuroticism score", function(done) {
      nullResult
      .validate()
      .then(function(err) {
        var error_fields = err.errors.map(function(error) {
          return error.path;
        });
        expect(error_fields).to.include("neuroticism_score");
        done();
      });
    });

    it("should validate the presence of a most messaged friend", function(done) {
      nullResult
      .validate()
      .then(function(err) {
        var error_fields = err.errors.map(function(error) {
          return error.path;
        });
        expect(error_fields).to.include("most_messaged_friend");
        done();
      });
    });

    it("should allow the most messaged friend's bio to be empty", function(done) {
      nullResult
      .validate()
      .then(function(err) {
        var error_fields = err.errors.map(function(error) {
          return error.path;
        });
        expect(error_fields).to.not.include("most_messaged_friend_bio");
        done();
      });
    });

    it("should validate the presence of a most followed follower", function(done) {
      nullResult
      .validate()
      .then(function(err) {
        var error_fields = err.errors.map(function(error) {
          return error.path;
        });
        expect(error_fields).to.include("most_followed_follower");
        done();
      });
    });

    it("should allow the most followed follower's bio to be empty", function(done) {
      nullResult
      .validate()
      .then(function(err) {
        var error_fields = err.errors.map(function(error) {
          return error.path;
        });
        expect(error_fields).to.not.include("most_followed_follower_bio");
        done();
      });
    })

    it("should validate the presence of a most followed following", function(done) {
      nullResult
      .validate()
      .then(function(err) {
        var error_fields = err.errors.map(function(error) {
          return error.path;
        });
        expect(error_fields).to.include("most_followed_following");
        done();
      });
    });

    it("should allow the most followed following's bio to be empty", function(done) {
      nullResult
      .validate()
      .then(function(err) {
        var error_fields = err.errors.map(function(error) {
          return error.path;
        });
        expect(error_fields).to.not.include("most_followed_following_bio");
        done();
      });
    });

    it("should validate the presence of a user id", function(done) {
      nullResult
      .validate()
      .then(function(err) {
        var error_fields = err.errors.map(function(error) {
          return error.path;
        });
        expect(error_fields).to.include("user_id");
        done();
      });
    });
  });

  context("invalid user", function() {

    beforeEach("build an invalid user", function() {
      invalidResult = Result.build({
        openness_score: "string",
        conscientiousness_score: "string",
        extraversion_score: "string",
        agreeableness_score: "string",
        neuroticism_score: "string",
        most_messaged_friend: "",
        most_followed_follower: "",
        most_followed_following: "",
        user_id: "string"
      });
    });

    it("should validate the decimal nature of the openness score", function(done) {
      invalidResult
      .validate()
      .then(function(err) {
        var error = err.errors.filter(function(error) {
          return error.path === "openness_score";
        })[0];
        console.log(error);
        expect(error.message).to.equal("The Openness Score must be a decimal");
        done();        
      });
    });

    it("should validate the decimal nature of the conscientiousness score", function(done) {
      invalidResult
      .validate()
      .then(function(err) {
        var error = err.errors.filter(function(error) {
          return error.path === "conscientiousness_score";
        })[0];
        console.log(error);
        expect(error.message).to.equal("The Conscientiousness Score must be a decimal");
        done();        
      });
    });

    it("should validate the decimal nature of the extraversion score", function(done) {
      invalidResult
      .validate()
      .then(function(err) {
        var error = err.errors.filter(function(error) {
          return error.path === "extraversion_score";
        })[0];
        console.log(error);
        expect(error.message).to.equal("The Extraversion Score must be a decimal");
        done();        
      });
    });

    it("should validate the decimal nature of the agreeableness score", function(done) {
      invalidResult
      .validate()
      .then(function(err) {
        var error = err.errors.filter(function(error) {
          return error.path === "agreeableness_score";
        })[0];
        console.log(error);
        expect(error.message).to.equal("The Agreeableness Score must be a decimal");
        done();        
      });
    });

    it("should validate the decimal nature of the neuroticism score", function(done) {
      invalidResult
      .validate()
      .then(function(err) {
        var error = err.errors.filter(function(error) {
          return error.path === "neuroticism_score";
        })[0];
        console.log(error);
        expect(error.message).to.equal("The Neuroticism Score must be a decimal");
        done();        
      });
    });

    it("should validate the not empty nature of the most messaged friend", function(done) {
      invalidResult
      .validate()
      .then(function(err) {
        var error = err.errors.filter(function(error) {
          return error.path === "most_messaged_friend";
        })[0];
        console.log(error);
        expect(error.message).to.equal("You must enter a name for the most messaged friend");
        done();        
      });
    });

    it("should validate the not empty nature of the most followed follower", function(done) {
      invalidResult
      .validate()
      .then(function(err) {
        var error = err.errors.filter(function(error) {
          return error.path === "most_followed_follower";
        })[0];
        console.log(error);
        expect(error.message).to.equal("You must enter a name for the most followed follower");
        done();        
      });
    });

    it("should validate the not empty nature of the most followed following", function(done) {
      invalidResult
      .validate()
      .then(function(err) {
        var error = err.errors.filter(function(error) {
          return error.path === "most_followed_following";
        })[0];
        console.log(error);
        expect(error.message).to.equal("You must enter a name for the most followed following");
        done();        
      });
    });

    it("should validate the integer nature of the user ID", function(done) {
      invalidResult
      .validate()
      .then(function(err) {
        var error = err.errors.filter(function(error) {
          return error.path === "user_id";
        })[0];
        console.log(error);
        expect(error.message).to.equal("The user ID must be an integer");
        done();        
      });
    });
  });

  context("valid result", function() {

    beforeEach("build a valid result", function() {
      validResult = Result.build({
        openness_score: 3.14,
        conscientiousness_score: 1.59,
        extraversion_score: 2.65,
        agreeableness_score: 3.58,
        neuroticism_score: 9.79,
        most_messaged_friend: "Daenerys Targaryen",
        most_followed_follower: "Jon Snow",
        most_followed_following: "The Red God",
        user_id: 1
      });
    });

    it("should not have any errors", function(done) {
      validResult
      .validate()
      .then(function(err) {
        expect(err).to.be.undefined;
        done();
      });
    });
  });
});