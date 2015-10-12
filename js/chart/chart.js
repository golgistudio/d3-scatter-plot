

/**
 *
 * @type {{_data: null, _width: number, _height: number, _margin: {top: number, right: number, bottom: number, left: number}, _totalWidth: null, _totalHeight: null, _toolTip: null, _legendProperties: null, _labelProperties: null, _domains: null, _dataMapper: null, _containerID: null, _plotProperties: null, _plotRenderer: null, create: Function, updateChartProperties: Function, initializeChartSize: Function, createAxes: Function, drawAxes: Function, initializeChart: Function, drawPlots: Function, resize: Function}}
 */
var chart = {
    _data:             null,
    _width:            700,
    _height:           600,
    _margin:           {
        top:    50,
        right:  10,
        bottom: 100,
        left:   80
    }
    ,
    _totalWidth:       null,
    _totalHeight:      null,
    _toolTip:          null,
    _legendProperties: null,
    _labelProperties:  null,
    _domains:          null,
    _dataMapper:       null,
    _containerID:      null,
    _plotProperties:   null,
    _plotRenderer:     null,
    _axes:             null,
    _zoomListener:     null,


    /**
     *
     * @param chartParameters
     */
    create: function (chartParameters) {
        "use strict";

        var that = this;

        this._zoomListener = d3.behavior.zoom()
            .on("zoom", function () {
                that.zoomHandler(that);
            });

        this.setChartProperties(chartParameters);
        this.initializeChartSize(this._totalWidth, this._totalHeight, this._margin);
        this._axes = this.createAxes(this._domains, this._width, this._height);
        this._zoomListener.y(this._axes.scales.yScale);
        var svg  = this.initializeChart(this._data, this._dataMapper, this._width, this._height, this._margin, this._containerID, this._zoomListener);
        svg      = this.drawAxes(svg, this._axes, this._width, this._height);
        this.drawPlots(this._data, this._plotProperties, svg, this._axes.scales, this._toolTip, this._plotRenderer);
        drawChartLabels(svg, this._labelProperties, this._width, this._height, this._margin);
        drawLegend(svg, this._width, this._height, this._legendProperties);

    },

    /**
     *
     * @param chartParameters
     */
    setChartProperties: function (chartParameters) {
        "use strict";
        this._margin.top    = chartParameters.chartProperties.margin.top;
        this._margin.right  = chartParameters.chartProperties.margin.right;
        this._margin.bottom = chartParameters.chartProperties.margin.bottom;
        this._margin.left   = chartParameters.chartProperties.margin.left;

        this._totalWidth       = chartParameters.chartProperties.width;
        this._totalHeight      = chartParameters.chartProperties.height;
        this._toolTip          = chartParameters.toolTip;
        this._domains          = chartParameters.domains;
        this._dataMapper       = chartParameters.dataMapper;
        this._containerID      = chartParameters.containerID;
        this._plotProperties   = chartParameters.plotProperties;
        this._plotRenderer     = chartParameters.plotRenderer;
        this._data             = chartParameters.data;
        this._containerID      = chartParameters.chartProperties.containerID;
        this._labelProperties  = chartParameters.labelProperties;
        this._legendProperties = chartParameters.legendProperties;
    },

    /**
     *
     * @param totalWidth
     * @param totalHeight
     * @param margin
     */
    initializeChartSize: function (totalWidth, totalHeight, margin) {
        "use strict";

        //var containerStyleWidth = parseInt(d3.select("#" + config.containerID).style('width'), 10);
        this._width  = totalWidth - margin.left - margin.right;
        this._height = totalHeight - margin.top - margin.bottom;
    },

    /**
     * ToDo - Use Factory to create axes
     * ToDo - Extract out properties.
     *
     * @param domains
     * @param width
     * @param height
     * @returns {{xAxis: *, yAxis: *, topBorder: *, rightBorder: *}}
     */
    createAxes: function (domains, width, height) {
        "use strict";

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
    },

    /**
     *
     * @param svg
     * @param axes
     * @param width
     * @param height
     * @returns {*}
     */
    drawAxes: function (svg, axes, width, height) {
        "use strict";

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
    },

    /**
     *
     * @param svg
     * @param axes
     * @param width
     * @param height
     * @returns {*}
     */
    updateAxes: function (svg, axes) {
        "use strict";

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

    },

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
    initializeChart: function (data, mapDataCallback, width, height, margin, containerID, zoomListener) {
        "use strict";

        var svg = d3.select("#" + containerID).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("style", "outline: thin solid lightgrey;")
            .call(zoomListener)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.selectAll("g.node").data(data, function (d) {
            return mapDataCallback(d);
        });


        return svg;
    },

    /**
     *
     * @param data
     * @param plotProperties
     * @param svg
     * @param scales
     * @param tooltip
     * @param plotRenderer
     */
    drawPlots: function (data, plotProperties, svg, scales, tooltip, plotRenderer) {
        "use strict";

        chart._plotProperties.forEach( function (configItem) {
            plotRenderer.renderPlot(data, svg, configItem, scales, tooltip);
        });
    },

    updatePlots: function (data, plotProperties, svg, scales, tooltip, plotRenderer) {
        "use strict";

        chart._plotProperties.forEach( function (itemProperties) {
            plotRenderer.updatePlot(data, scales, svg, itemProperties, tooltip);

        });

    },

    /**
     *
     * @param width
     * @param height
     */
    resize: function (width, height) {
        "use strict";

        this._totalWidth  = width;
        this._totalHeight = height;
        d3.select("svg").remove();

        this.initializeChartSize(this._totalWidth, this._totalHeight, this._margin);
        this._axes = this.createAxes(this._domains, this._width, this._height);
        var svg  = this.initializeChart(this._data, this._dataMapper, this._width, this._height, this._margin, this._containerID, this._zoomListener);
        svg      = this.drawAxes(svg, this._axes, this._width, this._height);
        this.drawPlots(this._data, this._plotProperties, svg, this._axes.scales, this._toolTip, this._plotRenderer);
        drawChartLabels(svg, this._labelProperties, this._width, this._height, this._margin);
        drawLegend(svg, this._width, this._height, this._legendProperties);
    },

    /**
     *
     * @param chart
     */

    zoomHandler: function(chart) {
        "use strict";

        var svgSelected = d3.select("svg");
        svgSelected.attr("transform", "translate("+ d3.event.translate + ")scale(1," + d3.event.scale + ")");

        var zoomAxes = {yAxis: chart._axes.yAxis};
        this.updateAxes(svgSelected, zoomAxes);
        //chart.drawPlots(chart._data, chart._plotProperties, svgSelected, chart._axes.scales, chart._toolTip, chart._plotRenderer);

       chart._plotProperties.forEach( function (itemProperties) {
            svgSelected.selectAll("." + itemProperties.plotClassName).attr("transform","translate("+
                d3.event.translate.join(1," ")+")scale(1, "+d3.event.scale+")"); //
        });

    },

    /**
     *
     * @param data
     * @param domains
     */
    updateData: function(data, domains) {
        "use strict";

        this._data = data;
        this._domains = domains;
        var dataMapper = this._dataMapper;

            // Update domain
            // Update Axis
            // Update Plots
        var svg = d3.select("#" + this._containerID).select("svg");
        svg.selectAll("g.node").data(data, function (d) {
            return dataMapper(d);
        });
        this._axes = this.createAxes(this._domains, this._width, this._height);

        this.updatePlots(this._data, this._plotProperties, svg, this._axes.scales, this._toolTip, this._plotRenderer);

        this.updateAxes(svg, this._axes);

    }

};
