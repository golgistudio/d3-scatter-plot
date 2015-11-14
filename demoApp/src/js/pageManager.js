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
 * @type {{_dataStoreManager: null, _chartCollection: Array, _currentExperiment: null, getDimensions: pageManager.getDimensions, init: pageManager.init, createChart: pageManager.createChart, getActiveExperiment: pageManager.getActiveExperiment, resize: pageManager.resize, updatePoints: pageManager.updatePoints, updatePlotSymbol: pageManager.updatePlotSymbol, setSymbol: pageManager.setSymbol, setSymbolColor: pageManager.setSymbolColor, setPlotStyle: pageManager.setPlotStyle, switchExperiment: pageManager.switchExperiment, getExperimentInfo: pageManager.getExperimentInfo}}
 */
export function PageManager() {
    "use strict";

    var _dataStoreManager = dataStoreManager.getInstance();
    var _chartCollection = [];
    var _currentExperiment = null;
    var _uuid =  null;


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
    this.resize = function() {

        var length = _chartCollection.length;

        for (var i = 0; i < length; i++) {

            var uuid = _chartCollection[i].uuid;
            var chartProps = _dataStoreManager.getData(uuid, dataStoreNames.chart);
            updateDimensions(chartProps);
            _dataStoreManager.setData(uuid, dataStoreNames.chart, chartProps);

            _chartCollection[i].chart.handleRequest("resize", null);
        }
    };


    /**
     *
     * @param data
     */
    this.updatePoints =  function(data) {


        var length = _chartCollection.length;

        for (var i = 0; i < length; i++) {

            var chartItem = _chartCollection[i];

            var experimentParams = chartItem.experiment.init(data);

            _dataStoreManager.setData(chartItem.uuid, dataStoreNames.zoomScaleFactors, experimentParams.zoomScaleFactors);
            _dataStoreManager.setData(chartItem.uuid, dataStoreNames.domains, experimentParams.domains);

            var params = {
                data : data,
                experiment: chartItem.experiment
            };

            chartItem.chart.handleRequest("update", params);
        }
    };

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
        }
    }


    /**
     *
     * @param params
     */
    function setSymbol(params) {


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

                var updateParams = {
                    "plotName": params.plotName
                };
                chartItem.chart.handleRequest("updatePlotStyle", updateParams);
            }
        }
    }

    function handleSymbolChangeRequest(params) {

       setSymbol(params);
    }

    /**
     *
     * @param color
     * @param plotName
     * @param chartDiv
     */
    this.setSymbolColor =  function(color, plotName, chartDiv) {

        var length = _chartCollection.length;

        for (var i = 0; i < length; i++) {

            var chartItem = _chartCollection[i];

            if (chartItem.divId === chartDiv) {

                var plotProps = _dataStoreManager.getData(chartItem.uuid, dataStoreNames.experiment);
                var len = plotProps.length;

                for (var j = 0; j < len; j++) {
                    var configItem = plotProps[j];
                    if (configItem.name === plotName) {
                        configItem.display.fillColor = color;
                    }
                }

                _dataStoreManager.setData(chartItem.uuid, dataStoreNames.experiment, plotProps);

                var params = {
                    "plotName": plotName
                };
                chartItem.chart.handleRequest("updatePlotStyle", params);
            }
        }
    };

    /**
     *
     * @param plotStyle
     * @param plotName
     * @param chartDiv
     */
     this.setPlotStyle = function(plotStyle,  plotName, chartDiv) {


        var length = _chartCollection.length;

        for (var i = 0; i < length; i++) {

            var chartItem = _chartCollection[i];

            if (chartItem.divId === chartDiv) {

                var plotProps = _dataStoreManager.getData(chartItem.uuid, dataStoreNames.experiment);

                var len = plotProps.length;
                for (var j = 0; j < len; j++) {
                    var configItem = plotProps[j];
                    if (configItem.name === plotName) {
                        configItem.display.plotStyle = plotStyle;
                    }
                }

                _dataStoreManager.setData(chartItem.uuid, dataStoreNames.experiment, plotProps);

                var params = {
                    "plotName": plotName
                };
                chartItem.chart.handleRequest("updatePlotStyle", params);
            }
        }

    };

    /**
     *
     * @param experimentName
     */
    this.switchExperiment = function(experimentName) {


        _currentExperiment = experimentName;

        var length = _chartCollection.length;

        for (var iii = 0; iii < length; iii++) {
            var chartItem = _chartCollection[iii];
            var olddiv = document.getElementById(chartItem.divId);

            while (olddiv.firstChild) {
                olddiv.removeChild(olddiv.firstChild);
            }
        }

        var expInfoCollection = this.getExperimentInfo();

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

        d3.select(window).on('resize', this.resize.bind(this));

    };

    /**
     *
     * @returns {Array}
     */
    this.getExperimentInfo = function() {

        var expInfoCollection = [];

        var expInfoItem1 = null;
        var expInfoItem2 = null;

        switch (_currentExperiment) {
            case "expA" :
                expInfoItem1 = {
                    divId:      "chart1",
                    properties: experimentPlotProperties,
                    experiment: new ExperimentManager(),
                    uuid:       _dataStoreManager.generateUUID(),
                    data:       experimentOriginalData

                };

                expInfoItem2 = {
                    divId:      "chart2",
                    properties: experimentPlotProperties2,
                    experiment: new ExperimentManager2(),
                    uuid:       _dataStoreManager.generateUUID(),
                    data:       experimentOriginalData
                };
                break;
            case "expB" :
                expInfoItem1 = {
                    divId:      "chart1",
                    properties: experimentBPlotProperties,
                    experiment: new ExperimentBManager(),
                    uuid:       _dataStoreManager.generateUUID(),
                    data:       experimentBOriginalData

                };

                expInfoItem2 = {
                    divId:      "chart2",
                    properties: experimentBPlotProperties2,
                    experiment: new ExperimentBManager2(),
                    uuid:       _dataStoreManager.generateUUID(),
                    data:       experimentBOriginalData
                };
                break;
        }

        expInfoCollection.push(expInfoItem1);
        expInfoCollection.push(expInfoItem2);

        return expInfoCollection;
    };

    /**
     *
     */
    this.init =  function () {

        _dataStoreManager = dataStoreManager.getInstance();

        _uuid = _dataStoreManager.generateUUID();

        EventMediator.getInstance().register(eventChannelNames.symbolChange, _uuid , handleSymbolChangeRequest);

        _currentExperiment = "expA";

        var expInfoCollection = this.getExperimentInfo();

        for (var i=0; i < expInfoCollection.length; i++) {

            var expInfo = expInfoCollection[i];

            var chart = createChart(expInfo.divId, expInfo.experiment, expInfo.uuid, expInfo.data, expInfo.properties);
            var chartItem = {
                uuid: expInfo.uuid,
                chart: chart,
                experiment: expInfo.experiment,
                divId : expInfo.divId
            };
            _chartCollection.push(chartItem);

        }

        d3.select(window).on('resize', this.resize.bind(this));

    };

}



