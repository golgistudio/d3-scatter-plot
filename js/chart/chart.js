"use strict";

/**
 *
 * @type {{_data=null, _width=number, _height=number, _margin={top=number, right=number, bottom=number, left=number}, _totalWidth=null, _totalHeight=null, _toolTip=null, _legendProperties=null, _labelProperties=null, _domains=null, _dataMapper=null, _containerID=null, _plotProperties=null, _plotRenderer=null, create=Function, updateChartProperties=Function, initializeChartSize=Function, createAxes=Function, drawAxes=Function, initializeChart=Function, drawPlots=Function, resize=Function}}
 */
function chart() {
    var _data             = null,
        _width            = 700,
        _height           = 600,
        _margin           = {
            top:    50,
            right:  10,
            bottom: 100,
            left:   80
        }
        ,
        _totalWidth       = null,
        _totalHeight      = null,
        _toolTip          = null,
        _legendProperties = null,
        _labelProperties  = null,
        _domains          = null,
        _dataMapper       = null,
        _containerID      = null,
        _plotProperties   = null,
        _plotRenderer     = null,
        _zoomListener     = null,
        _axes             = null;

    this.handleRequest = function (request, parameters) {

        switch(request) {
            case "create" : create(parameters);
                break;
            case "update" : updateData(parameters);
                break;
            case "resize" : resize(parameters);

        };

    };

    /**
     *
     * @param chartParameters
     */
    function create (chartParameters) {

        var that = this;

        setChartProperties(chartParameters);
        initializeChartSize(_totalWidth, _totalHeight, _margin);
        _axes = createAxes(_domains, _width, _height);
        _zoomListener = d3.behavior.zoom()
            .y(_axes.scales.yScale)
            .on("zoom", function () {
                zoomHandler(that);
            });
        _zoomListener.y(_axes.scales.yScale);
        var svg  = initializeChart(_data, _dataMapper, _width, _height, _margin, _containerID, _zoomListener);
        svg      = drawAxes(svg, _axes, _width, _height);
        drawPlots(_data, _plotProperties, svg, _axes.scales, _toolTip, _plotRenderer);
        drawChartLabels(svg, _labelProperties, _width, _height, _margin);
        drawLegend(svg, _width, _height, _legendProperties);

    };

    /**
     *
     * @param chartParameters
     */
    function setChartProperties (chartParameters) {

        _margin.top    = chartParameters.chartProperties.margin.top;
        _margin.right  = chartParameters.chartProperties.margin.right;
        _margin.bottom = chartParameters.chartProperties.margin.bottom;
        _margin.left   = chartParameters.chartProperties.margin.left;

        _totalWidth       = chartParameters.chartProperties.width;
        _totalHeight      = chartParameters.chartProperties.height;
        _toolTip          = chartParameters.toolTip;
        _domains          = chartParameters.domains;
        _dataMapper       = chartParameters.dataMapper;
        _containerID      = chartParameters.containerID;
        _plotProperties   = chartParameters.plotProperties;
        _plotRenderer     = chartParameters.plotRenderer;
        _data             = chartParameters.data;
        _containerID      = chartParameters.chartProperties.containerID;
        _labelProperties  = chartParameters.labelProperties;
        _legendProperties = chartParameters.legendProperties;
    };

    /**
     *
     * @param totalWidth
     * @param totalHeight
     * @param margin
     */
    function initializeChartSize (totalWidth, totalHeight, margin) {


        //var containerStyleWidth = parseInt(d3.select("#" + config.containerID).style('width'), 10);
        _width  = totalWidth - margin.left - margin.right;
        _height = totalHeight - margin.top - margin.bottom;
    };

    /**
     * ToDo - Use Factory to create axes
     * ToDo - Extract out properties.
     *
     * @param domains
     * @param width
     * @param height
     * @returns {{xAxis=*, yAxis=*, topBorder=*, rightBorder=*}}
     */
    function createAxes (domains, width, height) {


        // Properties - ToDo - Extract out
        var xScaleRangeStart       = 0;
        var xScaleRangePointsStart = 0;
        var yScaleRangePointEnd    = 0;
        var xOuterTickSize         = 0;
        var yOuterTickSize         = 0;
        var xTickPadding           = 10;
        var yTickPadding           = 10;
        var yBorderInnerTickSize   = 0;
        var yBorderOuterTickSize   = 0;

        // Create x scale
        // For this example it is ordinal
        var xScale = d3.scale.ordinal()
            .range([xScaleRangeStart, width])
            .rangePoints([xScaleRangePointsStart, width])
            .domain(domains.xDomain);

        // Create y scale
        // For this example it is linear
        var yScale = d3.scale.linear()
            .range([height, yScaleRangePointEnd])
            .domain(domains.yDomain);

        // Create x axis
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .innerTickSize(-height)
            .outerTickSize(xOuterTickSize)
            .tickPadding(xTickPadding);

        // Create y axis
        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .innerTickSize(-width)
            .outerTickSize(yOuterTickSize)
            .tickPadding(yTickPadding);

        // Create border around the rest of the chart
        var topBorder = d3.svg.axis()
            .scale(xScale)
            .orient("top")
            .tickValues(0);

        var rightBorder = d3.svg.axis()
            .scale(yScale)
            .orient("right")
            .innerTickSize(yBorderInnerTickSize)
            .outerTickSize(yBorderOuterTickSize)
            .tickPadding(xTickPadding);

        return {
            'xAxis':       xAxis,
            'yAxis':       yAxis,
            'topBorder':   topBorder,
            'rightBorder': rightBorder,
            'scales' : {
                'yScale': yScale,
                'xScale': xScale
            }
        };
    };

    /**
     *
     * @param svg
     * @param axes
     * @param width
     * @param height
     * @returns {*}
     */
    function drawAxes  (svg, axes, width, height) {


        var yPosition = 6;
        var xPosition = 6;

        var xAxis_dx = "-.8em";
        var xAxis_dy = ".15em";
        var yAxis_dy = ".72em";

        var xAxisClassName = "x axis";
        var xBorderClassName = "xBorder axis";

        var yAxisClassName = "y axis";
        var yBorderClassName = "yBorder axis";

        // Add the x axis
        svg.append("g")
            .attr("class", xAxisClassName)
            .attr("transform", "translate(0," + height + ")")
            .call(axes.xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", xAxis_dx)
            .attr("dy", xAxis_dy)
            .attr("transform", "rotate(-50)");

        // Add the x border
        svg.append("g")
            .attr("class", xAxisClassName)
            .call(axes.topBorder);

        // Add the y axis
        svg.append("g")
            .attr("class", "y axis")
            .call(axes.yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", yPosition)
            .attr("dy", yAxis_dy)
            .style("text-anchor", "end");

        // Add the y border
        svg.append("g")
            .attr("class", yBorderClassName)
            .call(axes.rightBorder)
            .attr("transform", "translate(" + width + " ,0)")
            .attr("y", xPosition)
            .attr("dy", yAxis_dy);

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
    function updateAxes (svg, axes) {


        var yTransitionDuration = 500;
        var xTransitionDuration = 500;
        var xAxis_dx = "-.8em";
        var xAxis_dy = ".15em";

        if (axes.hasOwnProperty("xAxis")) {
            // Update X Axis
            svg.select(".x.axis")
                .transition()
                .duration(yTransitionDuration)
                .call(axes.xAxis)
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", xAxis_dx)
                .attr("dy", xAxis_dy)
                .attr("transform", "rotate(-50)");
        }

        if (axes.hasOwnProperty("yAxis")) {

            // Update Y Axis
            svg.select(".y.axis")
                .transition()
                .duration(xTransitionDuration)
                .call(axes.yAxis);
        }

        return svg;

    };

    /**
     *
     * @param data
     * @param mapDataCallback
     * @param width
     * @param height
     * @param margin
     * @param containerID
     * @returns {*}
     */
    function initializeChart (data, mapDataCallback, width, height, margin, containerID, zoomListener) {


        var svg = d3.select("#" + containerID).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("style", "outline=thin solid lightgrey;")
            .call(zoomListener)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.selectAll("g.node").data(data, function (d) {
            return mapDataCallback(d);
        });

        return svg;
    };

    /**
     *
     * @param data
     * @param plotProperties
     * @param svg
     * @param scales
     * @param tooltip
     * @param plotRenderer
     */
    function drawPlots  (data, plotProperties, svg, scales, tooltip, plotRenderer) {


        _plotProperties.forEach( function (configItem) {
            var params = {
                "data": data,
                "svg": svg,
                "plotProp": configItem,
                "scales": scales,
                "toolTip": tooltip
            };

            plotRenderer.plotInterface("render",params);
        });
    };

    function updatePlots (data, plotProperties, svg, scales, tooltip, plotRenderer) {
        "use strict";

        _plotProperties.forEach( function (itemProperties) {
            var params = {
                "data": data,
                "svg": svg,
                "plotProp": itemProperties,
                "scales": scales,
                "toolTip": tooltip
            };

            plotRenderer.plotInterface("update",params);

        });

    };

    /**
     *
     * @param width
     * @param height
     */
     function resize (params) {

        _totalWidth  = params.width;
        _totalHeight = params.height;
        d3.select("svg").remove();

        initializeChartSize(_totalWidth, _totalHeight, _margin);
        _axes = createAxes(_domains, _width, _height);
        var svg  = initializeChart(_data, _dataMapper, _width, _height, _margin, _containerID, _zoomListener);
        svg      = drawAxes(svg, _axes, _width, _height);
        drawPlots(_data, _plotProperties, svg, _axes.scales, _toolTip, _plotRenderer);
        drawChartLabels(svg, _labelProperties, _width, _height, _margin);
        drawLegend(svg, _width, _height, _legendProperties);
    };

    /**
     *
     * @param chart
     */
    function zoomHandler() {

        var svgSelected = d3.select("svg");
        svgSelected.attr("transform", "translate("+ d3.event.translate + ")scale(1," + d3.event.scale + ")");

        var zoomAxes = {yAxis: _axes.yAxis};
        updateAxes(svgSelected, zoomAxes);

        _plotProperties.forEach( function (itemProperties) {
            svgSelected.selectAll("." + itemProperties.plotClassName).attr("transform","translate("+
                d3.event.translate.join(1," ")+")scale(1, "+d3.event.scale+")"); //
        });

    };

    /**
     *
     * @param data
     * @param domains
     */
    function updateData(parameters) {

        _data = parameters.data;
        _domains = parameters.domains;
        var dataMapper = _dataMapper;

            // Update domain
            // Update Axis
            // Update Plots

        var svg = d3.select("#" + _containerID).select("g");
        svg.selectAll("g.node").data(_data, function (d) {
            return dataMapper(d);
        });
        _axes = createAxes(_domains, _width, _height);

        updatePlots(_data, _plotProperties, svg, _axes.scales, _toolTip, _plotRenderer);

        updateAxes(svg, _axes);

    };

};
