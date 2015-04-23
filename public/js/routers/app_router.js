App.Routers.Main = Backbone.Router.extend({

  initialize: function() {
    console.log("New router initialized");

    App.topbar = new App.Views.Topbar();

    App.userHome = new App.Views.UserHome();

    App.userProfile = new App.Views.UserProfile();

    App.loginView = new App.Views.Login();
    App.loginView.render(); 
  },

  routes: {
    "login": "showLogin",
    "home/:user_id": "showUserHome",
    "profile/:user_id": "showUserProfile",
  },

  showLogin: function() {
    App.loginView.$el.empty();
    App.loginView.render();
    //TODO: Find out how Frank did the topbar in First Date
    App.topbar.$el.empty();
  },

  showUserHome: function(user_id) {
    var currentUser = new App.Models.User({id: user_id});
    currentUser.fetch({
      success: function(model, response, options) {
        App.userHome.setUser(model);
        App.userHome.render();
        App.topbar.render();  
      }
    });
  },

  showUserProfile: function(user_id) {
    var currentUser = new App.Models.User({id: user_id});
    currentUser.fetch({
      success: function(model, response, options) {
        App.userProfile.setUser(currentUser);
        App.userProfile.render();
        App.topbar.render();    
      }
    });
  }

});