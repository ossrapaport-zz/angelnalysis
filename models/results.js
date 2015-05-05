"use strict";
module.exports = function(sequelize, DataTypes) {
  var results = sequelize.define("results", {
    openness_score: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        isDecimal: {msg: "The Openness Score must be a decimal"}
      }
    },
    conscientiousness_score: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        isDecimal: {msg: "The Conscientiousness Score must be a decimal"}
      }
    },
    extraversion_score: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        isDecimal: {msg: "The Extraversion Score must be a decimal"}
      }
    },
    agreeableness_score: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        isDecimal: {msg: "The Agreeableness Score must be a decimal"}
      }
    },
    neuroticism_score: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        isDecimal: {msg: "The Neuroticism Score must be a decimal"}
      }
    },
    most_messaged_friend: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {msg: "You must enter a name for the most messaged friend"}
      }
    },
    most_messaged_friend_bio: {
      type: DataTypes.STRING,
      allowNull: true
    },
    most_followed_follower: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {msg: "You must enter a name for the most followed follower"}
      }
    },
    most_followed_follower_bio: {
      type: DataTypes.STRING,
      allowNull: true
    },
    most_followed_following: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {msg: "You must enter a name for the most followed following"}
      }
    },
    most_followed_following_bio: {
      type: DataTypes.STRING,
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
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