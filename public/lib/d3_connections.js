App.buildTree = function(element, valueData) {

  var width  = 450;
  var height = 500;

  var canvas = d3.select(element).append("svg")
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
        //.on("click", click);

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

/*  var click = function(d) {
    var centralNode = d3.select(this);
    centralNode.classed("expanded", !centralNode.classed("expanded"));
    if (centralNode.classed("expanded")) {
      update(1);
    } else {
      update(0);
    }
  }*/

  update(1);
};