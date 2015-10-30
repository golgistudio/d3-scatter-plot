
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

        var expInfoCollection = this.getExperimentInfo();

        for (var i=0; i < expInfoCollection.length; i++) {

            var expInfo = expInfoCollection[i];

            var chart = this.createChart(expInfo.divId, expInfo.experiment, expInfo.uuid, expInfo.data, expInfo.properties, this._chartWidthFactor);
            var chartItem = {
                uuid: expInfo.uuid,
                chart: chart,
                experiment: expInfo.experiment,
                divId : expInfo.divId
            };
            this._chartCollection.push(chartItem);

        }

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
                chartItem.chart.handleRequest("updatePlotStyle", params);
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
                chartItem.chart.handleRequest("updatePlotStyle", params);
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
                chartItem.chart.handleRequest("updatePlotStyle", params);
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
        var properties1 = null;
        var properties2 = null;
        var expManager1 = null;
        var expManager2 = null;

        var length = this._chartCollection.length;

        for (var i = 0; i < length; i++) {
            var chartItem = pageControl._chartCollection[i];
            var olddiv = document.getElementById(chartItem.divId);

            while (olddiv.firstChild) {
                olddiv.removeChild(olddiv.firstChild);
            }
        }

        var expInfoCollection = this.getExperimentInfo();

        for (var i=0; i < expInfoCollection.length; i++) {

            var expInfo = expInfoCollection[i];

            var chart = this.createChart(expInfo.divId, expInfo.experiment, expInfo.uuid, expInfo.data, expInfo.properties, this._chartWidthFactor);
            var chartItem = {
                uuid: expInfo.uuid,
                chart: chart,
                experiment: expInfo.experiment,
                divId : expInfo.divId
            };
            this._chartCollection.push(chartItem);

        }

        d3.select(window).on('resize', this.resize.bind(this));

    },

    getExperimentInfo: function() {
        var expInfoCollection = [];

        var expInfoItem1 = null;
        var expInfoItem2 = null;

        switch (this._currentExperiment) {
            case "expA" :
                expInfoItem1 = {
                    divId:      "chart1",
                    properties: experimentPlotProperties,
                    experiment: new experimentManager(),
                    uuid:       this._dataStoreManager.generateUUID(),
                    data:       experimentOriginalData

                };

                expInfoItem2 = {
                    divId:      "chart2",
                    properties: experimentPlotProperties2,
                    experiment: new experimentManager2(),
                    uuid:       this._dataStoreManager.generateUUID(),
                    data:       experimentOriginalData
                };
                break;
            case "expB" :
                expInfoItem1 = {
                    divId:      "chart1",
                    properties: experimentBPlotProperties,
                    experiment: new experimentBManager(),
                    uuid:       this._dataStoreManager.generateUUID(),
                    data:       experimentBOriginalData

                };

                expInfoItem2 = {
                    divId:      "chart2",
                    properties: experimentBPlotProperties2,
                    experiment: new experimentBManager2(),
                    uuid:       this._dataStoreManager.generateUUID(),
                    data:       experimentBOriginalData
                };
                break;
        }

        expInfoCollection.push(expInfoItem1);
        expInfoCollection.push(expInfoItem2);

        return expInfoCollection;
    }
};