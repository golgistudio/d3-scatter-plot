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
            case "zoom" : zoomPlot(parameters);
                break;

        };

    };

    /**
     *
     * @param parameters
     */
    function renderPlot (parameters) {

        var plot = setData(parameters.svg, parameters.data, parameters.plotProp.plotClassName);

        addSymbols(plot, parameters.plotProp, parameters.scales, parameters.toolTip, parameters.transitionProperties);

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
    function addSymbols(plot, plotProp, scales, toolTip, transitionProperties) {

        switch (plotProp.symbol) {
            case "triangle":
                plot = addTriangleSymbol(plot, plotProp, scales, toolTip, transitionProperties);
                break;
            case "dot" :
                plot = addDotSymbol(plot, plotProp, scales, toolTip, transitionProperties);
                break;
            case "square":
                plot = addSquareSymbol(plot, plotProp, scales, toolTip, transitionProperties);
                break;
            case "icon":
                plot = addIconSymbol(plot, plotProp, scales, toolTip, transitionProperties) ;
                break;
            case "font":
                plot = addFontAwesomeSymbol(plot, plotProp, scales, toolTip, transitionProperties);
                break;
        }
        return plot;
    };

    function zoomSymbols(plot, plotProp, scales, toolTip, transitionProperties) {

        switch (plotProp.symbol) {
            case "triangle":
                plot = zoomTriangleSymbol(plot, plotProp, scales, toolTip, transitionProperties);
                break;
            case "dot" :
                plot = zoomDotSymbol(plot, plotProp, scales, toolTip, transitionProperties);
                break;
            case "square":
                plot = zoomSquareSymbol(plot, plotProp, scales, toolTip, transitionProperties);
                break;
            case "icon":
                plot = zoomIconSymbol(plot, plotProp, scales, toolTip, transitionProperties) ;
                break;
            case "font":
                plot = zoomFontAwesomeSymbol(plot, plotProp, scales, toolTip, transitionProperties);
                break;
        }
        return plot;
    };

    /**
     *
     * @param parameters
     */
    function zoomPlot(parameters) {
        zoomSymbols(parameters.svg, parameters.plotProp, parameters.scales, parameters.toolTip, parameters.transitionProperties);
    };


    /**
     *
     * @param parameters
     */
    function updatePlot(parameters) {

        var plot = setData(parameters.svg, parameters.data, parameters.plotProp.plotClassName);

        updateSymbols(plot, parameters.data, parameters.scales,  parameters.plotProp, parameters.transitionProperties);
        addSymbols(plot, parameters.plotProp, parameters.scales, parameters.toolTip, parameters.transitionProperties);
        removeSymbols(plot,  parameters.transitionProperties);

    };

    /**
     *
     * @param svg
     * @param plotProp
     * @param scales
     * @param dataset
     * @param transitionTimes
     */
    function removeSymbols( svg,  transitionProperties) {
        svg = svg.exit();
        svg.style('fill', transitionProperties.exitColor);
        svg.transition().delay(transitionProperties.endDurationTime).remove();

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

    function updateSymbols(svg, data, scales, plotProp, transitionProperties) {

        switch (plotProp.symbol) {
            case "triangle":
                svg = updateTriangleSymbols(svg, plotProp, scales, data, transitionProperties);
                break;
            case "dot" :
                svg = updateDotSymbols(svg, plotProp, scales, data, transitionProperties);
                break;
            case "square":
                svg = updateSquareSymbols(svg, plotProp, scales, data, transitionProperties);
                break;
            case "icon":
                svg = updateIconSymbols(svg, plotProp, scales, data, transitionProperties) ;
                break;
            case "font":
                svg = updateFontAwesomeSymbols(svg, plotProp, scales, data, transitionProperties);
                break;
        }

        return svg;
    };

};




