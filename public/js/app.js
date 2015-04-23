var App = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {}
};

$(function() {
  console.log("App loaded");
  App.router = new App.Routers.Main();
  Backbone.history.start();
});

