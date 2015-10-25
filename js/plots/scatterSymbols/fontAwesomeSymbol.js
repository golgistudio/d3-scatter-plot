"use strict";


/**
 *
 * @param plot
 * @param plotProp
 * @param scales
 * @returns {*}
 */
function addFontAwesomeSymbol(plot, plotProp, scales, toolTip, transitionProperties) {

    var textPlot = plot.enter()
        .append("text")
        .attr("class", plotProp.plotClassName)
        .attr("x", function (d) {
            return scales.xScale(d[plotProp.xProp]) - plotProp.display.textOffset;
        })
        .attr("y", function (d) {
            return scales.yScale(d[plotProp.yProp]);
        })
        .attr("id", function (d) {
            return "text-" + plotProp.name + "-" + Math.round(scales.xScale(d[plotProp.xProp])) + "-" + Math.round(scales.yScale(d[plotProp.yProp]));
        })
        .attr("font-family", "FontAwesome")
        .attr('font-size', plotProp.display.fontSize)
        .text(plotProp.display.unicode);

    textPlot.style("opacity", "0")
        .style('opacity', 1e-6)
        .transition()
        .style('fill', transitionProperties.enterColor)
        .style('opacity', 1)
        .transition()
        .duration(transitionProperties.startDurationTime)
        .style("stroke", plotProp.display.strokeColor)
        .style("fill", function (d) {
            return plotProp.display.textFill;
        });

    textPlot.on("mouseover", function (d) {
        handleHoverStart(d, this);
    })
        .on("mouseout", function (d) {
            handleHoverEnd(d, this);
        })
        .on("touchstart", function (d) {
            handleHoverStart(d, this);
        })
        .on("mouseout", function (d) {
            handleHoverEnd(d, this);
        });

    return textPlot;

    function handleHoverStart(d, that) {

        var currentFillColor = d3.select(that).style("fill");
        var hoverFillColor   = d3.rgb(currentFillColor).darker();
        var id               = "#" + d3.select(that).attr("id");
        var fontSize         = d3.select(id).attr("font-size");
        var fontVal          = +fontSize.replace(/em/g, '') * transitionProperties.sizeFactor + "em";

        toolTip.show(d, d3.event.pageX, d3.event.pageY, plotProp.xProp);

        d3.select(id).transition()
            .delay(transitionProperties.hoverDelayTime)
            .duration(transitionProperties.hoverTransitionDuration)
            .style("stroke", plotProp.display.strokeColor)
            .style("fill", hoverFillColor)
            .attr('font-size', fontVal)
            .ease(transitionProperties.hoverEaseType);

    };
    function handleHoverEnd(d, that) {
        toolTip.hide();
        var id = "#" + d3.select(that).attr("id");

        d3.select(id).transition()
            .delay(transitionProperties.hoverDelayTime)
            .duration(transitionProperties.hoverTransitionDuration)
            .style("stroke", plotProp.display.strokeColor)
            .style("fill", plotProp.display.textFill)
            .attr('font-size', plotProp.display.fontSize)
            .ease(transitionProperties.hoverEaseType);
    };

}



/**
 * ToDo: Implement update for FontAwesomeSymbol
 * @param svg
 * @param plotProp
 * @param scales
 * @param data
 * @param transitionTimes
 */
function updateFontAwesomeSymbols( svg, plotProp, scales, data, transitionProperties) {


    svg.transition()  // Transition from old to new
        .duration(transitionProperties.startDurationTime)  // Length of animation
        .each("start", function() {  // Start animation
            var id = "#" + d3.select(this).attr("id");
            var fontSize = d3.select(id).attr("font-size");
            var fontVal =  +fontSize.replace(/\D/g,'') * transitionProperties.sizeFactor + "em";
            var currentFillColor = d3.select(this).style("fill");
            var updateColor = d3.rgb(currentFillColor).brighter();

            d3.select(this)  // 'this' means the current element
                .style("stroke", updateColor)
                .style("fill", updateColor)
                .attr('font-size', fontVal);
        })
        .delay(function(d, i) {
            return i / data.length * transitionProperties.delayAdjustment;  // Dynamic delay (i.e. each item delays a little longer)
        })
        .ease(transitionProperties.easeType)  // Transition easing - default 'variable' (i.e. has acceleration), also: 'circle', 'elastic', 'bounce', 'linear'
        .attr("x", function(d) {
            return scales.xScale(d[plotProp.xProp]) - plotProp.display.textOffset;
        })
        .attr("y", function(d) {
            return scales.yScale(d[plotProp.yProp]);
        })
        .each("end", function() {  // End animation
            d3.select(this)  // 'this' means the current element
                .transition()
                .duration(transitionProperties.endDurationTime)
                .style("stroke", plotProp.display.strokeColor)
                .style("fill", plotProp.display.textFill)
                .attr('font-size', plotProp.display.fontSize );
        });

    return svg;

};

function zoomFontAwesomeSymbol(plot, plotProp, scales) {

    plot.selectAll('text.' + plotProp.plotClassName).attr('y', function (d) {
        return scales.yScale(d[plotProp.yProp]);
    }).attr('x', function (d) {
        return scales.xScale(d[plotProp.xProp]);
    });


};

