"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("results", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      openness_score: {
        type: DataTypes.INTEGER
      },
      conscientiousness_score: {
        type: DataTypes.INTEGER
      },
      extraversion_score: {
        type: DataTypes.INTEGER
      },
      agreeableness_score: {
        type: DataTypes.INTEGER
      },
      neuroticism_score: {
        type: DataTypes.INTEGER
      },
      most_messaged_friend: {
        type: DataTypes.STRING
      },
      most_followed_follower: {
        type: DataTypes.STRING
      },
      most_followed_following: {
        type: DataTypes.STRING
      },
      user_id: {
        type: DataTypes.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }).done(done);
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable("results").done(done);
  }
};