"use strict";
module.exports = function(sequelize, DataTypes) {
  var users = sequelize.define("users", {
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {msg: "You must enter a name"}
      }
    },
    angellist_id: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: {msg: "angellist_id must be an integer"}
      }
    },
    image: {
      type: DataTypes.TEXT,
      validate: {
        isUrl: {msg: "The image must be a URL link"}
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: {msg: "The email must be a valid email"}
      }
    },
    bio: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: {msg: "The bio must be a valid bio"}
      }
    },
    what_ive_built: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: {msg: "The What I've Built section must be a valid What I've Built section"}
      }
    },
    what_i_do: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: {msg: "The What I Do section must be a valid What I Do section"}
      }
    },
    criteria: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: {msg: "The criteria must be a valid criteria"}
      }
    }
  }, {

    underscored: true,

    classMethods: {
      associate: function(models) {
        users.hasMany(models.results, {
          foreignKey: "user_id",
        });
      }
    }
  });
  return users;
};