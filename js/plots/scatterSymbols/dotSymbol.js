// example with data updating - http://bl.ocks.org/WilliamQLiu/bd12f73d0b79d70bfbae
//http://jsfiddle.net/zhFbn/

/**
 *
 * @param plot
 * @param plotProp
 * @param scales
 * @returns {*}
 */
function addDotSymbol(plot, plotProp, scales, toolTip, transitionTimes) {
    "use strict";

    var enterColor = 'green';
    var hoverSize = plotProp.radius * 2;
    var hoverDelayAmount = 0;
    var hoverTransitionDuration = 1000;
    var strokeColor = "black";

    plot = plot.append("circle")
        .attr("class", plotProp.plotClassName)
        .attr("r", plotProp.radius)
        .attr("cx", function(d) {
            return scales.xScale(d[plotProp.xProp]);
        })
        .attr("cy", function(d) {
            return scales.yScale(d[plotProp.yProp]);
        })

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
            toolTip.show(d, d3.event.pageX, d3.event.pageY, plotProp.xProp);

            var currentFillColor = d3.select(this).style("fill");
            var hoverFillColor = d3.rgb(currentFillColor).darker();

            d3.select(this).transition()
                .delay(hoverDelayAmount)
                .duration(hoverTransitionDuration)
                .style("stroke", hoverFillColor)
                .style("fill", hoverFillColor)
                .attr("r", hoverSize)
                .ease("elastic");

        })
        .on("mouseout", function (d) {
            toolTip.hide();
            d3.select(this).transition()
                .delay(hoverDelayAmount)
                .duration(hoverTransitionDuration)
                .style("stroke", strokeColor)
                .style("fill", plotProp.fillColor)
                .attr("r", plotProp.radius);

        });
    
    return plot;

};

/**
 * Points have changed values
 *
 * @param svg
 * @param plotProp
 * @param scales
 * @param dataset
 * @param transitionTimes
 */
function updateDotPlot( svg, plotProp, scales, dataset, transitionTimes) {

    var transitionSize = plotProp * 2;
    var transitionColor = "black";

    // udpate
    return svg.transition()
        .duration(transitionTimes.startDurationTime)
        .attr({
            "cx": function(d) { return scales.xScale(d[plotProp.xProp]); },
            "cy": function(d) { return scales.yScale(d[plotProp.yProp]); },
            "r": function(d) { return plotProp.radius; }
        })
        .each("start", function() {  // Start animation
            d3.select(this)  // 'this' means the current element
                .attr("fill", transitionSize)  // Change color
                .attr("r", transitionSize);  // Change size
        })
        .delay(function(d, i) {
            return i / dataset.length * transitionTimes.delayAdjustment;  // Dynamic delay (i.e. each item delays a little longer)
        })
        .each("end", function() {  // End animation
            d3.select(this)  // 'this' means the current element
                .transition()
                .duration(transitionTimes.exitDurationtime)
                .style("fill", function (d) {
                    return plotProp.fillColor;
                })
                .attr("r", plotProp.radius);  // Change radius
        });

};

