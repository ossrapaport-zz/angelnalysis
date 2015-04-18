"use strict";
module.exports = function(sequelize, DataTypes) {
  var desireds = sequelize.define("desireds", {
    description: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {msg: "You must provide a description"},
        isAlpha: {msg: "The description can only consist of letters"}
      }
    },
    type: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {msg: "You must provide a type"},
        isAlpha: {msg: "The type can only consist of letters"}
      }
    },
    angellist_id: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: {msg: "The AngelList ID must be an integer"}
      }
    }
  }, {

    underscored: true,

    classMethods: {
      associate: function(models) {
        desireds.belongsToMany(models.users, {
          through: "desireds_users",
          foreignKey: "desired_id"
        });
      }
    }
  });
  return desireds;
};