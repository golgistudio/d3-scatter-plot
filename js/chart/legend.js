// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Legend
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// http://bl.ocks.org/ZJONSSON/3918369

/**
 *
 * @param svg
 * @param width
 * @param height
 * @param properties
 */
function drawLegend(svg, width, height, properties) {
    "use strict";

    // Legend
    var color = d3.scale.ordinal()
        .range(properties.colorArray);

    var legend = svg.selectAll("." + properties.legendClassName)
        .data([true])
        .enter().append("g")
        .attr("class", properties.legendClassName)
        .attr("x", properties.x)
        .attr("y", properties.y)
        .attr("width", properties.width)
        .attr("height", properties.height)
        .style("fill", "white")
        .attr("transform", function(d, i) {
            return "translate(0," + i * 20 + ")";
        });

    legend.append("rect")
        .attr("class", properties.boxClassName)
        .attr("x", properties.boxX)
        .attr("y", properties.boxY)
        .attr("width", properties.boxWidth)
        .attr("height", properties.boxHeight);

    var legendCollection = legend.selectAll("." + properties.itemClassName)
        .data([true])
        .enter().append("g")
        .attr("class", properties.itemClassName);

    legendCollection.selectAll("text")
        .data(properties.domainNames, function(d, i) {
            return d ;
        })
        .call(function(d) {
            d.enter().append("text");
        })
        .call(function(d) {
            d.exit().remove();
        })
        .attr("y", function(d, i) {
            return "" + (2 + i + (i * 0.5)) + "em";
        })
        .attr("x", "4em")
        .attr("class", properties.textClassName)
        .text(function(d, i) {
            return properties.domainNames[i];
        });

    legendCollection.selectAll("triangle")
        .data([ {"stroop": "Incongruent", "active": true}], function(d) {
            return d;
        })
        .call(function(d) {
            d.enter().append("path");
        })
        .call(function(d) {
            d.exit().remove();
        })
        .attr("d", d3.svg.symbol().type("triangle-up"))
        .attr("width", 8)
        .attr("height", 8)
        .attr("x", "50em")
        .attr("y", function(d, i) {
            return "" + (3) + "em";
        })
        .attr("transform", function(d) {
            return "translate(" + 30 + "," + 15 + ")";
        })
        .style("fill", function(d, i) {
            return properties.colorArray[1];
        })
        .on("click", function(d) {
            // Determine if current line is visible
            var active = d.active ? false : true;
            var opacity = "0";
            if (active) {
                opacity = "1";
            }

            // Hide or show the elements based on the ID
            d3.selectAll(".dot")
                .transition().duration(100)
                .style("opacity", opacity);
            // Update whether or not the elements are active
            d.active = active;
        });

    legendCollection.selectAll("circle")
        .data([ {"stroop": "Congruent", "active": true}], function(d) {
            return d;
        })
        .call(function(d) {
            d.enter().append("circle");
        })
        .call(function(d) {
            d.exit().remove();
        })
        .attr("cy", function(d, i) {
            return (3.0) + "em";
        })
        .attr("cx", "3em")
        .attr("r", 5)
        .style("fill", function(d, i) {
            return properties.colorArray[0];
        }) .on("click", function(d) {
            // Determine if current line is visible
            var active = d.active ? false : true;

            var opacity = "0";
            if (active) {
                opacity = "1";
            }

            // Hide or show the elements based on the ID
            d3.selectAll(".cdot")
                .transition().duration(100)
                .style("opacity", opacity);

            // Update whether or not the elements are active
            d.active = active;
        });

    legendCollection.selectAll("rect")
        .data([{"stroop": "Difference", "active": true}], function(d) {
            return d;
        })
        .call(function(d) {
            d.enter().append("rect");
        })
        .call(function(d) {
            d.exit().remove();
        })
        .attr("y", function(d, i) {
            return 4.25 + "em";
        })
        .attr("x", "2.6em")
        .attr("width", 8)
        .attr("height", 8)
        .style("fill", function(d, i) {
            return properties.colorArray[2]
        })
        .on("click", function(d) {
            // Determine if current line is visible
            var active = d.active ? false : true;

            var opacity = "0";
            if (active) {
                opacity = "1";
            }

            // Update whether or not the elements are active
            d.active = active;

            // Hide or show the elements based on the ID
            d3.selectAll(".font-awe")
                .transition().duration(100)
                .style("opacity", opacity);

            // Update whether or not the elements are active
            d.active = active;
        });


    //http://bl.ocks.org/d3noob/e99a762017060ce81c76
   // svg.append("text")
    //    .attr("x", (legendSpace/2)+i*legendSpace)  // space legend
      //  .attr("y", height + (margin.bottom/2)+ 5)
       // .attr("class", "legend")    // style the legend
      //  .style("fill", function() { // Add the colours dynamically
      //      return d.color = color(d.key); })
      //  .on("click", function(){
      //      // Determine if current line is visible
      //      var active   = d.active ? false : true,
      //          newOpacity = active ? 0 : 1;
            // Hide or show the elements based on the ID
      //      d3.select("#tag"+d.key.replace(/\s+/g, ''))
       //         .transition().duration(100)
        //        .style("opacity", newOpacity);
            // Update whether or not the elements are active
         //   d.active = active;
        //})
        //.text(d.key);

};
