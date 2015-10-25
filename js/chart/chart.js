"use strict";

/**
 *
 * @constructor
 */
function Chart() {
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
        _axes             = null,
        _transitionProperties = null,
        _zoomScaleFactors = null,
        _that             = null;

    var _axesManager = null;



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
        };

    };

    /**
     *
     * @param chartParameters
     */
    function create (chartParameters) {

        _that = this;

        _axesManager = new axesManager();

        setChartProperties(chartParameters);
        initializeChartSize(_totalWidth, _totalHeight, _margin);
        _axes = _axesManager.createAxes(_domains, _width, _height);
        _zoomListener = createZoomListener(_axes, _that, _zoomScaleFactors );
        var svg  = initializeChart(_data, _dataMapper, _width, _height, _margin, _containerID, _zoomListener);
        svg      = _axesManager.drawAxes(svg, _axes, _width, _height);
        drawPlots(_data, _plotProperties, svg, _axes.scales, _toolTip, _plotRenderer, _transitionProperties);
        drawChartLabels(svg, _labelProperties, _width, _height, _margin);
        drawLegend(svg, _width, _height, _legendProperties);

    };

    function createZoomListener(axes, that, zoomScaleFactors) {
       var zoomListener =  d3.behavior.zoom()
            .y(axes.scales.yScale)
            .scaleExtent([zoomScaleFactors.yZoomFactors.yMin, zoomScaleFactors.yZoomFactors.yMax])
            .on("zoom", function () {
                zoomHandler(that);
            });
        zoomListener.y(axes.scales.yScale);

        return zoomListener;
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
        _plotRenderer     = chartParameters.plotRenderer;
        _data             = chartParameters.data;
        _containerID      = chartParameters.chartProperties.containerID;
        _labelProperties  = chartParameters.labelProperties;
        _legendProperties = chartParameters.legendProperties;
        _transitionProperties = chartParameters.transitionProperties;
        _zoomScaleFactors = chartParameters.zoomScaleFactors;
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
            .on("click", stopped, true)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.selectAll("g.node").data(data, function (d) {
            return mapDataCallback(d);
        });

        return svg;
    };

    function zoomPlots  (data, plotProperties, svg, scales,  plotRenderer) {


        plotProperties.forEach( function (configItem) {
            var params = {
                "data": data,
                "svg": svg,
                "plotProp": configItem,
                "scales": scales
            };

            plotRenderer.plotInterface("zoom",params);
        });
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
    function drawPlots  (data, plotProperties, svg, scales, tooltip, plotRenderer, transitionProperties) {


        plotProperties.forEach( function (configItem) {
            var params = {
                "data": data,
                "svg": svg,
                "plotProp": configItem,
                "scales": scales,
                "toolTip": tooltip,
                "transitionProperties": transitionProperties
            };

            plotRenderer.plotInterface("render",params);
        });
    };

    function drawSelectedPlot  (data, plotProperties, svg, scales, tooltip, plotRenderer, plotName, transitionProperties) {

        plotProperties.forEach( function (configItem) {
            if (configItem.name === plotName) {
                var params = {
                    "data":     data,
                    "svg":      svg,
                    "plotProp": configItem,
                    "scales":   scales,
                    "toolTip":  tooltip,
                    "transitionProperties": transitionProperties
                };
                svg.selectAll("." + configItem.plotClassName).data([]).exit().remove();
                plotRenderer.plotInterface("render", params);
            }
        });
    };

    function updatePlots (data, plotProperties, svg, scales, tooltip, plotRenderer, transitionProperties) {
        "use strict";

        plotProperties.forEach( function (itemProperties) {
            var params = {
                "data": data,
                "svg": svg,
                "plotProp": itemProperties,
                "scales": scales,
                "toolTip": tooltip,
                "transitionProperties": transitionProperties
            };

            plotRenderer.plotInterface("update",params);

        });

    };

    function updateSelectedPlot (data, plotProperties, svg, scales, tooltip, plotRenderer, plotName, transitionProperties) {
        "use strict";

        plotProperties.forEach( function (itemProperties) {

            if (itemProperties.name === plotName) {
                var params = {
                    "data":     data,
                    "svg":      svg,
                    "plotProp": itemProperties,
                    "scales":   scales,
                    "toolTip":  tooltip,
                    "transitionProperties": transitionProperties
                };

                plotRenderer.plotInterface("update", params);
            }

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
        _axes = _axesManager.createAxes(_domains, _width, _height);
        _zoomListener = createZoomListener(_axes, _that, _zoomScaleFactors );
        var svg  = initializeChart(_data, _dataMapper, _width, _height, _margin, _containerID, _zoomListener);
        svg      = _axesManager.drawAxes(svg, _axes, _width, _height);
        drawPlots(_data, _plotProperties, svg, _axes.scales, _toolTip, _plotRenderer, _transitionProperties);
        drawChartLabels(svg, _labelProperties, _width, _height, _margin);
        drawLegend(svg, _width, _height, _legendProperties);
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
        _axesManager.updateAxes(svg, zoomAxes);
        zoomPlots(_data, _plotProperties, svg, _axes.scales,  _plotRenderer);

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
        _axes = _axesManager.createAxes(_domains, _width, _height);
        _zoomListener = createZoomListener(_axes, _that, _zoomScaleFactors );
        svg.call(_zoomListener);
        updatePlots(_data, _plotProperties, svg, _axes.scales, _toolTip, _plotRenderer, _transitionProperties);
        _axesManager.updateAxes(svg, _axes);

    };

    function styleUpdate(parameters) {

        _plotProperties = parameters.plotProperties;
        _data = parameters.data;
        _domains = parameters.domains;

        var svg = d3.select("#" + _containerID).select("g");
        updateSelectedPlot(_data, _plotProperties, svg, _axes.scales, _toolTip, _plotRenderer, parameters.plotName, _transitionProperties);

    };

    function symbolUpdate(parameters) {

        _plotProperties = parameters.plotProperties;
        _data = parameters.data;
        _domains = parameters.domains;
        var dataMapper = _dataMapper;

        // Update domain
        // Update Axis
        // Update Plots

        var svg = d3.select("#" + _containerID).select("g");

        drawSelectedPlot(_data, _plotProperties, svg, _axes.scales, _toolTip, _plotRenderer, parameters.plotName, _transitionProperties);

    };

};
