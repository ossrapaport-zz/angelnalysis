App.Views.UserProfile = Backbone.View.extend({

  el: "#app-wrapper",

  initialize: function() {
    console.log("New User View");
    this.template = Handlebars.compile( $("#user-profile-template").html() );
    this.listenTo(this.model, "change", this.render);
  },  

  render: function() {
    var compiledTemplate = this.template( this.model.toJSON() );
    this.$el.html(compiledTemplate);
  },

  setUser: function(user) {
    this.model = user;
  },

  showAResult: function(event) {
    //Get the event's target, set its element as the past
    //result display, and then show it
  },

  events: {
    "click .result-tag": "showAResult"
  }

});