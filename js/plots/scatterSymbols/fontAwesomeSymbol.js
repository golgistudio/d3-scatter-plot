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
        .attr("class", "font-awe")
        .attr('font-size', plotProp.fontSize )
        .text(plotProp.unicode)
        .style("stroke", plotProp.textStroke)
        .style("fill", plotProp.textStroke);

    plot = plot.append("circle")
        .attr("class", plotProp.plotClassName)
        .attr("id", function(d) {
            return plotProp.name +  "-" + Math.round(scales.xScale(d[plotProp.xProp])) + "-" + Math.round(scales.yScale(d[plotProp.yProp]));
        })
        .attr("r", plotProp.radius)
        .attr("cx", function(d) {
            return scales.xScale(d[plotProp.xProp]);
        })
        .attr("cy", function(d) {
            return scales.yScale(d[plotProp.yProp]);
        });

    plot.style("opacity", 1)
        .transition()
        .style('fill', enterColor)
        .style('opacity', 0)
        .transition()
        .duration(transitionTimes.startDurationTime)
        .style("fill", function (d) {
            return plotProp.fillColor;
        });

    plot.on("mouseover", function (d) {

            var currentFillColor = d3.select(this).style("fill");
            var hoverFillColor = d3.rgb(currentFillColor).darker();
            var id = "#text-" +  d3.select(this).attr("id");
            var fontSize = d3.select(id).attr("font-size");
            var fontVal =  fontSize.replace(/\D/g,'') * 2 + "em";

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
            var id = "#text-" +  d3.select(this).attr("id");

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

}

