App.Views.Login = Backbone.View.extend({

  el: "#app-wrapper",

  initialize: function() {
    console.log("New Login View");
    this.template = Handlebars.compile( $("#login-template").html() );
  },

  render: function() {
    this.$el.html(this.template);
    //TODO: Find out how to fix router's not being defined yet
    //App.router.navigate("login");
  }

});