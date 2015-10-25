// example with data updating - http://bl.ocks.org/WilliamQLiu/bd12f73d0b79d70bfbae
//http://jsfiddle.net/zhFbn/


/**
 *
 * @param plot
 * @param plotProp
 * @param scales
 * @returns {*}
 */
function addSquareSymbol(plot, plotProp, scales, toolTip, transitionProperties) {
    "use strict";


    plot  = plot.enter().append("rect")
        .attr("class", plotProp.plotClassName)
        .attr("width", plotProp.width)
        .attr("height", plotProp.height)
        .attr("x", function (d) {
            return (scales.xScale(d[plotProp.xProp]) - (plotProp.width / 2));
        })
        .attr("y", function (d) {
            return scales.yScale(d[plotProp.yProp]);
        });

    plot.style("opacity", "0")
        .style('opacity', 1e-6)
        .transition()
        .style('fill', transitionProperties.enterColor)
        .style('opacity', 1)
        .transition()
        .style('stroke', plotProp.strokeColor)
        .duration(transitionProperties.startDurationTime)
        .style("fill", function (d) {
            return plotProp.fillColor;
        });

    plot.on("mouseover", function (d) {

        var currentFillColor = d3.select(this).style("fill");
        var hoverFillColor = d3.rgb(currentFillColor).darker();
        var hoverWidth = plotProp.width * transitionProperties.sizeFactor;
        var hoverHeight = plotProp.height  * transitionProperties.sizeFactor;

        toolTip.show(d, d3.event.pageX, d3.event.pageY, plotProp.xProp);

        d3.select(this).transition()
            .delay(transitionProperties.hoverDelayTime)
            .duration(transitionProperties.hoverTransitionDuration)
            .style("stroke", hoverFillColor)
            .style("fill", hoverFillColor)
            .attr("width", hoverWidth)
            .attr("height", hoverHeight)
            .ease(transitionProperties.hoverEaseType);

        })
        .on("mouseout", function (d) {
            toolTip.hide();
            d3.select(this).transition()
                .delay(transitionProperties.hoverDelayTime)
                .duration(transitionProperties.hoverTransitionDuration)
                .style("stroke", plotProp.strokeColor)
                .style("fill", plotProp.fillColor)
                .attr("width", plotProp.width)
                .attr("height", plotProp.height)
                .ease(transitionProperties.hoverEaseType);

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
function updateSquareSymbols( svg, plotProp, scales, data, transitionProperties) {

    "use strict";
    svg.transition()  // Transition from old to new
        .duration(transitionProperties.startDurationTime)  // Length of animation
        .each("start", function() {  // Start animation
            var currentFillColor = d3.select(this).style("fill");
            var transitionColor = d3.rgb(currentFillColor).brighter();
            d3.select(this)  // 'this' means the current element
                .style("fill", transitionColor)  // Change color
                .attr("width", plotProp.width * transitionProperties.sizeFactor)
                .attr("height", plotProp.height * transitionProperties.sizeFactor);
        })
        .delay(function(d, i) {
            return i / data.length * transitionProperties.delayAdjustment;  // Dynamic delay (i.e. each item delays a little longer)
        })
        .ease(transitionProperties.easeType)  // Transition easing - default 'variable' (i.e. has acceleration), also: 'circle', 'elastic', 'bounce', 'linear'
        .attr("x", function (d) {
            return (scales.xScale(d[plotProp.xProp]) - (plotProp.width / 2));
        })
        .attr("y", function (d) {
            return scales.yScale(d[plotProp.yProp]);
        })
        .each("end", function() {  // End animation
            d3.select(this)  // 'this' means the current element
                .transition()
                .duration(transitionProperties.endDurationTime)
                .style("fill", plotProp.fillColor)  // Change color
                .attr("width", plotProp.width)
                .attr("height", plotProp.height);
        });

    return svg;
}


function zoomSquareSymbol(plot, plotProp, scales) {

    plot.selectAll('rect.' + plotProp.plotClassName).attr('y', function (d) {
        return scales.yScale(d[plotProp.yProp]);
    }).attr('x', function (d) {
        return scales.xScale(d[plotProp.xProp]);
    });


};

