App.Views.UserHome = Backbone.View.extend({

  el: "#app-wrapper",

  initialize: function() {
    console.log("New User Home View");
    this.template = Handlebars.compile( $("#main-user-template").html() );
    //TODO: Evaluate the below while using set
    //this.listenTo(this.model, "change", this.render);
  },

  render: function() {
    var compiledTemplate = this.template( this.model.toJSON() );
    this.$el.html(compiledTemplate);
    var userID = Backbone.history.fragment.split("/")[1];
    App.router.navigate("home/" + userID);
  },

  setUser: function(user) {
    this.model = user;
  },

  searchForAnalysis: function() {
    $.post("/results")
    .done(this.renderResult.bind(this));
  },

  renderResult: function(data) {
    //TODO: Make a result show up. Either set it or just use
    //the raw data
  },

  events: {
    "click #search-button": "searchForAnalysis"
  }
});