"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING
      },
      angellist_id: {
        type: DataTypes.INTEGER
      },
      image: {
        type: DataTypes.TEXT
      },
      email: {
        unique: true,
        type: DataTypes.STRING
      },
      bio: {
        type: DataTypes.TEXT
      },
      what_ive_built: {
        type: DataTypes.TEXT
      },
      what_i_do: {
        type: DataTypes.TEXT
      },
      criteria: {
        type: DataTypes.TEXT
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }).done(done);
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable("users").done(done);
  }
};