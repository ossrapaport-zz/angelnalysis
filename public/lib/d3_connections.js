App.buildTree = function(element, valueData) {

  var width  = 450;
  var height = 500;

  var container = d3.select(element).append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                  .attr("transform", "translate(0,50)");

  var update = function(desiredDepth) {
    //d3.select("svg").text("");
    var tree = d3.layout.tree()
      .size([350, 350]);

    var diagonal = d3.svg.diagonal()
      .projection(function(d) {
        return [d.x, d.y];
      });

    var nodes = tree.nodes(valueData);
    //context.clearRect(0, 0, container.width, container.height);
    var currentNodes = nodes.filter(function(node) {
      return node.depth <= desiredDepth;
    });

    var node = container.selectAll(".node")
            .data(currentNodes)
            .enter()
              .append("g")
              .attr("class", "node")
              .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
              });

    node.append("circle")
        .attr("r", function(d) {
          return d.depth === 0 ? 10 : 5;
        })
        .attr("fill", "royalblue")
        .attr("stroke-width", function(d) {
          return d.depth === 0 ? 2 : 1;
        })

    node.append("text")
        .text(function(d) {
          if (d.name !== "Most Valuable Connections") {
            return d.name;
          }
        })
        .attr("text-anchor", "middle");

    if (currentNodes.length > 1) {      
      var links = tree.links(currentNodes);
      container.selectAll(".links")
            .data(links)
            .enter()
              .append("path")
              .attr("class", "link")
              .attr("fill", "none")
              .attr("stroke", "#ADADAD")
              .attr("stroke-width", 1)
              .attr("d", diagonal);
    };

    container.append("svg:text")
            .attr("class", "title")
            .attr("x", 20)
            .attr("y", 0)
            .text("Your Most Valuable Connections")
              .style("font-size", "20px")
              .style("font-weight", "bold")
              .style("fill", "royalblue");

  };

  update(1);
};