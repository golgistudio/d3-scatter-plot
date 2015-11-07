/**
 * @file
 */

/*global d3:false */

/*global dataStoreNames:false */

/*global require:false */
/*global module:false */

import  {dataStoreNames} from '../dataStore/dataStoreNames.js';


/**
 *
 * @param uuid
 * @param dataStoreManager
 * @constructor
 */
export function AxesManager(uuid, dataStoreManager) {
    "use strict";

    var _uuid = uuid;
    var _dataStoreManager = dataStoreManager;
    var _zoomListener = null;

    /**
     *
     */
    this.createAxes = function () {


        var axesProperties = _dataStoreManager.getData(_uuid, dataStoreNames.axes);
        var domains = _dataStoreManager.getData(_uuid, dataStoreNames.domains);
        var chartProps = _dataStoreManager.getData(_uuid, dataStoreNames.chart);

        // Create x scale
        // For this example it is ordinal
        var xScale = d3.scale.ordinal()
            .range([axesProperties.xScaleRangeStart, chartProps.width])
            .rangePoints([axesProperties.xScaleRangePointsStart, chartProps.width])
            .domain(domains.xDomain);

        // Create y scale
        // For this example it is linear
        var yScale = d3.scale.linear()
            .range([chartProps.height, axesProperties.yScaleRangePointEnd])
            .domain(domains.yDomain);

        // Create x axis
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .innerTickSize(-chartProps.height)
            .outerTickSize(axesProperties.xOuterTickSize)
            .tickPadding(axesProperties.xTickPadding);

        // Create y axis
        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .innerTickSize(-chartProps.width)
            .outerTickSize(axesProperties.yOuterTickSize)
            .tickPadding(axesProperties.yTickPadding);

        // Create border around the rest of the Chart
        var topBorder = d3.svg.axis()
            .scale(xScale)
            .orient("top")
            .tickValues(0);

        var rightBorder = d3.svg.axis()
            .scale(yScale)
            .orient("right")
            .innerTickSize(axesProperties.yBorderInnerTickSize)
            .outerTickSize(axesProperties.yBorderOuterTickSize)
            .tickPadding(axesProperties.xTickPadding);

        var axes = {
            'xAxis':       xAxis,
            'yAxis':       yAxis,
            'topBorder':   topBorder,
            'rightBorder': rightBorder,
            'scales':      {
                'yScale': yScale,
                'xScale': xScale
            }
        };

        _dataStoreManager.setData(_uuid, dataStoreNames.axesValues, axes);
    };

    /**
     *
     * @param x
     * @param y
     */
    this.translate = function(x,y) {

        _zoomListener.translate(x,y);
    };

    /**
     *
     * @param that
     * @param zoomHandler
     * @returns {*}
     */
    this.createZoomListener = function(that, zoomHandler) {


        var axes = _dataStoreManager.getData(_uuid, dataStoreNames.axesValues);
        var zoomScaleFactors = _dataStoreManager.getData(_uuid, dataStoreNames.zoomScaleFactors);

        var zoomListener =  d3.behavior.zoom()
            .y(axes.scales.yScale)
            .scaleExtent([zoomScaleFactors.yZoomFactors.yMin, zoomScaleFactors.yZoomFactors.yMax])
            .on("zoom", function () {
                zoomHandler(that);
            });
        zoomListener.y(axes.scales.yScale);

        _zoomListener = zoomListener;

        return _zoomListener;
    };

    /**
     *
     * @param svg
     */
    this.drawAxes = function  (svg) {

        var axesProperties = _dataStoreManager.getData(_uuid, dataStoreNames.axes);
        var chartProperties = _dataStoreManager.getData(_uuid, dataStoreNames.chart);
        var axes = _dataStoreManager.getData(_uuid, dataStoreNames.axesValues);

        // Add the x axis
        svg.append("g")
            .attr("class", axesProperties.xAxisClassName)
            .attr("transform", "translate(0," + chartProperties.height + ")")
            .call(axes.xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", axesProperties.xAxis_dx)
            .attr("dy", axesProperties.xAxis_dy)
            .attr("transform", "rotate(-50)");

        // Add the x border
        svg.append("g")
            .attr("class", axesProperties.xBorderClassName)
            .call(axes.topBorder);

        // Add the y axis
        svg.append("g")
            .attr("class", axesProperties.yAxisClassName)
            .call(axes.yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", axesProperties.yPosition)
            .attr("dy", axesProperties.yAxis_dy)
            .style("text-anchor", "end");

        // Add the y border
        svg.append("g")
            .attr("class", axesProperties.yBorderClassName)
            .call(axes.rightBorder)
            .attr("transform", "translate(" + chartProperties.width + " ,0)")
            .attr("y", axesProperties.xPosition)
            .attr("dy", axesProperties.yAxis_dy);

    };

    /**
    *
    * @param svg
     */
    this.updateAxes = function  (svg) {


        var axesProperties = _dataStoreManager.getData(_uuid, dataStoreNames.axes);
        var axes = _dataStoreManager.getData(_uuid, dataStoreNames.axesValues);

        if (axes.hasOwnProperty("xAxis")) {
            // Update X Axis
            svg.select(axesProperties.xAxisClassSelector)
                .transition()
                .duration(axesProperties.yTransitionDuration)
                .call(axes.xAxis)
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", axesProperties.xAxis_dx)
                .attr("dy", axesProperties.xAxis_dy)
                .attr("transform", "rotate(-50)");
        }

        if (axes.hasOwnProperty("yAxis")) {
            // Update Y Axis
            svg.select(axesProperties.yAxisClassSelector)
                .transition()
                .duration(axesProperties.yTransitionDuration)
                .call(axes.yAxis);
        }
    };

}