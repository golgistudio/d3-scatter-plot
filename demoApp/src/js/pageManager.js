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


import {EventMediator} from './events/eventMediator.js';
import {eventChannelNames} from './events/eventChannelNames.js';

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
 * @constructor
 */
export function PageManager() {
    "use strict";

    var _dataStoreManager = dataStoreManager.getInstance();
    var _chartCollection = [];
    var _currentExperiment = null;
    var _uuid =  null;

    var _experiments = {

        expA: {
            experimentManager: ExperimentManager,
            experimentManager2: ExperimentManager2,
            experimentOriginalData: experimentOriginalData,
            experimentPlotProperties: experimentPlotProperties,
            experimentPlotProperties2: experimentPlotProperties2
        },
        expB: {
            experimentManager: ExperimentBManager,
            experimentManager2: ExperimentBManager2,
            experimentOriginalData: experimentBOriginalData,
            experimentPlotProperties: experimentBPlotProperties,
            experimentPlotProperties2: experimentBPlotProperties2
        }

    };


    /**
     *
     * @param chartProps
     */
    function updateDimensions(chartProps) {

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
    }

    /**
     *
     * @param divID
     * @param experiment
     * @param uuid
     * @param data
     * @param plotProps
     * @returns {Chart}
     */

    function createChart (divID, experiment, uuid, data, plotProps) {


        var axesProps = new AxesProperties();
        var chartProps = new ChartProperties();
        var labelProps = new LabelProperties();
        var legendProps = new LegendProperties();
        var toolTipProps = new ToolTipProperties();
        var transitionProps = new TransitionProperties();

        updateDimensions(chartProps);

        chartProps.containerId = divID;

        toolTipProps.containerId = divID;
        toolTipProps.formatter   = experiment.experimentToolTipContent;

        var experimentParams = experiment.init(data);

        experiment.updateLabelProperties(labelProps);

        _dataStoreManager.setData(uuid, dataStoreNames.zoomScaleFactors, experimentParams.zoomScaleFactors);
        _dataStoreManager.setData(uuid, dataStoreNames.domains, experimentParams.domains);
        _dataStoreManager.setData(uuid, dataStoreNames.axes, axesProps);
        _dataStoreManager.setData(uuid, dataStoreNames.chart, chartProps);
        _dataStoreManager.setData(uuid, dataStoreNames.labels, labelProps);
        _dataStoreManager.setData(uuid, dataStoreNames.legend, legendProps);
        _dataStoreManager.setData(uuid, dataStoreNames.toolTip, toolTipProps);
        _dataStoreManager.setData(uuid, dataStoreNames.transition, transitionProps);
        _dataStoreManager.setData(uuid, dataStoreNames.experiment, plotProps);

        var chart = new Chart(_dataStoreManager, uuid, divID);

        var params = {
            experiment: experiment,
            data: data
        };
        chart.handleRequest("create", params);

        return chart;
    }

    /**
     *
     */
     function resize() {

        var length = _chartCollection.length;

        for (var i = 0; i < length; i++) {

            var uuid = _chartCollection[i].uuid;
            var chartProps = _dataStoreManager.getData(uuid, dataStoreNames.chart);
            updateDimensions(chartProps);
            _dataStoreManager.setData(uuid, dataStoreNames.chart, chartProps);

            _chartCollection[i].chart.handleRequest("resize", null);
        }
    }


    /**
     *
     * @param data
     */
    function handleDataChange(params) {


        var length = _chartCollection.length;

        for (var i = 0; i < length; i++) {

            var chartItem = _chartCollection[i];

            var experimentParams = chartItem.experiment.init(params.data);

            _dataStoreManager.setData(chartItem.uuid, dataStoreNames.zoomScaleFactors, experimentParams.zoomScaleFactors);
            _dataStoreManager.setData(chartItem.uuid, dataStoreNames.domains, experimentParams.domains);

            var plotParams = {
                data : params.data,
                experiment: chartItem.experiment
            };

            chartItem.chart.handleRequest("update", plotParams);
        }
    }

    /**
     *
     * @param configItem
     * @param symbol
     */
    function updatePlotSymbol(configItem, symbol) {

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
            case "square":
                configItem.display.width  = 20;
                configItem.display.height = 20;
                break;
        }
    }


    /**
     *
     * @param params
     */
    function handleSymbolChange(params) {


        var length = _chartCollection.length;

        for (var i = 0; i < length; i++) {

            var chartItem = _chartCollection[i];

            if (chartItem.divId === params.chartDiv) {

                var plotProps = _dataStoreManager.getData(chartItem.uuid, dataStoreNames.experiment);
                var len = plotProps.length;

                for (var j = 0; j < len; j++) {
                    var configItem = plotProps[j];
                    if (configItem.name === params.plotName) {
                        updatePlotSymbol(configItem, params.symbol);
                    }
                }
                _dataStoreManager.setData(chartItem.uuid, dataStoreNames.experiment, plotProps);

                var plotParams = {
                    "plotName": params.plotName
                };
                chartItem.chart.handleRequest("updatePlotStyle", plotParams);
            }
        }
    }

    /**
     *
     * @param params
     */
    function handleColorChange(params) {

        var length = _chartCollection.length;

        for (var i = 0; i < length; i++) {

            var chartItem = _chartCollection[i];

            if (chartItem.divId === params.chartDiv) {

                var plotProps = _dataStoreManager.getData(chartItem.uuid, dataStoreNames.experiment);
                var len = plotProps.length;

                for (var j = 0; j < len; j++) {
                    var configItem = plotProps[j];
                    if (configItem.name === params.plotName) {
                        configItem.display.fillColor = params.color;
                    }
                }

                _dataStoreManager.setData(chartItem.uuid, dataStoreNames.experiment, plotProps);

                var plotParams = {
                    "plotName": params.plotName
                };
                chartItem.chart.handleRequest("updatePlotStyle", plotParams);
            }
        }
    }


     function handlePlotStyleChange(params) {


        var length = _chartCollection.length;

        for (var i = 0; i < length; i++) {

            var chartItem = _chartCollection[i];

            if (chartItem.divId === params.chartDiv) {

                var plotProps = _dataStoreManager.getData(chartItem.uuid, dataStoreNames.experiment);

                var len = plotProps.length;
                for (var j = 0; j < len; j++) {
                    var configItem = plotProps[j];
                    if (configItem.name === params.plotName) {
                        configItem.display.plotStyle = params.plotStyle;
                    }
                }

                _dataStoreManager.setData(chartItem.uuid, dataStoreNames.experiment, plotProps);

                var plotParams = {
                    "plotName": params.plotName
                };
                chartItem.chart.handleRequest("updatePlotStyle", plotParams);
            }
        }

    }

    /**
     *
     * @returns {Array}
     */
    function getExperimentInfo() {

        var expInfoCollection = [];

        var expInfoItem1 = null;
        var expInfoItem2 = null;

        switch (_currentExperiment) {
            case "expA" :
                expInfoItem1 = {
                    divId:      "chart1",
                    properties: _experiments.expA.experimentPlotProperties,
                    experiment: new _experiments.expA.experimentManager(),
                    uuid:       _dataStoreManager.generateUUID(),
                    data:       _experiments.expA.experimentOriginalData

                };

                expInfoItem2 = {
                    divId:      "chart2",
                    properties: _experiments.expA.experimentPlotProperties2,
                    experiment: new _experiments.expA.experimentManager2(),
                    uuid:       _dataStoreManager.generateUUID(),
                    data:       _experiments.expA.experimentOriginalData
                };
                break;
            case "expB" :
                expInfoItem1 = {
                    divId:      "chart1",
                    properties: _experiments.expB.experimentPlotProperties,
                    experiment: new _experiments.expB.experimentManager(),
                    uuid:       _dataStoreManager.generateUUID(),
                    data:       _experiments.expB.experimentOriginalData

                };

                expInfoItem2 = {
                    divId:      "chart2",
                    properties: _experiments.expB.experimentPlotProperties2,
                    experiment: new _experiments.expB.experimentManager2(),
                    uuid:       _dataStoreManager.generateUUID(),
                    data:       _experiments.expB.experimentOriginalData
                };
                break;
        }

        expInfoCollection.push(expInfoItem1);
        expInfoCollection.push(expInfoItem2);

        return expInfoCollection;
    }

    /**
     *
     */
    function drawCharts() {

        var expInfoCollection = getExperimentInfo();

        for (var jjj=0; jjj < expInfoCollection.length; jjj++) {

            var expInfo = expInfoCollection[jjj];

            var chart = createChart(expInfo.divId, expInfo.experiment, expInfo.uuid, expInfo.data, expInfo.properties);
            var item = {
                uuid: expInfo.uuid,
                chart: chart,
                experiment: expInfo.experiment,
                divId : expInfo.divId
            };
            _chartCollection.push(item);

        }

        /* jshint validthis: true */
        d3.select(window).on('resize', resize.bind(this));

    }


    /**
     *
     * @param params
     */
    function handleExperimentChange(params) {

        var length = _chartCollection.length;

        for (var iii = 0; iii < length; iii++) {
            var chartItem = _chartCollection[iii];
            var olddiv = document.getElementById(chartItem.divId);

            while (olddiv.firstChild) {
                olddiv.removeChild(olddiv.firstChild);
            }
        }

        _currentExperiment = params.experiment;
        _chartCollection.length = 0;

        drawCharts();


    }

    /**
     *
     * @param params
     */
    function handleLanguageChange(params) {

    }

    /**
     *
     */
    this.init =  function () {

        _dataStoreManager = dataStoreManager.getInstance();

        _uuid = _dataStoreManager.generateUUID();

        EventMediator.getInstance().register(eventChannelNames.symbolChange, _uuid , handleSymbolChange);
        EventMediator.getInstance().register(eventChannelNames.dataChange, _uuid , handleDataChange);
        EventMediator.getInstance().register(eventChannelNames.plotStyleChange, _uuid , handlePlotStyleChange);
        EventMediator.getInstance().register(eventChannelNames.experimentChange, _uuid , handleExperimentChange);
        EventMediator.getInstance().register(eventChannelNames.colorChange, _uuid , handleColorChange);
        EventMediator.getInstance().register(eventChannelNames.languageChange, _uuid , handleLanguageChange);

        _currentExperiment = "expA";

        drawCharts();

    };

}



