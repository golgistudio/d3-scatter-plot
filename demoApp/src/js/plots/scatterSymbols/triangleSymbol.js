"use strict";


/**
 *
 * @param plot
 * @param plotProp
 * @param scales
 * @returns {*}
 */
function addTriangleSymbol(plot, plotProp, scales, toolTip, transitionProperties) {

    var symbolType = 'triangle-up';
    var symbol     = d3.svg.symbol().type(symbolType);

    plot = plot.enter().append("path")
        .attr("class", plotProp.plotClassName)
        .attr("d", d3.svg.symbol().type("triangle-up"))
        .attr("d", symbol.size(plotProp.display.size))
        .attr("x", function (d) {
            return (scales.xScale(d[plotProp.xProp]) - (plotProp.display.width / 2));
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

    function handleHoverStart(d, that) {
        var currentFillColor = d3.select(that).style("fill");
        var hoverFillColor   = d3.rgb(currentFillColor).darker();

        var hoverSize = plotProp.display.size * transitionTimes.sizeFactor;

        toolTip.show(d, d3.event.pageX, d3.event.pageY, plotProp.xProp, plotProp.yProp);

        d3.select(that).transition()
            .delay(transitionProperties.hoverDelayTime)
            .duration(transitionProperties.hoverTransitionDuration)
            .style("stroke", plotProp.display.strokeColor)
            .style("fill", hoverFillColor)
            .attr('d', symbol.size(hoverSize))
            .ease(transitionProperties.hoverEaseType);
    }

    function handleHoverEnd(d, that) {
        var symbol = d3.svg.symbol().type('triangle-up');

        toolTip.hide();
        d3.select(that).transition()
            .delay(transitionProperties.hoverDelayTime)
            .duration(transitionProperties.hoverTransitionDuration)
            .style("stroke", plotProp.display.strokeColor)
            .style("fill", plotProp.display.fillColor)
            .attr("d", symbol.size(plotProp.display.size))
            .ease(transitionProperties.hoverEaseType);
    }
}


/**
 *
 * @param svg
 * @param plotProp
 * @param scales
 * @param data
 * @param transitionProperties
 * @returns {*}
 */
function updateTriangleSymbols(svg, plotProp, scales, data, transitionProperties) {

    // Update

    svg.transition()  // Transition from old to new
        .duration(transitionProperties.startDurationTime)  // Length of animation
        .each("start", function (d) {  // Start animation

            var symbolType     = 'triangle-up';
            var symbol         = d3.svg.symbol().type(symbolType);
            var transitionSize = plotProp.display.size * transitionProperties.sizeFactor;

            var currentFillColor = d3.select(this).style("fill");
            var transitionColor  = d3.rgb(currentFillColor).brighter();

            d3.select(this)  // 'this' means the current element
                .style("fill", transitionColor)  // Change color
                .attr("d", symbol.size(transitionSize));

        })
        .delay(function (d, i) {
            return i / data.length * transitionProperties.delayAdjustment;  // Dynamic delay (i.e. each item delays a little longer)
        })
        .ease(transitionProperties.easeType)  // Transition easing - default 'variable' (i.e. has acceleration), also: 'circle', 'elastic', 'bounce', 'linear'

        .attr("x", function (d) {
            return (scales.xScale(d[plotProp.xProp]) - (plotProp.display.width / 2));
        })
        .attr("transform", function (d) {
            return "translate(" + scales.xScale(d[plotProp.xProp]) + "," + scales.yScale(d[plotProp.yProp]) + ")";
        })
        .each("end", function () {  // End animation

            var symbolType = 'triangle-up';
            var symbol     = d3.svg.symbol().type(symbolType);

            d3.select(this)  // 'this' means the current element
                .transition()
                .duration(transitionProperties.endDurationTime)
                .style("fill", plotProp.display.fillColor)  // Change color
                .attr("d", symbol.size(plotProp.display.size))
        });

    return svg;
}
function zoomTriangleSymbol(plot, plotProp, scales) {

    plot.selectAll('path.' + plotProp.plotClassName).attr("x", function (d) {
        return (scales.xScale(d[plotProp.xProp]) - (plotProp.display.width / 2));
    })
        .attr("transform", function (d) {
            return "translate(" + scales.xScale(d[plotProp.xProp]) + "," + scales.yScale(d[plotProp.yProp]) + ")";
        });
}