"use strict";


/**
 *
 * @param plot
 * @param plotProp
 * @param scales
 * @returns {*}
 */
function addTriangleSymbol(plot, plotProp, scales, toolTip, transitionTimes) {

    var symbolType = 'triangle-up';
    var symbol = d3.svg.symbol().type(symbolType);

    plot = plot.enter().append("path")
        .attr("class", plotProp.plotClassName)
        .attr("d", d3.svg.symbol().type("triangle-up"))
        .attr("d", symbol.size(plotProp.size))
        .attr("x", function (d) {
            return (scales.xScale(d[plotProp.xProp]) - (plotProp.width / 2));
        })
        .attr("transform", function (d) {
            return "translate(" + scales.xScale(d[plotProp.xProp]) + "," + scales.yScale(d[plotProp.yProp]) + ")";
        });

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

        var currentFillColor = d3.select(this).style("fill");
        var hoverFillColor   = d3.rgb(currentFillColor).darker();

        var hoverSize      = plotProp.size * transitionTimes.sizeFactor;

        toolTip.show(d, d3.event.pageX, d3.event.pageY, plotProp.xProp);

        d3.select(this).transition()
            .delay(transitionProperties.hoverDelayTime)
            .duration(transitionProperties.hoverTransitionDuration)
            .style("stroke", plotProp.strokeColor)
            .style("fill", hoverFillColor)
            .attr('d', symbol.size(hoverSize))
            .ease(transitionProperties.hoverEaseType);

    })
        .on("mouseout", function (d) {
            var symbol = d3.svg.symbol().type('triangle-up');

            toolTip.hide();
            d3.select(this).transition()
                .delay(transitionProperties.hoverDelayTime)
                .duration(transitionProperties.hoverTransitionDuration)
                .style("stroke", plotProp.strokeColor)
                .style("fill", plotProp.fillColor)
                .attr("d", symbol.size(plotProp.size))
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
function updateTriangleSymbols(svg, plotProp, scales, data, transitionProperties) {
    "use strict";
    // Update

    svg.transition()  // Transition from old to new
        .duration(transitionProperties.startDurationTime)  // Length of animation
        .each("start", function (d) {  // Start animation

            var symbolType = 'triangle-up';
            var symbol = d3.svg.symbol().type(symbolType);
            var transitionSize = plotProp.size * transitionProperties.sizeFactor;

            var currentFillColor = d3.select(this).style("fill");
            var transitionColor  = d3.rgb(currentFillColor).brighter();

            d3.select(this)  // 'this' means the current element
                .style("fill", transitionColor)  // Change color
                .attr("d", symbol.size(transitionSize));

        })
        .delay(function (d, i) {
            return i / data.length * transitionProperties.delayAdjustment;  // Dynamic delay (i.e. each item delays a little longer)
        })
        .ease(transitionTimes.easeType)  // Transition easing - default 'variable' (i.e. has acceleration), also: 'circle', 'elastic', 'bounce', 'linear'

        .attr("x", function (d) {
            return (scales.xScale(d[plotProp.xProp]) - (plotProp.width / 2));
        })
        .attr("transform", function (d) {
            return "translate(" + scales.xScale(d[plotProp.xProp]) + "," + scales.yScale(d[plotProp.yProp]) + ")";
        })
        .each("end", function () {  // End animation
            d3.select(this)  // 'this' means the current element
                .transition()
                .duration(transitionProperties.endDurationTime)
                .style("fill", plotProp.fillColor)  // Change color
                .attr("d", symbol.size(plotProp.size))
        });

    return svg;
};


function zoomTriangleSymbol(plot, plotProp, scales) {

    plot.selectAll('path.' + plotProp.plotClassName).attr("x", function (d) {
        return (scales.xScale(d[plotProp.xProp]) - (plotProp.width / 2));
    })
        .attr("transform", function (d) {
            return "translate(" + scales.xScale(d[plotProp.xProp]) + "," + scales.yScale(d[plotProp.yProp]) + ")";
        });


};