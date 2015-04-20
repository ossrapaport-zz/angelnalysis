App = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {}
};

App.Models.User = Backbone.Model.extend({

  initialize: function() {
    console.log("New User Model");
  },
  urlRoot: "/users"

});