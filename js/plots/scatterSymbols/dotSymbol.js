"use strict";

/**
 *
 * @param plot
 * @param plotProp
 * @param scales
 * @param toolTip
 * @param transitionProperties
 * @returns {*}
 */
function addDotSymbol(plot, plotProp, scales, toolTip, transitionProperties) {


    var hoverSize = plotProp.radius * transitionProperties.sizeFactor;


    plot = plot.enter().append("circle")
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
        .style('fill', transitionProperties.enterColor)
        .style('opacity', 1)
        .transition()
        .duration(transitionProperties.startDurationTime)
        .style("stroke", plotProp.strokeColor)
        .style("fill", function (d) {
            return plotProp.fillColor;
        });

        plot.on("mouseover", function (d) {
            toolTip.show(d, d3.event.pageX, d3.event.pageY, plotProp.xProp);

            var currentFillColor = d3.select(this).style("fill");
            var hoverFillColor = d3.rgb(currentFillColor).darker();

            d3.select(this).transition()
                .delay(transitionProperties.hoverDelayTime)
                .duration(transitionProperties.hoverTransitionDuration)
                .style("stroke", hoverFillColor)
                .style("fill", hoverFillColor)
                .attr("r", hoverSize)
                .ease("elastic");

        })
        .on("mouseout", function (d) {
            toolTip.hide();
            d3.select(this).transition()
                .delay(transitionProperties.hoverDelayTime)
                .duration(transitionProperties.hoverTransitionDuration)
                .style("stroke", plotProp.strokeColor)
                .style("fill", plotProp.fillColor)
                .attr("r", plotProp.radius)
                .ease(transitionProperties.hoverEaseType);

        });
    
    return plot;

}

/**
 * Points have changed values
 *
 * @param svg
 * @param plotProp
 * @param scales
 * @param data
 * @param transitionTimes
 */
function updateDotSymbols( svg, plotProp, scales, data, transitionTimes) {
    "use strict";
    var transitionSize  = plotProp.radius * transitionTimes.sizeFactor;

    svg.transition()  // Transition from old to new
        .duration(transitionTimes.startDurationTime)  // Length of animation
        .each("start", function () {  // Start animation

            var currentFillColor = d3.select(this).style("fill");
            var transitionColor = d3.rgb(currentFillColor).brighter();

            d3.select(this)  // 'this' means the current element
                .style("fill", transitionColor)  // Change color
                .style("stroke", transitionColor)
                .attr("r", transitionSize);  // Change size
        })
        .delay(function (d, i) {
            return i / data.length * transitionTimes.delayAdjustment;  // Dynamic delay (i.e. each item delays a little longer)
        })
        .ease(transitionTimes.easeType)  // Transition easing - default 'variable' (i.e. has acceleration), also: 'circle', 'elastic', 'bounce', 'linear'
        .attr("cx", function (d) {
            return scales.xScale(d[plotProp.xProp]);
        })
        .attr("cy", function (d) {
            return scales.yScale(d[plotProp.yProp]);
        })
        .each("end", function () {  // End animation
            d3.select(this)  // 'this' means the current element
                .transition()
                .duration(transitionTimes.endDurationTime)
                .style("fill", plotProp.fillColor)  // Change color
                .style("stroke", plotProp.strokeColor)
                .attr("r", plotProp.radius);  // Change radius
        });


    return svg;

}

function zoomDotSymbol(plot, plotProp, scales) {

        plot.selectAll('circle.' + plotProp.plotClassName).attr('cy', function (d) {
                return scales.yScale(d[plotProp.yProp]);
            }).attr('cx', function (d) {
                return scales.xScale(d[plotProp.xProp]);
        });


}

