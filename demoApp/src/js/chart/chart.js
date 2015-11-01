"use strict";

/**
 *
 * @constructor
 */
function Chart(dataManager, uuid, containerId) {

    var _dataStoreManager =  dataManager;
    var _uuid = uuid;
    var _that = this;
    var _containerId = containerId;

    var _axesManager = null;
    var _plotManager = null;
    var _toolTipManager = null;
    var _experiment =  null;
    var _data = null;

    var _chartComponents = null;

    this.handleRequest = function (request, parameters) {

        switch(request) {
            case "create" : create(parameters);
                break;
            case "update" : updateData(parameters);
                break;
            case "resize" : resize(parameters);
                break;
            case "updatePlotStyle" : updatePlotStyle(parameters);
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

        var transitionProps = _dataStoreManager.getData(_uuid, dataStoreNames.transition);
        var labelProps = _dataStoreManager.getData(_uuid, dataStoreNames.labels);
        var legendProps = _dataStoreManager.getData(_uuid, dataStoreNames.legend);

        var legendData = [];

        plotProps.forEach(function (configItem) {
            var params = {
                "plotStyle" : configItem.display.plotStyle
            }
            configItem.display.plotRenderer = _plotManager.plotManagerInterface("getPlotRenderer",params);

            var legendDataItem = {
                "name" : configItem.name,
                "plotClassName" : configItem.plotClassName,
                "color" : configItem.display.fillColor
            };

            legendData.push(legendDataItem);
        });

        _dataStoreManager.setData(_uuid, dataStoreNames.experiment, plotProps);

        initializeChartSize(chartProps);
        _dataStoreManager.setData(_uuid, dataStoreNames.chart, chartProps);

        _axesManager.createAxes(_experiment._dataDomains, chartProps.width, chartProps.height);
        _chartComponents  = initializeChart(_data, _experiment, chartProps, _that, _axesManager);
        _axesManager.drawAxes(_chartComponents.svg);

        var axes = _dataStoreManager.getData(_uuid, dataStoreNames.axesValues);

        var plotParams = {
            "data" : _data,
            "plotProperties" : plotProps,
            "svg": _chartComponents.chartBody,
            "scales": axes.scales,
            "toolTip" : _toolTipManager,
            "transitionProperties" : transitionProps
        };
        _plotManager.plotManagerInterface("draw", plotParams);
        drawChartLabels(_chartComponents.svg, labelProps, chartProps.width, chartProps.height, chartProps.margin);

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
     * @param containerId
     * @returns {*}
     */
    function initializeChart (data, experiment, chartProps, that, axesManager) {

        var zoomListener = axesManager.createZoomListener(that, zoomHandler);

        var svg = d3.select("#" + _containerId).append("svg")
            .attr("width", chartProps.width + chartProps.margin.left + chartProps.margin.right)
            .attr("height", chartProps.height + chartProps.margin.top + chartProps.margin.bottom)
            .attr("style", "outline=thin solid lightgrey;")
            .append("g")
            .attr("transform", "translate(" + chartProps.margin.left + "," + chartProps.margin.top + ")");

        var clip = svg.append("defs").append("svg:clipPath")
            .attr("id", "clip")
            .append("svg:rect")
            .attr("id", "clip-rect")
            .attr("x", "0")
            .attr("y", "0")
            .attr("width", chartProps.width)
            .attr("height", chartProps.height);

        var chartBody = svg.append("g")
            .attr("clip-path", "url(#clip)")
            .call(zoomListener)
            .on("click", stopped, true);

        var rect = chartBody.append('svg:rect')
            .attr('width', chartProps.width)
            .attr('height', chartProps.height)
            .attr('fill', 'white');

        chartBody.selectAll("g.node").data(data, function (d) {
            return experiment.mapData(d);
        });

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
        var transitionProps = _dataStoreManager.getData(_uuid, dataStoreNames.transition);
        var labelProps = _dataStoreManager.getData(_uuid, dataStoreNames.labels);
        var legendProps = _dataStoreManager.getData(_uuid, dataStoreNames.legend);

        d3.select("#" + _containerId).select("svg").remove();

        chartProps.height = params.height - chartProps.heightMargin;
        chartProps.width  = params.width - chartProps.widthMargin;

        initializeChartSize(chartProps);
        _dataStoreManager.setData(_uuid, dataStoreNames.chart, chartProps);

        _axesManager.createAxes(_experiment._dataDomains, chartProps.width , chartProps.height);

        var axes = _dataStoreManager.getData(_uuid, dataStoreNames.axesValues);

        _chartComponents  = initializeChart(_data, _experiment, chartProps, _that, _axesManager);
        _axesManager.drawAxes(_chartComponents.svg);

        var plotParams = {
            "data" : _data,
            "plotProperties" : plotProps,
            "svg": _chartComponents.chartBody,
            "scales": axes.scales,
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

        var plotProps = _dataStoreManager.getData(_uuid, dataStoreNames.experiment);
        var axes = _dataStoreManager.getData(_uuid, dataStoreNames.axesValues);

        var tx, ty;
        tx = d3.event.translate[0];
        ty = d3.event.translate[1];

        _axesManager.translate([tx, ty]);

        var svg = d3.select("#" + _containerId).select("svg");

        var zoomAxes = {yAxis: axes.yAxis};
        _axesManager.updateAxes(svg, zoomAxes);

        var plotParams = {
            "data" : _data,
            "plotProperties" : plotProps,
            "svg": svg,
            "scales": axes.scales
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

        var plotProps = _dataStoreManager.getData(_uuid, dataStoreNames.experiment);
        var transitionProps = _dataStoreManager.getData(_uuid, dataStoreNames.transition);

        var svg = d3.select("#" + _containerId).select("g");

        svg.selectAll("g.node").data(_data, function (d) {
            return parameters.experiment.mapData(d);
        });

        _axesManager.createAxes();

        var axes = _dataStoreManager.getData(_uuid, dataStoreNames.axesValues);

        var zoomListener = _axesManager.createZoomListener(_that, zoomHandler );
        svg.call(zoomListener);

        var plotParams = {
            "data" : _data,
            "plotProperties" : plotProps,
            "svg": _chartComponents.chartBody,
            "scales": axes.scales,
            "toolTip" : _toolTipManager,
            "transitionProperties" : transitionProps
        };
        _plotManager.plotManagerInterface("update", plotParams);
        _axesManager.updateAxes(svg);

    };

    function updatePlotStyle(parameters) {

        var plotProps = _dataStoreManager.getData(_uuid, dataStoreNames.experiment);
        var transitionProps = _dataStoreManager.getData(_uuid, dataStoreNames.transition);
        var axesValues = _dataStoreManager.getData(_uuid, dataStoreNames.axesValues);
        var legendProps = _dataStoreManager.getData(_uuid, dataStoreNames.legend);

        plotProps.forEach( function (configItem) {
            if (configItem.name === parameters.plotName) {
                configItem.display.plotRenderer = _plotManager.plotManagerInterface("getPlotRenderer",{plotStyle: configItem.display.plotStyle});
            }
        });

        var plotParams = {
            "data" : _data,
            "plotProperties" : plotProps,
            "svg": _chartComponents.chartBody,
            "scales": axesValues.scales,
            "toolTip" : _toolTipManager,
            "transitionProperties" : transitionProps,
            "plotName" : parameters.plotName
        };
        _plotManager.plotManagerInterface("drawSelected", plotParams);

        var legendData = [];

        plotProps.forEach(function(item) {

            var legendDataItem = {
                "name" : item.name,
                "plotClassName" : item.plotClassName,
                "color" : item.display.fillColor
            };
            legendData.push(legendDataItem);
        });

        updateLegend(_chartComponents.svg, legendProps, legendData);
    };
};
