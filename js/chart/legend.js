// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Legend
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


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

    var legendData = [
        {
            "name" : "Congruent",
            "plotClassName" : "congruent",
            "color" : "blue"
        },
        {
            "name" : "Incongruent",
            "plotClassName" : "incongruent",
            "color" : "orange"
        },
        {
            "name" : "Difference",
            "plotClassName" : "difference",
            "color" : "green"
        }
    ];


    //legendCollection.selectAll("text")
    //    .data(legendData, function(d, i) {
    //        var item = [];
    //        item.name = d.name;
    //        item.plotClassName = d.plotClassName;
    //        item.color = d.color;
    //        return item;
    //    })
    //    .call(function(d) {
    //        d.enter().append("text");
    //    })
    //    .call(function(d) {
    //        d.exit().remove();
    //    })
    //    .attr("y", function(d, i) {
    //        return "" + (1.75 + i + (i * 0.75)) + "em";
    //    })
    //    .attr("x", "4em")
    //    .attr("class", properties.textClassName)
    //    .text(function(d, i) {
    //        return d.name;
    //    });


    legendCollection.selectAll("text")
        .data(legendData)
        .enter()
        .append("text")
        .attr("y", function(d, i) {
            return "" + (2 + i + (i * 0.75)) + "em";
        })
        .attr("x", "4em")
        .attr("class", properties.textClassName)
        .text(function(d, i) {
            return d.name;
        })
        .on("click", function(d) {
            // Determine if current line is visible
            var active = d.active ? false : true;
            var opacity = "0";
            if (active) {
                opacity = "1";
            }

            // Hide or show the elements based on the ID
            d3.selectAll("." + d.plotClassName)
                .transition().duration(100)
                .style("opacity", opacity);
            // Update whether or not the elements are active
            d.active = active;
        });;


    legendCollection.selectAll("path")
        .data(legendData)
        .enter()
        .append("path")
        .attr("d", d3.svg.symbol().type("diamond"))
        .attr("class", ".legend_symbol")
        .attr("width", 8)
        .attr("height", 8)
        .attr("x", "50em")
        .attr("y", function(d, i) {
            return "" + (3) + "em";
        })
        .attr("transform", function(d, i) {
            var yVal = 18 * i + 15;
            return "translate(" + 30 + "," + yVal + ")";
        })
        .style("fill", function(d, i) {
            return d.color;
        })
        .on("click", function(d) {
            // Determine if current line is visible
            var active = d.active ? false : true;
            var opacity = "0";
            if (active) {
                opacity = "1";
            }

            // Hide or show the elements based on the ID
            d3.selectAll("." + d.plotClassName)
                .transition().duration(100)
                .style("opacity", opacity);
            // Update whether or not the elements are active
            d.active = active;
        });
};
