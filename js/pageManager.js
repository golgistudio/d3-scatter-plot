
"use strict";


/**
 *
 * @type {{_chart: null, init: Function, resize: Function}}
 */
var pageManager = {

    _dataStoreManager : null,
    _chartCollection: [],
    _currentExperiment: null,
    _chartWidthFactor: 2,

    init: function () {

        this._dataStoreManager = dataStoreManager.getInstance();

        this._currentExperiment = "expA";

        var uuid = this._dataStoreManager.generateUUID();
        var experiment = new experimentManager(this._currentExperiment);
        var chart = this.createChart("chart1", experiment, uuid, experimentOriginalData, experimentPlotProperties, this._chartWidthFactor);
        var chartItem = {
            uuid: uuid,
            chart: chart,
            experiment: experiment,
            divId : "chart1"
        };
        this._chartCollection.push(chartItem);

        var experimentB = new experimentManager(this._currentExperiment);
        var uuid2 = this._dataStoreManager.generateUUID();
        var chart2 = this.createChart("chart2", experimentB, uuid2, experimentOriginalData, experimentPlotProperties2, this._chartWidthFactor);
        var chartItem2 = {
            uuid: uuid2,
            chart: chart2,
            experiment: experimentB,
            divId : "chart2"
        };
        this._chartCollection.push(chartItem2);

        d3.select(window).on('resize', this.resize.bind(this));

    },

    createChart: function(divID, experiment, uuid, data, plotProps, chartWidthFactor) {

        var axesProps = new axesProperties();
        var chartProps = new chartProperties();
        var labelProps = new labelProperties();
        var legendProps = new legendProperties();
        var toolTipProps = new toolTipProperties();
        var transitionProps = new transitionProperties();

        chartProps.height      = window.innerHeight - chartProps.heightMargin;
        chartProps.width       = (window.innerWidth /chartWidthFactor) - chartProps.widthMargin;
        chartProps.containerId = divID;

        toolTipProps.containerId = divID;
        toolTipProps.formatter   = experiment.experimentToolTipContent;

        var experimentParams = experiment.init(data);

        experiment.updateLabelProperties(labelProps);

        this._dataStoreManager.setData(uuid, dataStoreNames.zoomScaleFactors, experimentParams.zoomScaleFactors);
        this._dataStoreManager.setData(uuid, dataStoreNames.domains, experimentParams.domains);
        this._dataStoreManager.setData(uuid, dataStoreNames.axes, axesProps);
        this._dataStoreManager.setData(uuid, dataStoreNames.chart, chartProps);
        this._dataStoreManager.setData(uuid, dataStoreNames.labels, labelProps);
        this._dataStoreManager.setData(uuid, dataStoreNames.legend, legendProps);
        this._dataStoreManager.setData(uuid, dataStoreNames.toolTip, toolTipProps);
        this._dataStoreManager.setData(uuid, dataStoreNames.transition, transitionProps);
        this._dataStoreManager.setData(uuid, dataStoreNames.experiment, plotProps);

        var chart = new Chart(this._dataStoreManager, uuid, divID);

        var params = {
            experiment: experiment,
            data: data
        };
        chart.handleRequest("create", params);

        return chart;
    },

    getActiveExperiment : function() {
        return this._currentExperiment;
    },

    resize: function() {

        var params = {
            "height" : window.innerHeight,
            "width" : window.innerWidth/this._chartWidthFactor
        };

        var length = this._chartCollection.length;

        for (var i = 0; i < length; i++) {
            this._chartCollection[i].chart.handleRequest("resize", params);
        }
    },

    updatePoints: function(data, pageControl) {

        var length = this._chartCollection.length;

        for (var i = 0; i < length; i++) {

            var chartItem = pageControl._chartCollection[i];

            var experimentParams = chartItem.experiment.init(data);

            pageControl._dataStoreManager.setData(chartItem.uuid, dataStoreNames.zoomScaleFactors, experimentParams.zoomScaleFactors);
            pageControl._dataStoreManager.setData(chartItem.uuid, dataStoreNames.domains, experimentParams.domains);

            var params = {
                data : data,
                experiment: chartItem.experiment
            };

            chartItem.chart.handleRequest("update", params);
        }
    },

    setSymbol: function(symbol, pageControl, plotName, chartDiv) {

        var length = this._chartCollection.length;

        for (var i = 0; i < length; i++) {

            var chartItem = pageControl._chartCollection[i];

            if (chartItem.divId === chartDiv) {

                var plotProps = pageControl._dataStoreManager.getData(chartItem.uuid, dataStoreNames.experiment);
                plotProps.forEach( function (configItem) {
                    if (configItem.name === plotName) {
                        configItem.display.symbol = symbol;
                        switch (symbol) {
                            case "icon":
                                configItem.display.icon = "images/stopwatch-1-64x64.png";
                                configItem.display.width = 20;
                                configItem.display.height = 20;
                                break;
                            case "triangle" :
                                configItem.display.size = 150;
                                break;
                            case "circle" :
                                configItem.display.radius = 5;
                                break;
                        }

                    }
                });
                pageControl._dataStoreManager.setData(chartItem.uuid, dataStoreNames.experiment, plotProps);

                var params = {
                    "plotName": plotName
                };
                chartItem.chart.handleRequest("symbolUpdate", params);
            }
        }
    },

    /**
     *
     * @param color
     * @param pageControl
     * @param plotName
     */
    setSymbolColor: function(color, pageControl, plotName, chartDiv) {

        var length = this._chartCollection.length;

        for (var i = 0; i < length; i++) {

            var chartItem = pageControl._chartCollection[i];

            if (chartItem.divId === chartDiv) {

                var plotProps = pageControl._dataStoreManager.getData(chartItem.uuid, dataStoreNames.experiment);

                plotProps.forEach( function (configItem) {
                    if (configItem.name === plotName) {

                        configItem.display.fillColor = color;
                    }
                });
                pageControl._dataStoreManager.setData(chartItem.uuid, dataStoreNames.experiment, plotProps);


                var params = {
                    "plotName": plotName
                };
                chartItem.chart.handleRequest("styleUpdate", params);
            }
        }
    },

    /**
     *
     * @param color
     * @param pageControl
     * @param plotName
     */
    setPlotStyle: function(plotStyle, pageControl, plotName, chartDiv) {

        var length = this._chartCollection.length;

        for (var i = 0; i < length; i++) {

            var chartItem = pageControl._chartCollection[i];

            if (chartItem.divId === chartDiv) {

                var plotProps = pageControl._dataStoreManager.getData(chartItem.uuid, dataStoreNames.experiment);
                plotProps.forEach( function (configItem) {
                    if (configItem.name === plotName) {

                        configItem.display.plotStyle = plotStyle;
                    }
                });
                pageControl._dataStoreManager.setData(chartItem.uuid, dataStoreNames.experiment, plotProps);

                var params = {
                    "plotName": plotName
                };
                chartItem.chart.handleRequest("plotStyleUpdate", params);
            }
        }

    },

    /**
     *
     * @param color
     * @param pageControl
     * @param plotName
     */
    switchExperiment: function(experimentName, pageControl) {

        this._currentExperiment = experimentName;
        var data = null;
        var properties = null;
        var annotations = null;
        var dataManager = null;

        var olddiv = document.getElementById("chart1");

        while (olddiv.firstChild) {
            olddiv.removeChild(olddiv.firstChild);
        };

        var uuid = this._dataStoreManager.generateUUID();

        switch (this._currentExperiment) {
            case "expA" :
                data = experimentOriginalData;
                annotations = new experimentAnnotations();
                properties = experimentPlotProperties;
                dataManager = new experimentManager();
                break;
            case "expB" :
                data = experimentBOriginalData;
                annotations = new experimentBAnnotations();
                properties = experimentBPlotProperties;
                dataManager = new experimentManager();
                break;

        };

        chartProperties.height = window.innerHeight - chartProperties.heightMargin;
        chartProperties.width = window.innerWidth - chartProperties.widthMargin;
        chartProperties.containerId = "experiment";

        var pageParameters = {
            "chartProperties": chartProperties,
            "experiment": dataManager,
            "experimentAnnotations" : annotations,
            "data": data,
            "legend": drawLegend,
            "plotStyle": "scatter",
            "plotProperties": properties,
            "labelProperties": labelProperties,
            "legendProperties": legendProperties,
            "transitionProperties" : transitionProperties,
            "axesProperties" : axesProperties
        };


        this._experiment = pageParameters.experiment;
        this._chartProperties = pageParameters.chartProperties;
        this._plotProperties = pageParameters.plotProperties;
        this._data = pageParameters.data;

        toolTipProperties.containerId = "chart1";
        toolTipProperties.formatter = pageParameters.experimentAnnotations.experimentToolTipContent;
        var toolTipObject = new toolTip();
        toolTipObject.create(toolTipProperties);

        this._experiment.init(this._data);

        pageParameters.experimentAnnotations.updateLabelProperties(pageParameters.labelProperties);

        var chartParameters = {
            "chartProperties" : this._chartProperties,
            "data" : pageParameters.data,
            "toolTip" : toolTipObject,
            "dataMapper": this._experiment.mapData,
            "domains": this._experiment._dataDomains,
            "zoomScaleFactors" : this._experiment._zoomScaleFactors,
            "plotProperties": this._plotProperties,
            "labelProperties" : pageParameters.labelProperties,
            "legendProperties" : pageParameters.legendProperties,
            "transitionProperties" : pageParameters.transitionProperties,
            "axesProperties" : pageParameters.axesProperties,
            "dataStoreManager": this._dataStoreManager,

        };

        this._chart = new Chart(this._dataStoreManager, uuid);

        d3.select(window).on('resize', this.resize.bind(this));
        this._chart.handleRequest("create", chartParameters);
    }
};