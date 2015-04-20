App.Views.Login = Backbone.View.extend({

  el: "#app-wrapper",

  initialize: function() {
    console.log("New Login View");
    this.template = Handlebars.compile( $("#login-template").html() );
  },

  render: function() {
    this.$el.html(this.template);
  },

  login: function() {
    $.get("/auth/angellist")
    .done(function(user) {
      //TODO: Either make a new user model or set the user
      //with this data.
    });
  },

  events: {
    "click #login-button": "login"
  }


});