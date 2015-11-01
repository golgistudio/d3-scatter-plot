// Using Scales with a scatterplot, adding X and Y axes
var w = 600,
    h = 400,
    padding = 30;
var dataset = [
                [5, 20], [480, 90], [250, 50], [100, 33], [330, 95],
                [410, 12], [475, 44], [25, 67], [85, 21], [220, 88], [600, 150]
              ];
// data scales
var xScale = d3.scale.linear()
                     .domain([0, d3.max(dataset, function(d) { return d[0]; })])
                     .range([padding, w - padding * 4]);
var yScale = d3.scale.linear()
                     .domain([0, d3.max(dataset, function(d) { return d[1]; })])
                     .range([h - padding, padding]); //reverse so looks like normal plot
// radius scale
var rScale = d3.scale.linear()
                     .domain([0, d3.max(dataset, function(d) { return d[1]; })])
                     .range([2, 5]);

// container
var svgContainer = d3.select("body").append("svg")
  .attr("width",w)
  .attr("height",h);

// data points
var circles = svgContainer.selectAll("circle")
  .data(dataset)
  .enter()
  .append("circle");

var circleAttributes = circles
  .attr("cx", function(d) {
      return xScale(d[0]);
  })
  .attr("cy", function(d) {
      return yScale(d[1]);
  })
  .attr("r", function(d) {
      return rScale(d[1]);
  })
  .style("fill", function(d) {
    var returnColor;
    if (d===30){returnColor = "green";}
    else if (d===70){returnColor = "purple";}
    else if (d===110){returnColor = "red";}
    return returnColor;
  });

// labels
var labels = svgContainer.selectAll("text")
  .data(dataset)
  .enter()
  .append("text");

var textAttributes = labels
  .attr("x", function(d) {
      return xScale(d[0]);
  })
  .attr("y", function(d) {
      return yScale(d[1]);
  })
  .text(function(d){
    return d[0] + "," + d[1];
  });

// axes
var xAxis = d3.svg.axis()
                  .scale(xScale)
                  .orient("bottom")
                  .ticks(5);  //Set rough # of ticks
//Define Y axis
var yAxis = d3.svg.axis()
                  .scale(yScale)
                  .orient("left")
                  .ticks(5);

svgContainer.append("g")
    .attr("class", "axis")  //Assign "axis" class
    .attr("transform", "translate(0," + (h - padding) + ")") //Put at the bottom
    .call(xAxis);
svgContainer.append("g")
    .attr("class", "axis")  //Assign "axis" class
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis);
