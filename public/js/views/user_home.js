App.Views.UserHome = Backbone.View.extend({

  el: "#app-wrapper",

  initialize: function() {
    console.log("New User Home View");
    this.template = Handlebars.compile( $("#main-user-template").html() );
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
    var userID = Backbone.history.fragment.split("/")[1];
    $.post("/results/" + userID)
    .done(this.renderResult.bind(this))
    .done(this.renderRadarChart.bind(this));
  },

  renderResult: function(result) {
    var parsedData = {
      name: "Most Valuable Connections",
      children: [
        {
          name: result.most_messaged_friend,
          bio: result.most_messaged_friend_bio
        },
        {
          name: result.most_followed_follower,
          bio: result.most_followed_follower_bio
        },
        {
          name: result.most_followed_following,
          bio: result.most_followed_following_bio
        }
      ]
    };
    App.buildTree("#left-result-container", parsedData);
  },

  renderRadarChart: function(result) {
    
    var scores = [
      [{
        axis: "Agreeableness",
        value: result.agreeableness_score 
      },
      {
        axis: "Conscientiousness",
        value: result.conscientiousness_score 
      },
      {
        axis: "Extraversion",
        value: result.extraversion_score
      },
      {
        axis: "Neuroticism",
        value: result.neuroticism_score
      },
      {
        axis: "Openness",
        value: result.openness_score 
      }],
      [
        {axis: "Agreeableness", value: 4, type: "Scale"},
        {axis: "Conscientiousness", value: 4},
        {axis: "Extraversion", value: 4},
        {axis: "Neuroticism", value: 4},
        {axis: "Openness", value: 4}
      ]
    ]; 

    App.RadarChart.draw("#right-result-container", scores, true, "blue", 4);
  },

  events: {
    "click #search-button": "searchForAnalysis"
  }
});