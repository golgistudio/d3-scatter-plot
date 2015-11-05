/**
 * @file
 */
/*global window:false */
/*global document:false */

/*global d3:false */

/*global dataStoreManager:false */
/*global dataStoreNames:false */

/*global AxesProperties:false */
/*global ChartProperties:false */
/*global LabelProperties:false */
/*global LegendProperties:false */
/*global ToolTipProperties:false */
/*global TransitionProperties:false */

/*global experimentPlotProperties:false */
/*global Chart:false */
/*global ExperimentManager:false */
/*global experimentOriginalData:false */
/*global experimentPlotProperties2:false */
/*global ExperimentManager2:false */

/*global experimentBPlotProperties:false */
/*global ExperimentBManager:false */
/*global experimentBOriginalData:false */
/*global experimentBPlotProperties2:false */
/*global ExperimentBManager2:false */

/**
 *
 * @type {{_dataStoreManager: null, _chartCollection: Array, _currentExperiment: null, _chartWidthFactor: number, init: Function, createChart: Function, getActiveExperiment: Function, resize: Function, updatePoints: Function, setSymbol: Function, setSymbolColor: Function, setPlotStyle: Function, switchExperiment: Function, getExperimentInfo: Function}}
 */
var pageManager = {

    _dataStoreManager : null,
    _chartCollection: [],
    _currentExperiment: null,
    _chartWidthFactor: 2,
    _chartHeightFactor:1,

    init: function () {
        "use strict";

        this._dataStoreManager = dataStoreManager.getInstance();

        this._currentExperiment = "expA";

        if (window.innerWidth <= 700 && window.matchMedia("(orientation: portrait)").matches) {
            this._chartWidthFactor = 1;
        } else {
            this._chartWidthFactor = 2;
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

    createChart: function(divID, experiment, uuid, data, plotProps, chartWidthFactor) {
        "use strict";

        var axesProps = new AxesProperties();
        var chartProps = new ChartProperties();
        var labelProps = new LabelProperties();
        var legendProps = new LegendProperties();
        var toolTipProps = new ToolTipProperties();
        var transitionProps = new TransitionProperties();

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
        "use strict";
        return this._currentExperiment;
    },

    resize: function() {
        "use strict";

        if (window.innerWidth <= 700 && window.matchMedia("(orientation: portrait)").matches) {
            this._chartWidthFactor = 1;
        } else {
            this._chartWidthFactor = 2;
        }

        var params = {
            "height" : window.innerHeight / this._chartHeightFactor,
            "width" : window.innerWidth/this._chartWidthFactor
        };

        var length = this._chartCollection.length;

        for (var i = 0; i < length; i++) {
            this._chartCollection[i].chart.handleRequest("resize", params);
        }
    },

    updatePoints: function(data, pageControl) {
        "use strict";

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

    /**
     *
     * @param configItem
     * @param symbol
     */
    updatePlotSymbol: function (configItem, symbol) {
        "use strict";

        configItem.display.symbol = symbol;
        switch (symbol) {
            case "icon":
                configItem.display.icon   = "images/stopwatch-1-64x64.png";
                configItem.display.width  = 20;
                configItem.display.height = 20;
                break;
            case "triangle" :
                configItem.display.size = 150;
                break;
            case "circle" :
                configItem.display.radius = 5;
                break;
        }
    },

    /**
     *
     * @param symbol
     * @param pageControl
     * @param plotName
     * @param chartDiv
     */

    setSymbol: function(symbol, pageControl, plotName, chartDiv) {
        "use strict";

        var length = this._chartCollection.length;

        for (var i = 0; i < length; i++) {

            var chartItem = pageControl._chartCollection[i];

            if (chartItem.divId === chartDiv) {

                var plotProps = pageControl._dataStoreManager.getData(chartItem.uuid, dataStoreNames.experiment);
                var len = plotProps.length;

                for (var j = 0; j < len; j++) {
                    var configItem = plotProps[j];
                    if (configItem.name === plotName) {
                        this.updatePlotSymbol(configItem, symbol);
                    }
                }
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
     * @param chartDiv
     */
    setSymbolColor: function(color, pageControl, plotName, chartDiv) {
        "use strict";

        var length = this._chartCollection.length;

        for (var i = 0; i < length; i++) {

            var chartItem = pageControl._chartCollection[i];

            if (chartItem.divId === chartDiv) {

                var plotProps = pageControl._dataStoreManager.getData(chartItem.uuid, dataStoreNames.experiment);
                var len = plotProps.length;

                for (var j = 0; j < len; j++) {
                    var configItem = plotProps[j];
                    if (configItem.name === plotName) {
                        configItem.display.fillColor = color;
                    }
                }

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
     * @param plotStyle
     * @param pageControl
     * @param plotName
     * @param chartDiv
     */
    setPlotStyle: function(plotStyle, pageControl, plotName, chartDiv) {
        "use strict";

        var length = this._chartCollection.length;

        for (var i = 0; i < length; i++) {

            var chartItem = pageControl._chartCollection[i];

            if (chartItem.divId === chartDiv) {

                var plotProps = pageControl._dataStoreManager.getData(chartItem.uuid, dataStoreNames.experiment);

                var len = plotProps.length;
                for (var j = 0; j < len; j++) {
                    var configItem = plotProps[j];
                    if (configItem.name === plotName) {
                        configItem.display.plotStyle = plotStyle;
                    }
                }

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
     * @param experimentName
     * @param pageControl
     */
    switchExperiment: function(experimentName, pageControl) {
        "use strict";

        this._currentExperiment = experimentName;

        var length = this._chartCollection.length;

        for (var iii = 0; iii < length; iii++) {
            var chartItem = pageControl._chartCollection[iii];
            var olddiv = document.getElementById(chartItem.divId);

            while (olddiv.firstChild) {
                olddiv.removeChild(olddiv.firstChild);
            }
        }

        var expInfoCollection = this.getExperimentInfo();

        for (var jjj=0; jjj < expInfoCollection.length; jjj++) {

            var expInfo = expInfoCollection[jjj];

            var chart = this.createChart(expInfo.divId, expInfo.experiment, expInfo.uuid, expInfo.data, expInfo.properties, this._chartWidthFactor);
            var item = {
                uuid: expInfo.uuid,
                chart: chart,
                experiment: expInfo.experiment,
                divId : expInfo.divId
            };
            this._chartCollection.push(item);

        }

        d3.select(window).on('resize', this.resize.bind(this));

    },

    getExperimentInfo: function() {
        "use strict";

        var expInfoCollection = [];

        var expInfoItem1 = null;
        var expInfoItem2 = null;

        switch (this._currentExperiment) {
            case "expA" :
                expInfoItem1 = {
                    divId:      "chart1",
                    properties: experimentPlotProperties,
                    experiment: new ExperimentManager(),
                    uuid:       this._dataStoreManager.generateUUID(),
                    data:       experimentOriginalData

                };

                expInfoItem2 = {
                    divId:      "chart2",
                    properties: experimentPlotProperties2,
                    experiment: new ExperimentManager2(),
                    uuid:       this._dataStoreManager.generateUUID(),
                    data:       experimentOriginalData
                };
                break;
            case "expB" :
                expInfoItem1 = {
                    divId:      "chart1",
                    properties: experimentBPlotProperties,
                    experiment: new ExperimentBManager(),
                    uuid:       this._dataStoreManager.generateUUID(),
                    data:       experimentBOriginalData

                };

                expInfoItem2 = {
                    divId:      "chart2",
                    properties: experimentBPlotProperties2,
                    experiment: new ExperimentBManager2(),
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
