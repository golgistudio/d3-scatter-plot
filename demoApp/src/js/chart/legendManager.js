/**
 * @file
 */


/*global d3:false */

/*global module:false */

/**
 *
 * @param d
 */
function legendItemClickedHandler(d) {

    "use strict";

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
}


/**
 *
 * @param legendCollection
 * @param legendData
 * @param properties
 */
function addLegendItems(legendCollection, legendData, properties) {

    "use strict";
    legendCollection.selectAll("text")
        .data(legendData)
        .enter()
        .append("text")
        .attr("y", function(d, i) {
            return "" + (2 + i + (i * 0.75)) + "em";
        })
        .attr("x", "4em")
        .attr("class", properties.textClassName)
        .text(function(d) {
            return d.name;
        })
        .on("click", function(d) {
            legendItemClickedHandler(d);
        });


    legendCollection.selectAll("path")
        .data(legendData)
        .enter()
        .append("path")
        .attr("d", d3.svg.symbol().type("diamond"))
        .attr("class", properties.legendSymbolClassName)
        .attr("width", properties.symbolWidth)
        .attr("height", properties.symbolHeight)
        .attr("transform", function(d, i) {
            var yVal = 18 * i + 15;
            return "translate(" + 30 + "," + yVal + ")";
        })
        .style("fill", function(d) {
            return d.color;
        })
        .on("click", function(d) {
            legendItemClickedHandler(d);
        })
        .on("mouseover", function (d) {

            var symbol = d3.svg.symbol().type('diamond');
            var currentFillColor = d3.select(this).style("fill");
            var transitionColor = d3.rgb(currentFillColor).darker();
            var hoverSize = d3.select(this).size() * properties.hoverSizeFactor;
            d3.select(this)
                .style("fill", transitionColor)
                .attr('d', symbol.size(hoverSize));
        })
        .on("mouseout", function (d) {
            var symbol = d3.svg.symbol().type('diamond');
            var hoverSize = d3.select(this).size() * properties.sizeFactor;
            d3.select(this)
                .style("fill", d.color)
                .attr('d', symbol.size(hoverSize));
        })
        .on("touchstart", function (d){
            var symbol = d3.svg.symbol().type('diamond');
            var currentFillColor = d3.select(this).style("fill");
            var transitionColor = d3.rgb(currentFillColor).darker();
            var hoverSize = d3.select(this).size() * properties.hoverSizeFactor;
            d3.select(this)
                .style("fill", transitionColor)
                .attr('d', symbol.size(hoverSize));
        })
        .on("touchend", function (d) {
            var symbol = d3.svg.symbol().type('diamond');
            var hoverSize = d3.select(this).size() * properties.sizeFactor;
            d3.select(this)
                .style("fill", d.color)
                .attr('d', symbol.size(hoverSize));
        });
}




/**
 *
 * @param svg
 * @param width
 * @param height
 * @param properties
 * @param legendData
 */
function drawLegend(svg, width, height, properties, legendData) {

    "use strict";

    var count = legendData.length;

    height = count * properties.height;
    var boxHeight = count * properties.boxHeight;

    var legend = svg.selectAll("." + properties.legendClassName)
        .data([true])
        .enter().append("g")
        .attr("class", properties.legendClassName)
        .attr("x", properties.x)
        .attr("y", properties.y)
        .attr("width", properties.width)
        .attr("height", height)
        .style("fill", "white")
        .attr("transform", function(d, i) {
            return "translate(0," + i * properties.offset + ")";
        });

    legend.append("rect")
        .attr("class", properties.boxClassName)
        .attr("x", properties.boxX)
        .attr("y", properties.boxY)
        .attr("width", properties.boxWidth)
        .attr("height", boxHeight);

    var legendCollection = legend.selectAll("." + properties.itemClassName)
        .data([true])
        .enter().append("g")
        .attr("class", properties.itemClassName);

    addLegendItems(legendCollection, legendData, properties);

}

/**
 *
 * @param svg
 * @param properties
 */
function removeLegendItems(svg, properties) {

    "use strict";

   svg.selectAll("." + properties.itemClassName).data([]).exit().remove();
}

/**
 *
 * @param svg
 * @param properties
 * @param legendData
 */
function updateLegend(svg, properties, legendData) {

    "use strict";

    removeLegendItems(svg, properties);

    var legend = svg.selectAll("." + properties.legendClassName);
    var legendCollection = legend.selectAll("." + properties.itemClassName)
        .data([true])
        .enter().append("g")
        .attr("class", properties.itemClassName);

    addLegendItems(legendCollection, legendData, properties);

}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports =  {
        updateLegend: updateLegend,
        removeLegendItems: removeLegendItems,
        drawLegend: drawLegend
    };
}

