// example with data updating - http://bl.ocks.org/WilliamQLiu/bd12f73d0b79d70bfbae
//http://jsfiddle.net/zhFbn/



/**
 *
 * @param plot
 * @param plotProp
 * @param scales
 * @returns {*}
 */
function addIconSymbol(plot, plotProp, scales, toolTip, transitionProperties) {
    "use strict";

    var hoverSize = plotProp.radius * transitionProperties.sizeFactor;


    var iconPlot = plot.enter().append("image")

        .attr("class", plotProp.plotClassName)
        .attr("xlink:href", plotProp.icon)
        .attr("x", function(d) {
            return (scales.xScale(d[plotProp.xProp]) - (plotProp.width / 2));
        })
        .attr("y", function(d) {
            return scales.yScale(d[plotProp.yProp]);
        })
        .attr("width", plotProp.width)
        .attr("height", plotProp.height);


    iconPlot.on("mouseover", function (d) {

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

function updateIconSymbols( svg, plotProp, scales, data, transitionProperties) {

    "use strict";
    svg.transition()  // Transition from old to new
        .duration(transitionProperties.startDurationTime)  // Length of animation
        .each("start", function() {  // Start animation
            d3.select(this)  // 'this' means the current element
                .attr("width", plotProp.width * transitionTimes.sizeFactor)
                .attr("height", plotProp.height * transitionTimes.sizeFactor);
        })
        .delay(function(d, i) {
            return i / data.length * transitionProperties.delayAdjustment;  // Dynamic delay (i.e. each item delays a little longer)
        })
        .ease(transitionProperties.easeType)  // Transition easing - default 'variable' (i.e. has acceleration), also: 'circle', 'elastic', 'bounce', 'linear'
        .attr("x", function(d) {
            return (scales.xScale(d[plotProp.xProp]) - (plotProp.width / 2));
        })
        .attr("y", function(d) {
            return scales.yScale(d[plotProp.yProp]);
        })
        .each("end", function() {  // End animation
            d3.select(this)  // 'this' means the current element
                .transition()
                .duration(transitionProperties.endDurationTime)
                .attr("width", plotProp.width)
                .attr("height", plotProp.height);
        });

    return svg;
}

function zoomIconSymbol(plot, plotProp, scales, toolTip, transitionProperties) {

    //plot.selectAll('circle.' + plotProp.plotClassName).attr('cy', function (d) {
    //    return scales.yScale(d[plotProp.yProp]);
    //}).attr('cx', function (d) {
    //    return scales.xScale(d[plotProp.xProp]);
    //});


};

