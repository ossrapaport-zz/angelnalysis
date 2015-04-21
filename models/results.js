"use strict";
module.exports = function(sequelize, DataTypes) {
  var results = sequelize.define("results", {
    openness_score: {
      type: DataTypes.DECIMAL,
      validate: {
        isDecimal: {msg: "The Openness Score must be an decimal"}
      }
    },
    conscientiousness_score: {
      type: DataTypes.DECIMAL,
      validate: {
        isDecimal: {msg: "The Conscientiousness Score must be an decimal"}
      }
    },
    extraversion_score: {
      type: DataTypes.DECIMAL,
      validate: {
        isDecimal: {msg: "The Extraversion Score must be an decimal"}
      }
    },
    agreeableness_score: {
      type: DataTypes.DECIMAL,
      validate: {
        isDecimal: {msg: "The Agreeableness Score must be an decimal"}
      }
    },
    neuroticism_score: {
      type: DataTypes.DECIMAL,
      validate: {
        isDecimal: {msg: "The Neuroticism Score must be an decimal"}
      }
    },
    most_messaged_friend: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {msg: "You must enter a name for the most messaged friend"}
      }
    },
    most_followed_follower: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {msg: "You must enter a name for the most followed follower"}
      }
    },
    most_followed_following: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {msg: "You must enter a name for the most followed following"}
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