// example with data updating - http://bl.ocks.org/WilliamQLiu/bd12f73d0b79d70bfbae
//http://jsfiddle.net/zhFbn/



/**
 *
 * @param plot
 * @param plotProp
 * @param scales
 * @returns {*}
 */
function addIconSymbol(plot, plotProp, scales, toolTip, transitionTimes) {

    var enterColor = 'green';
    var hoverSize = plotProp.radius * 2;
    var hoverDelayAmount = 0;
    var hoverTransitionDuration = 1000;

    var iconPlot = plot.append("image")
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
        var hoverFillColor = d3.rgb(currentFillColor).brighter();
        var hoverWidth = plotProp.width * 1.5;
        var hoverHeight = plotProp.height  * 1.5;

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
                .style("stroke", plotProp.strokeColor)
                .style("fill", plotProp.fillColor)
                .attr("width", plotProp.width)
                .attr("height", plotProp.height);

        });

    return plot;
};

function updateIconPlot( svg, plotProp, scales, dataset, transitionTimes) {


    // Update circles
    svg.selectAll("circle")
        .data(dataset)  // Update with new data
        .transition()  // Transition from old to new
        .duration(transitionTimes.startDurationTime)  // Length of animation
        .each("start", function() {  // Start animation
            d3.select(this)  // 'this' means the current element
                .attr("fill", "red")  // Change color
                .attr("r", 5);  // Change size
        })
        .delay(function(d, i) {
            return i / dataset.length * transitionTimes.delayAdjustment;  // Dynamic delay (i.e. each item delays a little longer)
        })
        //.ease("linear")  // Transition easing - default 'variable' (i.e. has acceleration), also: 'circle', 'elastic', 'bounce', 'linear'
        .attr("cx", function(d) {
            return scales.xScale(d[plotProp.xProp]);  // Circle's X
        })
        .attr("cy", function(d) {
            return scales.yScale(d[plotProp.yProp]);  // Circle's Y
        })
        .each("end", function() {  // End animation
            d3.select(this)  // 'this' means the current element
                .transition()
                .duration(transitionTimes.exitDurationtime)
                .attr("fill", "black")  // Change color
                .attr("r", 2);  // Change radius
        });
}

