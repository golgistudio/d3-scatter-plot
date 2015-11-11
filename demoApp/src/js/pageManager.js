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


/*global Chart:false */

/*global ExperimentManager:false */
/*global experimentOriginalData:false */
/*global experimentPlotProperties:false */
/*global experimentPlotProperties2:false */
/*global ExperimentManager2:false */

/*global experimentBPlotProperties:false */
/*global ExperimentBManager:false */
/*global experimentBOriginalData:false */
/*global experimentBPlotProperties2:false */
/*global ExperimentBManager2:false */

/*global module:false */
/*global require:false */



import {dataStoreManager} from './dataStore/dataStoreManager.js';
import {dataStoreNames} from './dataStore/dataStoreNames.js';
import {AxesProperties} from './dataStore/properties/axesProperties.js';
import {ChartProperties} from './dataStore/properties/chartProperties.js';
import {LabelProperties} from './dataStore/properties/labelProperties.js';
import {LegendProperties} from './dataStore/properties/legendProperties.js';
import {ToolTipProperties } from './dataStore/properties/toolTipProperties.js';
import {TransitionProperties} from './dataStore/properties/transitionProperties.js';

import {Chart} from './chart/chart.js';

import {ExperimentManager} from './experiments/experimentResults/experimentManager.js';
import {experimentOriginalData} from './experiments/experimentResults/data/experimentOriginalData.js';
import {experimentPlotProperties} from './experiments/experimentResults/experimentPlotProperties.js';
import {experimentPlotProperties2} from './experiments/experimentResults/experimentPlotProperties2.js';
import {ExperimentManager2} from './experiments/experimentResults/experimentManager2.js';

import {ExperimentBManager} from './experiments/experimentB/experimentBManager.js';
import {experimentBOriginalData} from './experiments/experimentB/data/experimentBOriginalData.js';
import {experimentBPlotProperties} from './experiments/experimentB/experimentBPlotProperties.js';
import {experimentBPlotProperties2} from './experiments/experimentB/experimentBPlotProperties2.js';
import {ExperimentBManager2} from './experiments/experimentB/experimentBManager2.js';


/**
 *
 * @type {{_dataStoreManager: null, _chartCollection: Array, _currentExperiment: null, getDimensions: pageManager.getDimensions, init: pageManager.init, createChart: pageManager.createChart, getActiveExperiment: pageManager.getActiveExperiment, resize: pageManager.resize, updatePoints: pageManager.updatePoints, updatePlotSymbol: pageManager.updatePlotSymbol, setSymbol: pageManager.setSymbol, setSymbolColor: pageManager.setSymbolColor, setPlotStyle: pageManager.setPlotStyle, switchExperiment: pageManager.switchExperiment, getExperimentInfo: pageManager.getExperimentInfo}}
 */
export var pageManager = {

    _dataStoreManager : null,
    _chartCollection: [],
    _currentExperiment: null,

    updateDimensions: function(chartProps) {
        "use strict";

        var chartWidthFactor = 1;
        var chartHeightFactor = 1;

        if (window.matchMedia("(orientation: portrait)").matches) {
            chartWidthFactor = 1;
            chartHeightFactor = 2;
        } else {
            chartWidthFactor = 2;
            chartHeightFactor = 1;
        }

        chartProps.height      = (window.innerHeight/chartHeightFactor) - chartProps.heightMargin;
        chartProps.width       = (window.innerWidth /chartWidthFactor) - chartProps.widthMargin;

        chartProps.width  = chartProps.width - chartProps.margin.left - chartProps.margin.right;
        chartProps.height = chartProps.height - chartProps.margin.top - chartProps.margin.bottom;
    },

    init: function () {
        "use strict";

        this._dataStoreManager = dataStoreManager.getInstance();

        this._currentExperiment = "expA";

        var expInfoCollection = this.getExperimentInfo();

        for (var i=0; i < expInfoCollection.length; i++) {

            var expInfo = expInfoCollection[i];

            var chart = this.createChart(expInfo.divId, expInfo.experiment, expInfo.uuid, expInfo.data, expInfo.properties);
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

    createChart: function(divID, experiment, uuid, data, plotProps) {
        "use strict";

        var axesProps = new AxesProperties();
        var chartProps = new ChartProperties();
        var labelProps = new LabelProperties();
        var legendProps = new LegendProperties();
        var toolTipProps = new ToolTipProperties();
        var transitionProps = new TransitionProperties();

        this.updateDimensions(chartProps);

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

        var length = this._chartCollection.length;

        for (var i = 0; i < length; i++) {

            var uuid = this._chartCollection[i].uuid;
            var chartProps = this._dataStoreManager.getData(uuid, dataStoreNames.chart);
            this.updateDimensions(chartProps);
            this._dataStoreManager.setData(uuid, dataStoreNames.chart, chartProps);

            this._chartCollection[i].chart.handleRequest("resize", null);
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

        var sizeFactors = this.getDimensions();

        var expInfoCollection = this.getExperimentInfo();

        for (var jjj=0; jjj < expInfoCollection.length; jjj++) {

            var expInfo = expInfoCollection[jjj];

            var chart = this.createChart(expInfo.divId, expInfo.experiment, expInfo.uuid, expInfo.data, expInfo.properties, sizeFactors.chartWidthFactor);
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



