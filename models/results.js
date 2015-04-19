"use strict";
module.exports = function(sequelize, DataTypes) {
  var results = sequelize.define("results", {
    openness_score: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: {msg: "The Openness Score must be an integer"}
      }
    },
    conscientiousness_score: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: {msg: "The Conscientiousness Score must be an integer"}
      }
    },
    extraversion_score: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: {msg: "The Extraversion Score must be an integer"}
      }
    },
    agreeableness_score: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: {msg: "The Agreeableness Score must be an integer"}
      }
    },
    neuroticism_score: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: {msg: "The Neuroticism Score must be an integer"}
      }
    },
    most_messaged_friend: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {msg: "You must enter a name for the most messaged friend"},
        isAlpha: {msg: "The name of the most messaged friend can only include letters"}
      }
    },
    most_followed_follower: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {msg: "You must enter a name for the most followed follower"},
        isAlpha: {msg: "The name of the most followed follower can only include letters"}
      }
    },
    most_followed_following: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {msg: "You must enter a name for the most followed following"},
        isAlpha: {msg: "The name of the most followed following can only include letters"}
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: {msg: "The user ID must be an integer"}
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        results.belongsTo(models.users, {
          foreignKey: "user_id"
        });
      }
    }
  });
  return results;
};