"use strict";

/**
 *
 * @constructor
 */
function Chart(dataManager, uuid, containerId) {

    var _dataStoreManager =  dataManager;
    var _uuid = uuid;
    var _that = this;

    var _axesManager = null;
    var _plotManager = null;
    var _toolTipManager = null;
    var _experiment =  null;
    var _data = null;

    var _axes = null;

    var _chartComponents = null;

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

        _data = chartParameters.data;
        _experiment = chartParameters.experiment;

        _axesManager = new axesManager(_uuid, _dataStoreManager);
        _plotManager = new plotManager();
        _toolTipManager = new toolTipManager();
        _toolTipManager.create(_dataStoreManager.getData(_uuid, dataStoreNames.toolTip));

        var plotProps = _dataStoreManager.getData(_uuid, dataStoreNames.experiment);
        var chartProps = _dataStoreManager.getData(_uuid, dataStoreNames.chart);
        var axesProps = _dataStoreManager.getData(_uuid, dataStoreNames.axes);
        var transitionProps = _dataStoreManager.getData(_uuid, dataStoreNames.transition);
        var labelProps = _dataStoreManager.getData(_uuid, dataStoreNames.labels);
        var legendProps = _dataStoreManager.getData(_uuid, dataStoreNames.legend);

        plotProps.forEach(function (configItem) {
            var params = {
                "plotStyle" : configItem.display.plotStyle
            }
            configItem.display.plotRenderer = _plotManager.plotManagerInterface("getPlotRenderer",params);
        });

        _dataStoreManager.setData(_uuid, dataStoreNames.experiment, plotProps);

        initializeChartSize(chartProps);
        _dataStoreManager.setData(_uuid, dataStoreNames.chart, chartProps);

        _axes = _axesManager.createAxes(_experiment._dataDomains, chartProps.width, chartProps.height, axesProps);

        var zoomListener = _axesManager.createZoomListener(_that, _experiment._zoomScaleFactors, zoomHandler );
        _chartComponents  = initializeChart(_data, _experiment.mapData, chartProps.width, chartProps.height, chartProps.margin, chartProps.containerID, zoomListener);
        _chartComponents.svg      = _axesManager.drawAxes(_chartComponents.svg);

        var plotParams = {
            "data" : _data,
            "plotProperties" : plotProps,
            "svg": _chartComponents.chartBody,
            "scales": _axes.scales,
            "toolTip" : _toolTipManager,
            "transitionProperties" : transitionProps
        };
        _plotManager.plotManagerInterface("draw", plotParams);
        drawChartLabels(_chartComponents.svg, labelProps, chartProps.width, chartProps.height, chartProps.margin);

        var legendData = [];

        plotProps.forEach(function(item) {

            var legendDataItem = {
                "name" : item.name,
                "plotClassName" : item.plotClassName,
                "color" : item.display.fillColor
            };

            legendData.push(legendDataItem);
        });
        drawLegend(_chartComponents.svg, chartProps.width, chartProps.height, legendProps, legendData);

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
     * @param totalWidth
     * @param totalHeight
     * @param margin
     */
    function initializeChartSize (chartProps) {

        chartProps.width  = chartProps.width - chartProps.margin.left - chartProps.margin.right;
        chartProps.height = chartProps.height - chartProps.margin.top - chartProps.margin.bottom;
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

        var plotProps = _dataStoreManager.getData(_uuid, dataStoreNames.experiment);
        var chartProps = _dataStoreManager.getData(_uuid, dataStoreNames.chart);
        var axesProps = _dataStoreManager.getData(_uuid, dataStoreNames.axes);
        var transitionProps = _dataStoreManager.getData(_uuid, dataStoreNames.transition);
        var labelProps = _dataStoreManager.getData(_uuid, dataStoreNames.labels);
        var legendProps = _dataStoreManager.getData(_uuid, dataStoreNames.legend);

        chartProps.width  = params.width;
        chartProps.height = params.height;
        d3.select("svg").remove();

        initializeChartSize( chartProps.width , chartProps.height , chartProps.margin);
        _dataStoreManager.setData(_uuid, dataStoreNames.chart, chartProps);
        _axes = _axesManager.createAxes(experiment._domains, chartProps.width , chartProps.height, axesProps);
        var zoomListener = _axesManager.createZoomListener(_axes, _that, _experiment._zoomScaleFactors , zoomHandler);
        _chartComponents  = initializeChart(_data, _experiment.mapData,  chartProps.width , chartProps.height , chartProps.margin, chartProps.containerID, zoomListener);
        _chartComponents.svg      = _axesManager.drawAxes(_chartComponents.svg);

        var plotParams = {
            "data" : _data,
            "plotProperties" : plotProps,
            "svg": _chartComponents.chartBody,
            "scales": _axes.scales,
            "toolTip" : _toolTipManager,
            "transitionProperties" : transitionProps
        };
        _plotManager.plotManagerInterface("draw", plotParams);

        drawChartLabels(_chartComponents.svg, labelProps, chartProps.width , chartProps.height , chartProps.margin);

        var legendData = [];

        plotProps.forEach(function(item) {

            var legendDataItem = {
                "name" : item.name,
                "plotClassName" : item.plotClassName,
                "color" : item.display.fillColor
            };

            legendData.push(legendDataItem);
        });

        drawLegend(_chartComponents.svg, chartProps.width , chartProps.height, legendProps, legendData);
    };

    /**
     *
     * @param chart
     */
    function zoomHandler() {

        //var tx, ty;
        //tx = d3.event.translate[0];
        //ty = d3.event.translate[1];
        ////console.log("zoom tx = " + tx + ", ty = " + ty);
        ////tx = Math.min(1, Math.max(tx, width - Math.round(x(maxDays) - x(1)), width - Math.round(x(maxDays) - x(1)) * d3.event.scale));
        //_zoomListener.translate([
        //    tx,
        //    ty
        //]);
        //
        //var svg = d3.select("#" + _containerID).select("svg");
        //
        //var zoomAxes = {yAxis: _axes.yAxis};
        //_axesManager.updateAxes(svg, zoomAxes, _axesProperties);
        //
        //var plotParams = {
        //    "data" : _data,
        //    "plotProperties" : _plotProperties,
        //    "svg": svg,
        //    "scales": _axes.scales
        //};
        //_plotManager.plotManagerInterface("zoom", plotParams);
    };

    /**
     *
     * @param data
     * @param domains
     */
    function updateData(parameters) {

        //_data = parameters.data;
        //_domains = parameters.domains;
        //var dataMapper = _dataMapper;
        //
        //    // Update domain
        //    // Update Axis
        //    // Update Plots
        //
        //var svg = d3.select("#" + _containerID).select("g");
        //svg.selectAll("g.node").data(_data, function (d) {
        //    return dataMapper(d);
        //});
        //_axes = _axesManager.createAxes(_domains, _width, _height, _axesProperties);
        //
        //_dataStoreManager.setData(_uuid, "axes", _axes);
        //
        //var axesTemp = _dataStoreManager.getData(_uuid, "axes");
        //
        //_zoomListener = _axesManager.createZoomListener(_axes, _that, _zoomScaleFactors, zoomHandler );
        //svg.call(_zoomListener);
        //
        //var plotParams = {
        //    "data" : _data,
        //    "plotProperties" : _plotProperties,
        //    "svg": _chartComponents.chartBody,
        //    "scales": _axes.scales,
        //    "toolTip" : _toolTip,
        //    "transitionProperties" : _transitionProperties
        //};
        //_plotManager.plotManagerInterface("update", plotParams);
        //_axesManager.updateAxes(svg, axesTemp, _axesProperties);

    };

    function styleUpdate(parameters) {

        //_plotProperties = parameters.plotProperties;
        //_data = parameters.data;
        //_domains = parameters.domains;
        //
        //var plotParams = {
        //    "data" : _data,
        //    "plotProperties" : _plotProperties,
        //    "svg": _chartComponents.chartBody,
        //    "scales": _axes.scales,
        //    "toolTip" : _toolTip,
        //    "transitionProperties" : _transitionProperties,
        //    "plotName" : parameters.plotName
        //};
        //_plotManager.plotManagerInterface("updateSelected", plotParams);
        //var legendData = [];
        //
        //_plotProperties.forEach(function(item) {
        //
        //    var legendDataItem = {
        //        "name" : item.name,
        //        "plotClassName" : item.plotClassName,
        //        "color" : item.display.fillColor
        //    };
        //
        //    legendData.push(legendDataItem);
        //});
        //
        //updateLegend(_chartComponents.svg, _legendProperties, legendData);

    };

    function symbolUpdate(parameters) {

        //_plotProperties = parameters.plotProperties;
        //_data = parameters.data;
        //_domains = parameters.domains;
        //
        //// Update domain
        //// Update Axis
        //// Update Plots
        //
        //var plotParams = {
        //    "data" : _data,
        //    "plotProperties" : _plotProperties,
        //    "svg": _chartComponents.chartBody,
        //    "scales": _axes.scales,
        //    "toolTip" : _toolTip,
        //    "transitionProperties" : _transitionProperties,
        //    "plotName" : parameters.plotName
        //};
        //_plotManager.plotManagerInterface("drawSelected", plotParams);

    };

    function plotStyleUpdate(parameters) {

        //_plotProperties = parameters.plotProperties;
        //
        //_data = parameters.data;
        //_domains = parameters.domains;
        //
        //_plotProperties.forEach( function (configItem) {
        //    if (configItem.name === parameters.plotName) {
        //        configItem.display.plotRenderer = _plotManager.plotManagerInterface("getPlotRenderer",parameters);
        //    }
        //});
        //
        //// Update domain
        //// Update Axis
        //// Update Plots
        //
        //var plotParams = {
        //    "data" : _data,
        //    "plotProperties" : _plotProperties,
        //    "svg": _chartComponents.chartBody,
        //    "scales": _axes.scales,
        //    "toolTip" : _toolTip,
        //    "transitionProperties" : _transitionProperties,
        //    "plotName" : parameters.plotName
        //};
        //_plotManager.plotManagerInterface("drawSelected", plotParams);

    };
};
