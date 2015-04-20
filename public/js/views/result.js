App.Views.Result = Backbone.View.extend({

  el: "#new-result-container",

  intitialize: function() {
    console.log("New Result View");
    this.template = Handlebars.compile( $("#result-template").html() );
  },

  render: function() {
    var compiledTemplate = this.template( this.model.toJSON() );
    this.$el.html(compiledTemplate);
  },

  setResult: function(result) {
    this.model = result;
  }

});