"use strict";

/**
 *
 * @constructor
 */
function Chart(dataManager, uuid) {
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
        _zoomListener     = null,
        _axes             = null,
        _transitionProperties = null,
        _zoomScaleFactors = null,
        _that             = null,
        _axesProperties   = null,
        _chartComponents  = null;

    var _axesManager = null;
    var _plotManager = null;

    var _dataStoreManager =  dataManager;
    var _uuid = uuid;

    this.handleRequest = function (request, parameters) {

        switch(request) {
            case "create" : create(parameters);
                break;
            case "update" : updateData(parameters);
                break;
            case "resize" : resize(parameters);
                break;
            case "styleUpdate" : styleUpdate(parameters);
                break;
            case "symbolUpdate" : symbolUpdate(parameters);
                break;
            case "plotStyleUpdate" : plotStyleUpdate(parameters);
                break;
        };
    };

    /**
     *
     * @param chartParameters
     */
    function create (chartParameters) {

        _that = this;

        _axesManager = new axesManager();
        _plotManager = new plotManager();



        setChartProperties(chartParameters);
        initializeChartSize(_totalWidth, _totalHeight, _margin);
        _axes = _axesManager.createAxes(_domains, _width, _height, _axesProperties);

        _dataStoreManager.setData(_uuid, "axes", _axes);

        var axesTemp = _dataStoreManager.getData(_uuid, "axes");

        _zoomListener = _axesManager.createZoomListener(_axes, _that, _zoomScaleFactors, zoomHandler );
        _chartComponents  = initializeChart(_data, _dataMapper, _width, _height, _margin, _containerID, _zoomListener);
        _chartComponents.svg      = _axesManager.drawAxes(_chartComponents.svg, _axes, _width, _height, _axesProperties);
        var plotParams = {
            "data" : _data,
            "plotProperties" : _plotProperties,
            "svg": _chartComponents.chartBody,
            "scales": _axes.scales,
            "toolTip" : _toolTip,
            "transitionProperties" : _transitionProperties
        };
        _plotManager.plotManagerInterface("draw", plotParams);
        drawChartLabels(_chartComponents.svg, _labelProperties, _width, _height, _margin);

        var legendData = [];

        _plotProperties.forEach(function(item) {

            var legendDataItem = {
                "name" : item.name,
                "plotClassName" : item.plotClassName,
                "color" : item.display.fillColor
            };

            legendData.push(legendDataItem);
        });
        drawLegend(_chartComponents.svg, _width, _height, _legendProperties, legendData);

    };



    // If the drag behavior prevents the default click,
    // also stop propagation so we don’t click-to-zoom.
    function stopped() {
        if (d3.event.defaultPrevented) {
            d3.event.stopPropagation();
        }
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
        _plotProperties   = chartParameters.plotProperties;
        _data             = chartParameters.data;
        _containerID      = chartParameters.chartProperties.containerID;
        _labelProperties  = chartParameters.labelProperties;
        _legendProperties = chartParameters.legendProperties;
        _transitionProperties = chartParameters.transitionProperties;
        _zoomScaleFactors = chartParameters.zoomScaleFactors;
        _axesProperties = chartParameters.axesProperties;

        _plotProperties.forEach(function (configItem) {
            var params = {
                "plotStyle" : configItem.display.plotStyle
            }
            configItem.display.plotRenderer = _plotManager.plotManagerInterface("getPlotRenderer",params);
        });
    };

    /**
     *
     * @param totalWidth
     * @param totalHeight
     * @param margin
     */
    function initializeChartSize (totalWidth, totalHeight, margin) {

        _width  = totalWidth - margin.left - margin.right;
        _height = totalHeight - margin.top - margin.bottom;
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
            //.call(zoomListener)
           // .on("click", stopped, true)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var clip = svg.append("defs").append("svg:clipPath")
            .attr("id", "clip")
            .append("svg:rect")
            .attr("id", "clip-rect")
            .attr("x", "0")
            .attr("y", "0")
            .attr("width", width)
            .attr("height", height);

        var chartBody = svg.append("g")
            .attr("clip-path", "url(#clip)")
            .call(zoomListener)
            .on("click", stopped, true);

        var rect = chartBody.append('svg:rect')
            .attr('width', width)
            .attr('height', height)
            .attr('fill', 'white');

        chartBody.selectAll("g.node").data(data, function (d) {
            return mapDataCallback(d);
        });

        //return svg;

        return {
            "svg" : svg,
            "chartBody" : chartBody
        };
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
        _axes = _axesManager.createAxes(_domains, _width, _height, _axesProperties);
        _zoomListener = _axesManager.createZoomListener(_axes, _that, _zoomScaleFactors , zoomHandler);
        _chartComponents  = initializeChart(_data, _dataMapper, _width, _height, _margin, _containerID, _zoomListener);
        _chartComponents.svg      = _axesManager.drawAxes(_chartComponents.svg, _axes, _width, _height, _axesProperties);

        var plotParams = {
            "data" : _data,
            "plotProperties" : _plotProperties,
            "svg": _chartComponents.chartBody,
            "scales": _axes.scales,
            "toolTip" : _toolTip,
            "transitionProperties" : _transitionProperties
        };
        _plotManager.plotManagerInterface("draw", plotParams);

        drawChartLabels(_chartComponents.svg, _labelProperties, _width, _height, _margin);

        var legendData = [];

        _plotProperties.forEach(function(item) {

            var legendDataItem = {
                "name" : item.name,
                "plotClassName" : item.plotClassName,
                "color" : item.display.fillColor
            };

            legendData.push(legendDataItem);
        });

        drawLegend(_chartComponents.svg, _width, _height, _legendProperties, legendData);
    };

    /**
     *
     * @param chart
     */
    function zoomHandler() {

        var tx, ty;
        tx = d3.event.translate[0];
        ty = d3.event.translate[1];
        //console.log("zoom tx = " + tx + ", ty = " + ty);
        //tx = Math.min(1, Math.max(tx, width - Math.round(x(maxDays) - x(1)), width - Math.round(x(maxDays) - x(1)) * d3.event.scale));
        _zoomListener.translate([
            tx,
            ty
        ]);

        var svg = d3.select("#" + _containerID).select("svg");

        var zoomAxes = {yAxis: _axes.yAxis};
        _axesManager.updateAxes(svg, zoomAxes, _axesProperties);

        var plotParams = {
            "data" : _data,
            "plotProperties" : _plotProperties,
            "svg": svg,
            "scales": _axes.scales
        };
        _plotManager.plotManagerInterface("zoom", plotParams);
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
        _axes = _axesManager.createAxes(_domains, _width, _height, _axesProperties);

        _dataStoreManager.setData(_uuid, "axes", _axes);

        var axesTemp = _dataStoreManager.getData(_uuid, "axes");

        _zoomListener = _axesManager.createZoomListener(_axes, _that, _zoomScaleFactors, zoomHandler );
        svg.call(_zoomListener);

        var plotParams = {
            "data" : _data,
            "plotProperties" : _plotProperties,
            "svg": _chartComponents.chartBody,
            "scales": _axes.scales,
            "toolTip" : _toolTip,
            "transitionProperties" : _transitionProperties
        };
        _plotManager.plotManagerInterface("update", plotParams);
        _axesManager.updateAxes(svg, axesTemp, _axesProperties);

    };

    function styleUpdate(parameters) {

        _plotProperties = parameters.plotProperties;
        _data = parameters.data;
        _domains = parameters.domains;

        var plotParams = {
            "data" : _data,
            "plotProperties" : _plotProperties,
            "svg": _chartComponents.chartBody,
            "scales": _axes.scales,
            "toolTip" : _toolTip,
            "transitionProperties" : _transitionProperties,
            "plotName" : parameters.plotName
        };
        _plotManager.plotManagerInterface("updateSelected", plotParams);
        var legendData = [];

        _plotProperties.forEach(function(item) {

            var legendDataItem = {
                "name" : item.name,
                "plotClassName" : item.plotClassName,
                "color" : item.display.fillColor
            };

            legendData.push(legendDataItem);
        });

        removeLegendItems(_chartComponents.svg, _legendProperties);
        updateLegend(_chartComponents.svg, _legendProperties, legendData);

    };

    function symbolUpdate(parameters) {

        _plotProperties = parameters.plotProperties;
        _data = parameters.data;
        _domains = parameters.domains;

        // Update domain
        // Update Axis
        // Update Plots

        var plotParams = {
            "data" : _data,
            "plotProperties" : _plotProperties,
            "svg": _chartComponents.chartBody,
            "scales": _axes.scales,
            "toolTip" : _toolTip,
            "transitionProperties" : _transitionProperties,
            "plotName" : parameters.plotName
        };
        _plotManager.plotManagerInterface("drawSelected", plotParams);

    };

    function plotStyleUpdate(parameters) {

        _plotProperties = parameters.plotProperties;

        _data = parameters.data;
        _domains = parameters.domains;

        _plotProperties.forEach( function (configItem) {
            if (configItem.name === parameters.plotName) {
                configItem.display.plotRenderer = _plotManager.plotManagerInterface("getPlotRenderer",parameters);
            }
        });

        // Update domain
        // Update Axis
        // Update Plots

        var plotParams = {
            "data" : _data,
            "plotProperties" : _plotProperties,
            "svg": _chartComponents.chartBody,
            "scales": _axes.scales,
            "toolTip" : _toolTip,
            "transitionProperties" : _transitionProperties,
            "plotName" : parameters.plotName
        };
        _plotManager.plotManagerInterface("drawSelected", plotParams);

    };
};
