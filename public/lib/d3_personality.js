App.RadarChart = {
  defaultConfig: {
    containerClass: "radar-chart",
    w: 450,
    h: 450,
    factor: 0.95,
    factorLegend: 1,
    levels: 3,
    levelTick: false,
    TickLength: 10,
    maxValue: 20,
    radians: 2 * Math.PI,
    coloring: d3.scale.category10(),
    color: "",
    axisLine: true,
    axisText: true,
    circles: true,
    radius: 5,
    backgroundTooltipColor: "#555",
    backgroundTooltipOpacity: "0.7",
    tooltipColor: "white",
    axisJoin: function(d, i) {
      return d.className || i;
    },
    transitionDuration: 300
  },
  chart: function() {
    // default config - Why not just set the cfg to be the config?
    var cfg = Object.create(App.RadarChart.defaultConfig);
    var tooltip;

    var radar = function (selection) {
      selection.each(function(data) {
        var container = d3.select(this);
        
        // allow simple notation
        data = data.map(function(datum) {
          if (datum instanceof Array) {
            datum = {axes: datum};
          }
          return datum;
        });

        var maxValue = Math.max(cfg.maxValue, d3.max(data, function(d) {
          return d3.max(d.axes, function(o) { 
            return o.value; 
          });
        }));

        var allAxis = data[0].axes.map(function(i, j) { 
          return {
            name: i.axis, 
            xOffset: (i.xOffset) ? i.xOffset : 0, 
            yOffset: (i.yOffset) ? i.yOffset : 0
          };
        });
        var total = allAxis.length;
        var radius = cfg.factor * Math.min(cfg.w / 2, cfg.h / 2);

        container.classed(cfg.containerClass, 1);

        var getPosition = function (i, range, factor, func) {
          factor = typeof factor !== "undefined" ? factor : 1;
          return range * (1 - factor * func(i * cfg.radians / total));
        }
        var getHorizontalPosition = function (i, range, factor) { 
          return getPosition(i, range, factor, Math.sin);
        }
        var getVerticalPosition = function (i, range, factor) {
          return getPosition(i, range, factor, Math.cos);
        }

        // levels && axises
        var levelFactors = d3.range(0, cfg.levels).map(function(level) {
          return radius * ((level + 1) / cfg.levels);
        });

        var levelGroups = container
            .selectAll("g.level-group")
            .data(levelFactors);

        levelGroups.enter()
                    .append("g");
        levelGroups.exit()
                    .remove();

        levelGroups.attr("class", function(d, i) {
          return "level-group level-group-" + i;
        });

        var levelLine = levelGroups.selectAll(".level")
            .data(function(levelFactor) {
              return d3.range(0, total).map(function() { return levelFactor; });
            });

        levelLine.enter()
                  .append("line");
        levelLine.exit()
                  .remove();

        if (cfg.levelTick) {
          levelLine.attr("class", "level")
            .attr("x1", function(levelFactor, i) {
              if (radius == levelFactor) {
                return getHorizontalPosition(i, levelFactor);
              } else {
                return getHorizontalPosition(i, levelFactor) + (cfg.TickLength / 2) * Math.cos(i * cfg.radians / total);
              }
            })
            .attr("y1", function(levelFactor, i) {
              if (radius == levelFactor) {
                return getVerticalPosition(i, levelFactor);
              } else {
                return getVerticalPosition(i, levelFactor) - (cfg.TickLength / 2) * Math.sin(i * cfg.radians / total);
              }
            })
            .attr("x2", function(levelFactor, i) {
              if (radius == levelFactor) {
                return getHorizontalPosition(i+1, levelFactor);
              } else {
                return getHorizontalPosition(i, levelFactor) - (cfg.TickLength / 2) * Math.cos(i * cfg.radians / total);
              }
            })
            .attr("y2", function(levelFactor, i) {
              if (radius == levelFactor) {
                return getVerticalPosition(i+1, levelFactor);
              } else {
                return getVerticalPosition(i, levelFactor) + (cfg.TickLength / 2) * Math.sin(i * cfg.radians / total);
              }
            })
            .attr("transform", function(levelFactor) {
              return "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor) + ")";
            });
        }
        else {
          levelLine.attr("class", "level")
            .attr("x1", function(levelFactor, i) { 
              return getHorizontalPosition(i, levelFactor); 
            })
            .attr("y1", function(levelFactor, i) { 
              return getVerticalPosition(i, levelFactor); 
            })
            .attr("x2", function(levelFactor, i) { 
              return getHorizontalPosition(i+1, levelFactor); 
            })
            .attr("y2", function(levelFactor, i) { 
              return getVerticalPosition(i+1, levelFactor); 
            })
            .attr("transform", function(levelFactor) {
              return "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor) + ")";
            });
        }

        if (cfg.axisLine || cfg.axisText) {
          var axis = container.selectAll(".axis").data(allAxis);

          var newAxis = axis.enter()
              .append("g");

          if (cfg.axisLine) {
            newAxis.append("line");
          }
          if (cfg.axisText) {
            newAxis.append("text");
          }

          axis.exit()
              .remove();

          axis.attr("class", "axis");

          if (cfg.axisLine) {
            axis.select("line")
              .attr("x1", cfg.w/2)
              .attr("y1", cfg.h/2)
              .attr("x2", function(d, i) { 
                return getHorizontalPosition(i, cfg.w / 2, cfg.factor); 
              })
              .attr("y2", function(d, i) { 
                return getVerticalPosition(i, cfg.h / 2, cfg.factor); 
              });
          }

          if (cfg.axisText) {
            axis.select("text")
              .attr("class", function(d, i){
                var p = getHorizontalPosition(i, 0.5);

                return "legend " +
                  ((p < 0.4) ? "left" : ((p > 0.6) ? "right" : "middle"));
              })
              .attr("dy", function(d, i) {
                var p = getVerticalPosition(i, 0.5);
                return ((p < 0.1) ? "1em" : ((p > 0.9) ? "0" : "0.5em"));
              })
              .text(function(d) { 
                return d.name; 
              })
              .attr("x", function(d, i) { 
                return d.xOffset + getHorizontalPosition(i, cfg.w/2, cfg.factorLegend); 
              })
              .attr("y", function(d, i) { 
                return d.yOffset + getVerticalPosition(i, cfg.h/2, cfg.factorLegend); 
              });
          }
        }

        // content
        data.forEach(function(d) {
          d.axes.forEach(function(axis, i) {
            axis.x = getHorizontalPosition(i, cfg.w/2, (parseFloat(Math.max(axis.value, 0))/maxValue)*cfg.factor);
            axis.y = getVerticalPosition(i, cfg.h/2, (parseFloat(Math.max(axis.value, 0))/maxValue)*cfg.factor);
          });
        });
        var polygon = container.selectAll(".area")
            .data(data, cfg.axisJoin);

        polygon.enter()
          .append("polygon")
          .classed({area: 1, "d3-enter": 1});

        polygon.exit()
          .classed("d3-exit", 1) // trigger css transition
          .transition()
            .duration(cfg.transitionDuration)
            .remove();
  
        polygon
          .each(function(d, i) {
            var classed = {"d3-exit": 0}; // if exiting element is being reused
            classed["radar-chart-serie" + i] = 1;
            classed["legend"];
            if (d.className) {
              classed[d.className] = 1;
            }
            d3.select(this)
              .classed(classed);
          })
          // styles should only be transitioned with css
          .style("stroke", function(d, i) {
            if (d.axes[0].type === "Scale") return "grey";
            return App.RadarChart.defaultConfig.color || cfg.coloring(i);
          })
          .style("stroke", function(d, i) {
            if (d.axes[0].type === "Scale") return "grey";
            return App.RadarChart.defaultConfig.color || cfg.coloring(i);
          }) 
          .style("fill", "none")
          .transition()
            .duration(cfg.transitionDuration)
            // svg attrs with js
            .attr("points",function(d) {
              return d.axes.map(function(p) {
                return [p.x, p.y].join(",");
              }).join(" ");
            })
            .each("start", function() {
              d3.select(this)
                .classed("d3-enter", 0); // trigger css transition
            });

        if (cfg.circles && cfg.radius) {
          //Gets the data that is actually from the user
          var nonStandardData = data.filter(function(obj) {
            var standardMax = App.RadarChart.defaultConfig.maxValue;
            return obj.axes[0].value !== standardMax && obj.axes[0].value !== (standardMax/100) 
            && obj.axes[0].value !== (standardMax/2);
          });
          var circleGroups = container.selectAll("g.circle-group")
              .data(nonStandardData, cfg.axisJoin);

          circleGroups.enter()
            .append("g")
            .classed({"circle-group": 1, "d3-enter": 1})
            .attr("class", "legend");

          circleGroups.exit()
            .classed("d3-exit", 1) // trigger css transition
            .transition()
              .duration(cfg.transitionDuration)
              .remove();
          
          circleGroups
            .each(function(d) {
              var classed = {"d3-exit": 0}; // if exiting element is being reused
              if (d.className) {
                classed[d.className] = 1;
              }
              d3.select(this)
                .classed(classed);
            })
            .transition()
              .duration(cfg.transitionDuration)
              .each("start", function() {
                d3.select(this)
                .classed("d3-enter", 0); // trigger css transition
              });
              
          var circle = circleGroups.selectAll(".circle")
              .data(function(datum, i) {
              return datum.axes.map(function(d) { 
                return [d, i]; 
              });
          });

          var testCircle = circle.enter()
              .append("circle")
              .classed({circle: 1, "d3-enter": 1});
          
          circle.exit()
            .classed("d3-exit", 1) // trigger css transition
            .transition()
              .duration(cfg.transitionDuration).remove();

          circle
            .each(function(d) {
              var classed = {"d3-exit": 0}; // if exit element reused
              classed["radar-chart-serie"+d[1]] = 1;
              d3.select(this).classed(classed);
            })
            .style("fill", function(d) { 
              return App.RadarChart.defaultConfig.color || cfg.coloring(i);
            })
            .transition()
              .duration(cfg.transitionDuration)
              // svg attrs with js
              .attr("r", cfg.radius)
              .attr("cx", function(d) {
                return d[0].x;
              })
              .attr("cy", function(d) {
                return d[0].y;
              })
              .each("start", function() {
                d3.select(this)
                  .classed("d3-enter", 0); // trigger css transition
              });
      }
      //Circles is done at this point
      container.append("svg:text")
        .attr("class", "title")
        .attr("x", 20)
        .attr("y", 30)
        .text("Your Personality")
          .style("font-size", "20px")
          .style("font-weight", "bold")
          .style("fill", "royalblue");

      container.append("rect")
        .attr("class", "legend")
        .attr("x", 0)
        .attr("y", 430)
        .attr("stroke", "black")
        .attr("stroke-width", 3)
        .attr("width", 545)
        .attr("height", 30)
        .attr("fill", "white");

      container.append("text")
        .data(nonStandardData)
        .text(function(d) {
          var textArr = d.axes.map(function(obj) {
            return obj.axis + ": " + Math.round(obj.value*100) + "%";
          })
          return textArr.join(" | ");
        })
        .attr("x", 10)
        .attr("y", 450)
        .style("fill", "royalblue")
        .style("font-size", "11px");

      });
    }
    //TODO: Can you clean it up?
    radar.config = function(value) {
      if (!arguments.length) {
        return cfg;
      }
      if (arguments.length > 1) {
        cfg[arguments[0]] = arguments[1];
      }
       else {
        d3.entries(value || {}).forEach(function(option) {
          cfg[option.key] = option.value;
        });
      }
      return radar;
    };

    return radar;
  },
  draw: function(id, d, circleBoolean, color, maxVal) {
    App.RadarChart.defaultConfig.maxValue = maxVal;
    App.RadarChart.defaultConfig.circles = circleBoolean;
    App.RadarChart.defaultConfig.color = color;

    var chart = App.RadarChart.chart().config(this.defaultConfig);
    
    var cfg = chart.config();

    d3.select(id)
      .select("svg")
      .remove();

    d3.select(id)
      .append("svg")
      .attr("width", cfg.w + 100)
      .attr("height", cfg.h + 50)
      .datum(d)
      .call(chart);
  }
};