"use strict";

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Scatter Plot
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


/**
 *
 */
function scatterPlot() {

    /**
     *
     * @param request
     * @param parameters
     */
    this.plotInterface = function (request, parameters) {

        switch(request) {
            case "render" : renderPlot(parameters);
                break;
            case "update" : updatePlot(parameters);
                break;

        };

    };

    /**
     *
     * @param parameters
     */
    function renderPlot (parameters) {

        var plot = setData(parameters.svg, parameters.data, parameters.plotProp.plotClassName);

        addSymbols(plot, parameters.plotProp, parameters.scales, parameters.toolTip);

    };

    /**
     *
     * @param svg
     * @param data
     * @param plotClassName
     * @returns {*}
     */
    function setData(svg, data, plotClassName) {
        return svg.selectAll("." + plotClassName)
            .data(data);
    };

    /**
     *
     * @param plot
     * @param plotProp
     * @param scales
     * @param toolTip
     * @returns {*}
     */
    function addSymbols(plot, plotProp, scales, toolTip) {

        var transitionTimes = {
            startDurationTime : 1000,
            delayAdjustment : 500,
            exitDurationtime : 500,
            sizeFactor: 2
        };

        switch (plotProp.symbol) {
            case "triangle":
                plot = addTriangleSymbol(plot, plotProp, scales, toolTip, transitionTimes);
                break;
            case "dot" :
                plot = addDotSymbol(plot, plotProp, scales, toolTip, transitionTimes);
                break;
            case "square":
                plot = addSquareSymbol(plot, plotProp, scales, toolTip, transitionTimes);
                break;
            case "icon":
                plot = addIconSymbol(plot, plotProp, scales, toolTip, transitionTimes) ;
                break;
            case "font":
                plot = addFontAwesomeSymbol(plot, plotProp, scales, toolTip, transitionTimes);
                break;
        }
        return plot;
    };


    /**
     *
     * @param parameters
     */
    function updatePlot(parameters) {

        var transitionTimes = {
            startDurationTime : 1000,
            delayAdjustment : 500,
            endDurationTime : 500,
            sizeFactor: 2,
            easeType: "bounce"
        };

        var plot = setData(parameters.svg, parameters.data, parameters.plotProp.plotClassName);

        updateSymbols(parameters.data, parameters.scales, plot, parameters.plotProp, transitionTimes);
        addSymbols(plot, parameters.plotProp, parameters.scales, parameters.toolTip);
        removeSymbols(plot, parameters.plotProp, parameters.scales, parameters.data, transitionTimes);

    };

    /**
     *
     * @param svg
     * @param plotProp
     * @param scales
     * @param dataset
     * @param transitionTimes
     */
    function removeSymbols( svg, plotProp, scales, dataset, transitionTimes) {

        var exitTransitionColor = "red";

        svg = svg.exit();
        svg.style('fill', exitTransitionColor);
        svg.transition().delay(transitionTimes.endDurationTime).remove();

    };

    /**
     *
     * @param data
     * @param scales
     * @param svg
     * @param plotProp
     * @param transitionTimes
     * @returns {*}
     */

    function updateSymbols(data, scales, svg, plotProp, transitionTimes) {

        var plot = null;

        switch (plotProp.symbol) {
            case "triangle":
                svg = updateTriangleSymbols(svg, plotProp, scales, data, transitionTimes);
                break;
            case "dot" :
                svg = updateDotSymbols(svg, plotProp, scales, data, transitionTimes);
                break;
            case "square":
                svg = updateSquareSymbols(svg, plotProp, scales, data, transitionTimes);
                break;
            case "icon":
                svg = updateIconSymbols(svg, plotProp, scales, data, transitionTimes) ;
                break;
            case "font":
                svg = updateFontAwesomeSymbols(svg, plotProp, scales, data, transitionTimes);
                break;
        }

        return svg;
    };

};




