"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("desireds_users", {
      desired_id: {
        type: DataTypes.INTEGER
      },
      user_id: {
        type: DataTypes.INTEGER
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
    migration.dropTable("desireds_users").done(done);
  }
};
