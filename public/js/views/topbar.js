App.Views.Topbar = Backbone.View.extend({

  el: "#header",

  initialize: function() {
    console.log("New Topbar View");
    this.template = Handlebars.compile( $("#topbar-template").html() );
  },

  render: function() {
    this.$el.html(this.template);
  },

  showProfile: function() {
    var userID = parseInt( Backbone.history.fragment.split("/")[1] );
    App.profileView.render();
  },

  showMainView: function() {
    var userID = parseInt( Backbone.history.fragment.split("/")[1] );
    App.mainView.render();
  },

  logout: function() {
    $.ajax({
      url: "/logout",
      method: "DELETE"
    }).done(function(response) {
      App.login.render();
    })
  },

  events: {
    "click #topbar-profile": "showProfile",
    "click #topbar-analyze": "showMainView",
    "click #topbar-logout": "logout"
  }
});