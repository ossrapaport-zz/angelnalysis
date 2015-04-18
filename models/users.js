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
    }
  }, {

    underscored: true,

    classMethods: {
      associate: function(models) {
        users.belongsToMany(models.desireds, {
          foreignKey: "user_id",
          through: "desireds_users"
        });
      }
    }
  });
  return users;
};