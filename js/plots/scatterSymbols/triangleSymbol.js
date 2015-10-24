"use strict";




/**
 *
 * @param plot
 * @param plotProp
 * @param scales
 * @returns {*}
 */
function addTriangleSymbol(plot, plotProp, scales, toolTip, transitionTimes) {

    var enterColor = 'green';
    var hoverDelayAmount = 500;
    var hoverTransitionDuration = 1000;

    plot = plot.enter().append("path")
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
        .style("stroke", plotProp.strokeColor)
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
function updateTriangleSymbols( svg, plotProp, scales, data, transitionTimes) {
    "use strict";
    // Update

        svg.transition()  // Transition from old to new
        .duration(transitionTimes.startDurationTime)  // Length of animation
        .each("start", function(d) {  // Start animation

                var currentFillColor = d3.select(this).style("fill");
                var transitionColor = d3.rgb(currentFillColor).darker();
            d3.select(this)  // 'this' means the current element
                .style("fill", transitionColor)  // Change color
                .attr("width", plotProp.width * transitionTimes.sizeFactor)
                .attr("height", plotProp.height * transitionTimes.sizeFactor);
        })
        .delay(function(d, i) {
            return i / data.length * transitionTimes.delayAdjustment;  // Dynamic delay (i.e. each item delays a little longer)
        })
        //.ease(transitionTimes.easeType)  // Transition easing - default 'variable' (i.e. has acceleration), also: 'circle', 'elastic', 'bounce', 'linear'

        .attr("x", function(d) {
            return (scales.xScale(d[plotProp.xProp]) - (plotProp.width / 2));
        })
        .attr("transform", function(d) {
            return "translate(" + scales.xScale(d[plotProp.xProp]) + "," + scales.yScale(d[plotProp.yProp]) + ")";
        })
        .each("end", function() {  // End animation
            d3.select(this)  // 'this' means the current element
                .transition()
                .duration(transitionTimes.endDurationTime)
                .style("fill", plotProp.fillColor)  // Change color
                .attr("width", plotProp.width)
                .attr("height", plotProp.height);
        });

    return svg;
};