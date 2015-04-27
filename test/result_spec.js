var expect = require("chai").expect;
var Result = require("../models").results;

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
      });
    });

  });



});