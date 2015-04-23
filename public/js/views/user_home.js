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
    debugger;
    var scores = [
      [{
        axis: "Agreeableness",
        value: App.normalize(result.agreeableness_score, "Agreeableness")
      },
      {
        axis: "Conscientiousness",
        value: App.normalize(result.conscientiousness_score, "Conscientiousness") 
      },
      {
        axis: "Extraversion",
        value: App.normalize(result.extraversion_score, "Extraversion")
      },
      {
        axis: "Neuroticism",
        value: App.normalize(result.neuroticism_score, "Neuroticism")
      },
      {
        axis: "Openness",
        value: App.normalize(result.openness_score, "Openness") 
      }],
      [
        {axis: "Agreeableness", value: .5, type: "Scale"},
        {axis: "Conscientiousness", value: .5},
        {axis: "Extraversion", value: .5},
        {axis: "Neuroticism", value: .5},
        {axis: "Openness", value: .5}
      ],
      [
        {axis: "Agreeableness", value: 1, type: "Scale"},
        {axis: "Conscientiousness", value: 1},
        {axis: "Extraversion", value: 1},
        {axis: "Neuroticism", value: 1},
        {axis: "Openness", value: 1}
      ]
    ]; 

    App.RadarChart.draw("#right-result-container", scores, true, "blue", 1);
  },

  events: {
    "click #search-button": "searchForAnalysis"
  }
});