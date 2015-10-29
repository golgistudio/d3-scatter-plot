/**
 * Created by laurie on 10/24/15.
 */
"use strict";

function axesManager(uuid, dataStoreManager) {

    var _uuid = uuid;
    var _dataStoreManager = dataStoreManager;
    var _axes = null;

    /**
     * ToDo - Use Factory to create axes
     * ToDo - Extract out properties.
     *
     * @param domains
     * @param width
     * @param height
     * @returns {{xAxis=*, yAxis=*, topBorder=*, rightBorder=*}}
     */
    this.createAxes = function (domains, width, height, axesProperties) {


        // Create x scale
        // For this example it is ordinal
        var xScale = d3.scale.ordinal()
            .range([axesProperties.xScaleRangeStart, width])
            .rangePoints([axesProperties.xScaleRangePointsStart, width])
            .domain(domains.xDomain);

        // Create y scale
        // For this example it is linear
        var yScale = d3.scale.linear()
            .range([height, axesProperties.yScaleRangePointEnd])
            .domain(domains.yDomain);

        // Create x axis
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .innerTickSize(-height)
            .outerTickSize(axesProperties.xOuterTickSize)
            .tickPadding(axesProperties.xTickPadding);

        // Create y axis
        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .innerTickSize(-width)
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

        _axes = {
            'xAxis':       xAxis,
            'yAxis':       yAxis,
            'topBorder':   topBorder,
            'rightBorder': rightBorder,
            'scales':      {
                'yScale': yScale,
                'xScale': xScale
            }

        };

        return _axes;
    };

    this.createZoomListener = function(that, zoomScaleFactors, zoomHandler) {
        var zoomListener =  d3.behavior.zoom()
            .y(_axes.scales.yScale)
            .scaleExtent([zoomScaleFactors.yZoomFactors.yMin, zoomScaleFactors.yZoomFactors.yMax])
            .on("zoom", function () {
                zoomHandler(that);
            });
        zoomListener.y(_axes.scales.yScale);

        return zoomListener;
    };

    /**
     *
     * @param svg
     * @param axes
     * @param width
     * @param height
     * @returns {*}
     */
    this.drawAxes = function  (svg) {

        var axesProperties = _dataStoreManager.getData(_uuid, dataStoreNames.axes);
        var chartProperties = _dataStoreManager.getData(_uuid, dataStoreNames.chart);

        // Add the x axis
        svg.append("g")
            .attr("class", axesProperties.xAxisClassName)
            .attr("transform", "translate(0," + chartProperties.height + ")")
            .call(_axes.xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", axesProperties.xAxis_dx)
            .attr("dy", axesProperties.xAxis_dy)
            .attr("transform", "rotate(-50)");

        // Add the x border
        svg.append("g")
            .attr("class", axesProperties.xBorderClassName)
            .call(_axes.topBorder);

        // Add the y axis
        svg.append("g")
            .attr("class", axesProperties.yAxisClassName)
            .call(_axes.yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", axesProperties.yPosition)
            .attr("dy", axesProperties.yAxis_dy)
            .style("text-anchor", "end");

        // Add the y border
        svg.append("g")
            .attr("class", axesProperties.yBorderClassName)
            .call(_axes.rightBorder)
            .attr("transform", "translate(" + chartProperties.width + " ,0)")
            .attr("y", axesProperties.xPosition)
            .attr("dy", axesProperties.yAxis_dy);

        return svg;
    };

    /**
     *
     * @param svg
     * @param axes
     * @param width
     * @param height
     * @returns {*}
     */
    this.updateAxes = function  (svg) {

        var axesProperties = _dataStoreManager.getData(_uuid, dataStoreNames.axes);

        if (_axes.hasOwnProperty("xAxis")) {
            // Update X Axis
            svg.select(axesProperties.xAxisClassSelector)
                .transition()
                .duration(axesProperties.yTransitionDuration)
                .call(_axes.xAxis)
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
                .call(_axes.yAxis);
        }

        return svg;

    };

};