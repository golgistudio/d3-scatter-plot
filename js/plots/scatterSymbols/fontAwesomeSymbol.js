// example with data updating - http://bl.ocks.org/WilliamQLiu/bd12f73d0b79d70bfbae
//http://jsfiddle.net/zhFbn/

/**
 *
 * @param plot
 * @param plotProp
 * @param scales
 * @returns {*}
 */
function addFontAwesomeSymbol(plot, plotProp, scales, toolTip, transitionTimes) {
    "use strict";
    var enterColor = 'green';
    var hoverSize = plotProp.radius * 2;
    var hoverDelayAmount = 0;
    var hoverTransitionDuration = 500;

    var textPlot = plot.enter()
        .append("text")
        .attr("class", plotProp.plotClassName)
        .attr("x", function(d) {
            return scales.xScale(d[plotProp.xProp]) - plotProp.textOffset;
        })
        .attr("y", function(d) {
            return scales.yScale(d[plotProp.yProp]);
        })
        .attr("id", function(d) {
            return "text-" + plotProp.name + "-" + Math.round(scales.xScale(d[plotProp.xProp])) + "-" + Math.round(scales.yScale(d[plotProp.yProp]));
        })
        .attr("font-family","FontAwesome")
        .attr('font-size', plotProp.fontSize )
        .text(plotProp.unicode)
        .style("stroke", plotProp.textStroke)
        .style("fill", plotProp.textStroke);


    textPlot.on("mouseover", function (d) {

            var currentFillColor = d3.select(this).style("fill");
            var hoverFillColor = d3.rgb(currentFillColor).darker();
            var id = "#" + d3.select(this).attr("id");
            var fontSize = d3.select(id).attr("font-size");
            var fontVal =  +fontSize.replace(/em/g,'') * transitionTimes.sizeFactor + "em";

            toolTip.show(d, d3.event.pageX, d3.event.pageY, plotProp.xProp);

            d3.select(id).transition()
                .delay(hoverDelayAmount)
                .duration(hoverTransitionDuration)
                .style("stroke", hoverFillColor)
                .style("fill", hoverFillColor)
                .attr('font-size', fontVal);

        })
        .on("mouseout", function (d) {
            toolTip.hide();
            var id = "#" +  d3.select(this).attr("id");

            d3.select(id).transition()
                .delay(hoverDelayAmount)
                .duration(hoverTransitionDuration)
                .style("stroke", "black")
                .style("stroke", plotProp.textStroke)
                .style("fill", plotProp.textStroke)
                .attr('font-size', plotProp.fontSize);
        });
}

/**
 * ToDo: Implement update for FontAwesomeSymbol
 * @param svg
 * @param plotProp
 * @param scales
 * @param data
 * @param transitionTimes
 */
function updateFontAwesomeSymbols( svg, plotProp, scales, data, transitionTimes) {
    "use strict";

    svg.transition()  // Transition from old to new
        .duration(transitionTimes.startDurationTime)  // Length of animation
        .each("start", function() {  // Start animation
            var id = "#" + d3.select(this).attr("id");
            var fontSize = d3.select(id).attr("font-size");
            var fontVal =  +fontSize.replace(/\D/g,'') * transitionTimes.sizeFactor + "em";
            var currentFillColor = d3.select(this).style("fill");
            var updateColor = d3.rgb(currentFillColor).darker();

            d3.select(this)  // 'this' means the current element
                .style("stroke", updateColor)
                .style("fill", updateColor)
                .attr('font-size', fontVal);
        })
        .delay(function(d, i) {
            return i / data.length * transitionTimes.delayAdjustment;  // Dynamic delay (i.e. each item delays a little longer)
        })
        .ease(transitionTimes.easeType)  // Transition easing - default 'variable' (i.e. has acceleration), also: 'circle', 'elastic', 'bounce', 'linear'
        .attr("x", function(d) {
            return scales.xScale(d[plotProp.xProp]) - plotProp.textOffset;
        })
        .attr("y", function(d) {
            return scales.yScale(d[plotProp.yProp]);
        })
        .each("end", function() {  // End animation
            d3.select(this)  // 'this' means the current element
                // .transition()
                // .duration(transitionTimes.exitDurationtime)
                .style("stroke", plotProp.textStroke)
                .style("fill", plotProp.textStroke)
                .attr('font-size', plotProp.fontSize );
        });

    return svg;

}

