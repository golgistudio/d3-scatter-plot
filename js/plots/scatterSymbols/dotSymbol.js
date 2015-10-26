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


    var hoverSize = plotProp.display.radius * transitionProperties.sizeFactor;


    plot = plot.enter().append("circle")
        .attr("class", plotProp.plotClassName)
        .attr("r", plotProp.display.radius)
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
        .style("stroke", plotProp.display.strokeColor)
        .style("fill", function (d) {
            return plotProp.display.fillColor;
        });

    plot.on("mouseover", function (d) {
            handleHoverStart(d, this);
        })
        .on("mouseout", function (d) {
            handleHoverEnd(d, this);
        })
        .on("touchstart", function (d){
            handleHoverStart(d, this);
        })
        .on("touchend", function (d) {
            handleHoverEnd(d, this);
        });
    
    return plot;

    function handleHoverStart (d, that) {

        var currentFillColor = d3.select(that).style("fill");
        var hoverFillColor = d3.rgb(currentFillColor).darker();

        toolTip.show(d, d3.event.pageX, d3.event.pageY, plotProp.xProp, plotProp.yProp);

        d3.select(that).transition()
            .delay(transitionProperties.hoverDelayTime)
            .duration(transitionProperties.hoverTransitionDuration)
            .style("stroke", hoverFillColor)
            .style("fill", hoverFillColor)
            .attr("r", hoverSize)
            .ease("elastic");

    };

    function handleHoverEnd(d, that) {

        toolTip.hide();

        d3.select(that).transition()
            .delay(transitionProperties.hoverDelayTime)
            .duration(transitionProperties.hoverTransitionDuration)
            .style("stroke", plotProp.display.strokeColor)
            .style("fill", plotProp.display.fillColor)
            .attr("r", plotProp.display.radius)
            .ease(transitionProperties.hoverEaseType);

    };

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
function updateDotSymbols( svg, plotProp, scales, data, transitionProperties) {

    var transitionSize  = plotProp.display.radius * transitionProperties.sizeFactor;

    svg.transition()  // Transition from old to new
        .duration(transitionProperties.startDurationTime)  // Length of animation
        .each("start", function () {  // Start animation

            var currentFillColor = d3.select(this).style("fill");
            var transitionColor = d3.rgb(currentFillColor).brighter();

            d3.select(this)  // 'this' means the current element
                .style("fill", transitionColor)  // Change color
                .style("stroke", transitionColor)
                .attr("r", transitionSize);  // Change size
        })
        .delay(function (d, i) {
            return i / data.length * transitionProperties.delayAdjustment;  // Dynamic delay (i.e. each item delays a little longer)
        })
        .ease(transitionProperties.easeType)  // Transition easing - default 'variable' (i.e. has acceleration), also: 'circle', 'elastic', 'bounce', 'linear'
        .attr("cx", function (d) {
            return scales.xScale(d[plotProp.xProp]);
        })
        .attr("cy", function (d) {
            return scales.yScale(d[plotProp.yProp]);
        })
        .each("end", function () {  // End animation
            d3.select(this)  // 'this' means the current element
                .transition()
                .duration(transitionProperties.endDurationTime)
                .style("fill", plotProp.display.fillColor)  // Change color
                .style("stroke", plotProp.display.strokeColor)
                .attr("r", plotProp.display.radius);  // Change radius
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

