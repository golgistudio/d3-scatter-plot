// example with data updating - http://bl.ocks.org/WilliamQLiu/bd12f73d0b79d70bfbae
//http://jsfiddle.net/zhFbn/


/**
 *
 * @param plot
 * @param plotProp
 * @param scales
 * @returns {*}
 */
function addTriangleSymbol(plot, plotProp, scales, toolTip, transitionTimes) {
    "use strict";

    var enterColor = 'green';
    var strokeColor = 'black';
    var hoverDelayAmount = 500;
    var hoverTransitionDuration = 1000;

    plot = plot.append("path")
        .attr("class", plotProp.plotClassName)
        .attr("d", d3.svg.symbol().type("triangle-up"))
        .attr("width", plotProp.width)
        .attr("height", plotProp.height)
        .attr("x", function(d) {
            return (scales.xScale(d[plotProp.xProp]) - (plotProp.width / 2));
        })
        .attr("transform", function(d) {
            return "translate(" + scales.xScale(d[plotProp.xProp]) + "," + scales.yScale(d[plotProp.yProp]) + ")";
        });

    plot.style("opacity", "0")
        .style('opacity', 1e-6)
        .transition()
        .style('fill', enterColor)
        .style('opacity', 1)
        .transition()
        .duration(transitionTimes.startDurationTime)
        .style("fill", function (d) {
            return plotProp.fillColor;
        });


    plot.on("mouseover", function (d) {


        var currentFillColor = d3.select(this).style("fill");
        var hoverFillColor = d3.rgb(currentFillColor).brighter();
        var hoverWidth = plotProp.width * 5;
        var hoverHeight = plotProp.height  * 5;
        var size = d3.select(this).size();
        var hoverSize = size * 3;

        toolTip.show(d, d3.event.pageX, d3.event.pageY, plotProp.xProp);

        d3.select(this).transition()
            .delay(hoverDelayAmount)
            .duration(hoverTransitionDuration)
            .style("stroke", hoverFillColor)
            .style("fill", hoverFillColor)
            .attr("width", hoverWidth)
            .attr("height", hoverHeight)
            .ease("elastic");

        })
        .on("mouseout", function (d) {
            toolTip.hide();
            d3.select(this).transition()
                .delay(hoverDelayAmount)
                .duration(hoverTransitionDuration)
                .style("stroke", strokeColor)
                .style("fill", plotProp.fillColor)
                .attr("width", plotProp.width)
                .attr("height", plotProp.height);

        });


    return plot;


};

/**
 *
 * @param svg
 * @param plotProp
 * @param scales
 * @param dataset
 * @param transitionTimes
 */
function updateTrianglePlot( svg, plotProp, scales, dataset, transitionTimes) {




    // Update circles
    svg.selectAll("path")
        .data(dataset)  // Update with new data
        .transition()  // Transition from old to new
        .duration(transitionTimes.startDurationTime)  // Length of animation
        .each("start", function() {  // Start animation
            d3.select(this)  // 'this' means the current element
                .attr("fill", "red")  // Change color
                .attr("r", 5);  // Change size
        })
        .delay(function(d, i) {
            return i / dataset.length * transitionTimes.delayAdjustment;  // Dynamic delay (i.e. each item delays a little longer)
        })
        .attr("x", function(d) {
            return (scales.xScale(d[plotProp.xProp]) - (plotProp.width / 2));
        })
        .attr("transform", function(d) {
            return "translate(" + scales.xScale(d[plotProp.xProp]) + "," + scales.yScale(d[plotProp.yProp]) + ")";
        })
        .each("end", function() {  // End animation
            d3.select(this)  // 'this' means the current element
                .transition()
                .duration(transitionTimes.exitDurationtime)
                .attr("fill", "black")  // Change color
                .attr("r", 2);  // Change radius
        });
}