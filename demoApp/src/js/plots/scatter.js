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
export function ScatterPlot() {
    "use strict";

    var _triangleSymbol = null;
    var _dotSymbol = null;
    var _squareSymbol = null;
    var _iconSymbol = null;
    var _fontAwesomeSymbol = null;

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

        switch (plotProp.display.symbol) {
            case "triangle":

                if (_triangleSymbol === null) {
                    _triangleSymbol = new TriangleSymbol();
                }
                plot = _triangleSymbol.addSymbol(uuid, plot, parentSVG, plotProp, scales, toolTip, transitionProperties);
                break;
            case "dot" :
                if (_dotSymbol === null) {
                    _dotSymbol = new DotSymbol();
                }
                plot = _dotSymbol.addSymbol(uuid, plot, parentSVG, plotProp, scales, toolTip, transitionProperties);
                break;
            case "square":
                if (_squareSymbol === null) {
                    _squareSymbol = new SquareSymbol();
                }
                plot = _squareSymbol.addSymbol(uuid, plot, parentSVG, plotProp, scales, toolTip, transitionProperties);
                break;
            case "icon":
                if (_iconSymbol === null) {
                    _iconSymbol = new IconSymbol();
                }
                plot = _iconSymbol. addSymbol(uuid, plot, parentSVG, plotProp, scales, toolTip, transitionProperties) ;
                break;
            case "font":
                if (_fontAwesomeSymbol === null) {
                    _fontAwesomeSymbol = new FontAwesomeSymbol();
                }
                plot = _fontAwesomeSymbol.addSymbol(uuid,plot, parentSVG, plotProp, scales, toolTip, transitionProperties);
                break;
        }
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

        switch (plotProp.display.symbol) {
            case "triangle":
                plot = _triangleSymbol.zoomSymbol(plot, plotProp, scales);
                break;
            case "dot" :
                plot = _dotSymbol.zoomSymbol(plot, plotProp, scales);
                break;
            case "square":
                plot = _squareSymbol.zoomSymbol(plot, plotProp, scales);
                break;
            case "icon":
                plot = _iconSymbol.zoomSymbol(plot, plotProp, scales) ;
                break;
            case "font":
                plot = _fontAwesomeSymbol.zoomSymbol(plot, plotProp, scales);
                break;
        }
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

        switch (plotProp.display.symbol) {
            case "triangle":
                svg = _triangleSymbol.updateSymbol(svg, plotProp, scales, data, transitionProperties);
                break;
            case "dot" :
                svg = _dotSymbol.updateSymbol(svg, plotProp, scales, data, transitionProperties);
                break;
            case "square":
                svg = _squareSymbol.updateSymbol(svg, plotProp, scales, data, transitionProperties);
                break;
            case "icon":
                svg = _iconSymbol.updateSymbol(svg, plotProp, scales, data, transitionProperties) ;
                break;
            case "font":
                svg = _fontAwesomeSymbol.updateSymbol(svg, plotProp, scales, data, transitionProperties);
                break;
        }

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





