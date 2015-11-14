/**
 * @file
 */

/*global addTriangleSymbol:false */
/*global addDotSymbol:false */
/*global addSquareSymbol:false */
/*global addIconSymbol:false */
/*global addFontAwesomeSymbol:false */

/*global zoomTriangleSymbol:false */
/*global zoomDotSymbol:false */
/*global zoomSquareSymbol:false */
/*global zoomIconSymbol:false */
/*global zoomFontAwesomeSymbol:false */

/*global updateTriangleSymbols:false */
/*global updateDotSymbols:false */
/*global updateSquareSymbols:false */
/*global updateIconSymbols:false */
/*global updateFontAwesomeSymbols:false */

/*global module: true */
/*global rquire: false*/

import {TriangleSymbol} from './scatterSymbols/triangleSymbol.js';
import {DotSymbol} from './scatterSymbols/dotSymbol.js';
import {SquareSymbol} from './scatterSymbols/squareSymbol.js';
import {IconSymbol} from './scatterSymbols/iconSymbol.js';
import {FontAwesomeSymbol} from './scatterSymbols/fontAwesomeSymbol.js';


/**
 *
 * @constructor
 */
export function ScatterPlot(symbol) {
    "use strict";


    function getSymbolPlot(symbol) {

        var newSymbol = null;

        switch (symbol) {
            case "triangle":
                newSymbol = new TriangleSymbol();
                break;
            case "dot" :
                newSymbol = new DotSymbol();
                break;
            case "square":
                newSymbol = new SquareSymbol();
                break;
            case "icon":
                newSymbol = new IconSymbol();
                break;
            case "font":
                newSymbol = new FontAwesomeSymbol();
                break;
        }
        return newSymbol;
    }

    var _symbol = getSymbolPlot(symbol);

    /**
     *
     * @param parameters
     */
    function renderPlot (parameters) {

        var plot = setData(parameters.svg, parameters.data, parameters.plotProp.plotClassName);

        addSymbols(parameters.uuid, plot, parameters.svg, parameters.plotProp, parameters.scales, parameters.toolTip, parameters.transitionProperties);
    }

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
    }


    /***
     *
     * @param plot
     * @param plotProp
     * @param scales
     * @param toolTip
     * @param transitionProperties
     * @returns {*}
     */
    function addSymbols(uuid, plot,  parentSVG, plotProp, scales, toolTip, transitionProperties) {

        plot = _symbol.addSymbol(uuid, plot, parentSVG, plotProp, scales, toolTip, transitionProperties);

        return plot;
    }

    /**
     *
     * @param plot
     * @param plotProp
     * @param scales
     * @returns {*}
     */
    function zoomSymbols(plot, plotProp, scales) {

        plot = _symbol.zoomSymbol(plot, plotProp, scales);
        return plot;
    }

    /**
     *
     * @param parameters
     */
    function zoomPlot(parameters) {

        zoomSymbols(parameters.svg, parameters.plotProp, parameters.scales);
    }


    /**
     *
     * @param parameters
     */
    function updatePlot(parameters) {

        var plot = setData(parameters.svg, parameters.data, parameters.plotProp.plotClassName);

        updateSymbols( plot, parameters.data, parameters.scales,  parameters.plotProp, parameters.transitionProperties);
        addSymbols(parameters.uuid, plot, parameters.svg, parameters.plotProp, parameters.scales, parameters.toolTip, parameters.transitionProperties);
        removeSymbols(plot,  parameters.transitionProperties);

    }

    /**
     *
     * @param svg
     * @param transitionProperties
     */
    function removeSymbols( svg,  transitionProperties) {

        svg = svg.exit();
        svg.style('fill', transitionProperties.exitColor);
        svg.transition().delay(transitionProperties.endDurationTime).remove();

    }

    /**
     *
     * @param svg
     * @param data
     * @param scales
     * @param plotProp
     * @param transitionProperties
     * @returns {*}
     */

    function updateSymbols(svg, data, scales, plotProp, transitionProperties) {

        svg = _symbol.updateSymbol(svg, plotProp, scales, data, transitionProperties);
        return svg;
    }

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

        }
    };

}





