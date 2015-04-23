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
    var userID = Backbone.history.fragment.split("/")[1];
    $.post("/results/" + userID)
    .done(this.renderResult.bind(this))
    .done(this.renderRadarChart.bind(this));
  },

  renderResult: function(result) {
    var valueData = {
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

    var width = 600;
    var height = 600;


    var canvas = d3.select("#left-result-container").append("svg")
                  .attr("width", width)
                  .attr("height", height)
                  .append("g")
                    .attr("transform", "translate(50,50)");

  

    var update = function(desiredDepth) {
      //d3.select("svg").text("");
      var tree = d3.layout.tree()
        .size([400, 400]);

      var diagonal = d3.svg.diagonal()
        .projection(function(d) {
          return [d.x, d.y];
        });

      var nodes = tree.nodes(valueData);
      //context.clearRect(0, 0, canvas.width, canvas.height);
      var currentNodes = nodes.filter(function(node) {
        return node.depth <= desiredDepth;
      });

      var node = canvas.selectAll(".node")
              .data(currentNodes)
              .enter()
                .append("g")
                .attr("class", "node")
                .attr("transform", function(d) {
                  return "translate(" + d.x + "," + d.y + ")";
                });

      debugger;

      node.append("circle")
          .attr("r", function(d) {
            return d.depth === 0 ? 10 : 5;
          })
          .attr("fill", function(d) {
            return d.children ? "lightsteelblue" : "#fff"
          })
          .attr("stroke", "steelblue")
          .attr("stroke-width", function(d) {
            return d.depth === 0 ? 2 : 1;
          })
          .on("click", click);

      node.append("text")
          .text(function(d) {
            return d.name;
          });

      if (currentNodes.length > 1) {      
        var links = tree.links(currentNodes);
        canvas.selectAll(".links")
              .data(links)
              .enter()
                .append("path")
                .attr("class", "link")
                .attr("fill", "none")
                .attr("stroke", "#ADADAD")
                .attr("stroke-width", 5)
                .attr("d", diagonal);
      };

    };

    var click = function(d) {
      var centralNode = d3.select(this);
      centralNode.classed("expanded", !centralNode.classed("expanded"));
      debugger;
      if (centralNode.classed("expanded")) {
        update(1);
      } else {
        debugger;
        update(0);
      }
    }

    update(0);
  },

  renderRadarChart: function(result) {
    var scores = [
      {
        name: "Agreeableness",
        score: result.agreeableness_score, 
      },
      {
        name: "Conscientiousness",
        score: result.conscientiousness_score 
      },
      {
        name: "Extraversion",
        score: result.extraversion_score
      },
      {
        name: "Neuroticism",
        score: result.neuroticism_score
      },
      {
        name: "Openness",
        score: result.openness_score 
      }
    ];

/*    var canvas = d3.select("#right-result-container").append("svg")
                  .attr("width", 500)
                  .attr("height", 500)
                  .append("g")
                    .attr("transform", "translate(50,50)");

    var width = 500;
    var height = 500;

    canvas.append("path")
          .style("stroke", "black")
          .style("fill", "none")
          .attr("d", "M 250,150, L200,200, L214.645, 272.211, L285.356, 272.211, L300,200, Z");
*/
    var canvas = d3.select("#right-result-container")
        .append("svg")
        .attr("width", 700)
        .attr("height", 700);

    var axisArray = [];

    var opennessScale = d3.scale.linear()
        .domain([0, 200])
        .range([0, 200]);

    var axis1 = d3.svg.axis()
        .scale(opennessScale);

    var axis1Group = canvas.append("g")
        .attr("transform", "translate(280,280) rotate(342)")
        .call(axis1)
        .style("fill", "none");

    var axis2 = d3.svg.axis()
        .scale(opennessScale);

    var axis2Group = canvas.append("g")
        .attr("transform", "translate(280,280) rotate(54)")
        .call(axis2);      

    var axis3 = d3.svg.axis()
        .scale(opennessScale);

    var axis3Group = canvas.append("g")
        .attr("transform", "translate(280,280) rotate(126)")
        .call(axis3);

    var axis4 = d3.svg.axis()
        .scale(opennessScale);

    var axis4Group = canvas.append("g")
        .attr("transform", "translate(280,280) rotate(198)")
        .call(axis4);    

    var axis5 = d3.svg.axis()
        .scale(opennessScale)

    var axis5Group = canvas.append("g")
        .attr("transform", "translate(280,280) rotate(270)")
        .call(axis5);

    canvas.append("g")
          .attr("class", "grid")
          .attr("transform", "translate(0," + 500 + ")");



  },

  events: {
    "click #search-button": "searchForAnalysis"
  }
});