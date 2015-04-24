App.Views.UserProfile = Backbone.View.extend({

  el: "#app-wrapper",

  initialize: function() {
    console.log("New User View");
    this.template = Handlebars.compile( $("#user-profile-template").html() );
    //this.listenTo(this.model, "change", this.render);
  },  

  render: function() {
    var compiledTemplate = this.template( this.model.toJSON() );
    this.$el.html(compiledTemplate);
    var userID = Backbone.history.fragment.split("/")[1];
    App.router.navigate("profile/" + userID);
  },

  setUser: function(user) {
    this.model = user;
  }/*,

  showAResult: function(event) {
    var resultID = $(event.currentTarget).attr("result-id");
    var userID = Backbone.history.fragment.split("/")[1];
    $.get("/results/" + userID + "/" + resultID)
    .done(renderResult);
  },

  renderResult: function(result) {
    //TODO: Make the result show up here with D3 
  },

  events: {
    "click .result-tag": "showAResult"
  }*/

});