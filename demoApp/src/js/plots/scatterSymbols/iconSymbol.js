/**
 * @file
 */

/*global module:false */
/*global require:false */
/*global d3:false */
/*global dataStoreManager:false */
/*global dataStoreNames:false */
/*jshint unused:true */
/*exported addIconSymbol, updateIconSymbols, zoomIconSymbol */

if (typeof require !== 'undefined') {
    var dataStoreNames = require('../../dataStore/dataStoreNames.js');
    var dataStoreManager = require('../../dataStore/dataStoreManager.js');
}

/**
 *
 * @param plot
 * @param plotProp
 * @param scales
 * @param toolTip
 * @param transitionProperties
 * @returns {*}
 */
function addIconSymbol(uuid, plot, parentSVG, plotProp, scales, toolTip, transitionProperties) {
    "use strict";

    /**
     *
     * @param d
     * @param plotProp
     * @param transitionProperties
     * @param parentSVG
     */
    function dropLinesToAxes(uuid, d, plotProp, transitionProperties, parentSVG) {

        var axes = dataStoreManager.getInstance().getData(uuid, dataStoreNames.axesValues);

        var startY = axes.scales.yScale(d[plotProp.yProp]);
        var endY = axes.scales.yScale(0);
        var startX = axes.scales.xScale(d[plotProp.xProp]);
        var endX = 0;

        var lines = [{x1: startX, x2: endX, y1: startY, y2: startY},
            {x1: startX, x2: startX, y1: startY, y2: endY}];

        parentSVG.selectAll("." + transitionProperties.dropLineClassName)
            .data(lines).enter()
            .append("line")
            .attr("class", transitionProperties.dropLineClassName)
            .attr("x1", function(ddd){
                return ddd.x1;
            })
            .attr("x2", function(ddd){
                return ddd.x2;
            })
            .attr("y1", function(ddd){
                return ddd.y1;
            })
            .attr("y2", function(ddd){
                return ddd.y2;
            })
            .style("stroke", transitionProperties.dropLineStrokeColor);
    }

    /**
     *
     * @param d
     * @param that
     */
    function handleHoverStart(d, that ) {


        var currentFillColor = d3.select(that).style("fill");
        var hoverFillColor   = d3.rgb(currentFillColor).darker();

        var hoverWidth  = plotProp.display.width * transitionProperties.sizeFactor;
        var hoverHeight = plotProp.display.height * transitionProperties.sizeFactor;

        toolTip.show(d, d3.event.pageX, d3.event.pageY, plotProp.xProp, plotProp.yProp);

        dropLinesToAxes(uuid, d, plotProp, transitionProperties, parentSVG);

        d3.select(that).transition()
            .delay(transitionProperties.hoverDelayTime)
            .duration(transitionProperties.hoverTransitionDuration)
            .style("stroke", hoverFillColor)
            .style("fill", hoverFillColor)
            .attr("width", hoverWidth)
            .attr("height", hoverHeight)
            .ease(transitionProperties.hoverEaseType);

    }

    /**
     *
     * @param d
     * @param that
     */
    function handleHoverEnd(d, that ) {

        toolTip.hide();
        d3.select(that).transition()
            .delay(transitionProperties.hoverDelayTime)
            .duration(transitionProperties.hoverTransitionDuration)
            .style("stroke", plotProp.display.strokeColor)
            .style("fill", plotProp.display.fillColor)
            .attr("width", plotProp.display.width)
            .attr("height", plotProp.display.height)
            .ease(transitionProperties.hoverEaseType);

        parentSVG.selectAll(".drop-line").data([]).exit().remove();

    }

    var iconPlot = plot.enter().append("image")

        .attr("class", plotProp.plotClassName)
        .attr("xlink:href", plotProp.display.icon)
        .attr("x", function (d) {
            return (scales.xScale(d[plotProp.xProp]) - (plotProp.display.width / 2));
        })
        .attr("y", function (d) {
            return scales.yScale(d[plotProp.yProp]);
        })
        .attr("width", plotProp.display.width)
        .attr("height", plotProp.display.height);

    iconPlot.on("mouseover", function (d) {
        handleHoverStart(d, this );
    })
        .on("mouseout", function (d) {
            handleHoverEnd(d, this );
        })
        .on("touchstart", function (d) {
            handleHoverStart(d, this );
        })
        .on("touchend", function (d) {
            handleHoverEnd(d, this );
        });

    return plot;


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
function updateIconSymbols( svg, plotProp, scales, data, transitionProperties) {
    "use strict";



    svg.transition()  // Transition from old to new
        .duration(transitionProperties.startDurationTime)  // Length of animation
        .each("start", function() {  // Start animation
            d3.select(this)  // 'this' means the current element
                .attr("width", plotProp.display.width * transitionProperties.sizeFactor)
                .attr("height", plotProp.display.height * transitionProperties.sizeFactor);
        })
        .delay(function(d, i) {
            return i / data.length * transitionProperties.delayAdjustment;  // Dynamic delay (i.e. each item delays a little longer)
        })
        .ease(transitionProperties.easeType)  // Transition easing - default 'variable' (i.e. has acceleration), also: 'circle', 'elastic', 'bounce', 'linear'
        .attr("x", function(d) {
            return (scales.xScale(d[plotProp.xProp]) - (plotProp.display.width / 2));
        })
        .attr("y", function(d) {
            return scales.yScale(d[plotProp.yProp]);
        })
        .each("end", function() {  // End animation
            d3.select(this)  // 'this' means the current element
                .transition()
                .duration(transitionProperties.endDurationTime)
                .attr("width", plotProp.display.width)
                .attr("height", plotProp.display.height);
        });

    return svg;
}

/**
 *
 * @param plot
 * @param plotProp
 * @param scales
 */
function zoomIconSymbol(plot, plotProp, scales) {
    "use strict";

    plot.selectAll('image.' + plotProp.plotClassName)
        .attr("x", function(d) {
            return (scales.xScale(d[plotProp.xProp]) - (plotProp.display.width / 2));
        })
        .attr("y", function(d) {
            return scales.yScale(d[plotProp.yProp]);
        });

}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports =  {
        addIconSymbol: addIconSymbol,
        updateIconSymbols: updateIconSymbols,
        zoomIconSymbol: zoomIconSymbol
    };
}

