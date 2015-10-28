
"use strict";


/**
 *
 * @type {{_chart: null, init: Function, resize: Function}}
 */
var pageManager = {

    _chart: null,
    _chartProperties: null,
    _experiment : null,
    _plotProperties: null,
    _data : null,

    _dataStoreManager : null,
    _currentExperiment: null,


    init: function () {

        this._dataStoreManager = new dataStoreManager();

        var uuid = this._dataStoreManager.generateUUID();

        this._currentExperiment = "expA";

        chartProperties.height = window.innerHeight - chartProperties.heightMargin;
        chartProperties.width = window.innerWidth - chartProperties.widthMargin;
        chartProperties.containerID = "experiment";

        var pageParameters = {
            "chartProperties": chartProperties,
            "experiment": new experimentDataManager(),
            "experimentAnnotations" : new experimentAnnotations(),
            "data": experimentOriginalData,
            "legend": drawLegend,
            "plotStyle": "scatter",
            "plotProperties": experimentPlotProperties,
            "labelProperties": labelProperties,
            "legendProperties": legendProperties,
            "transitionProperties" : transitionProperties,
            "axesProperties" : axesProperties
        };


        this._experiment = pageParameters.experiment;
        this._chartProperties = pageParameters.chartProperties;
        this._plotProperties = pageParameters.plotProperties;
        this._data = pageParameters.data;

        toolTipProperties.containerID = "experiment";
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
    },

    getActiveExperiment : function() {
        return this._currentExperiment;
    },

    resize: function(){

        var height = window.innerHeight - pageManager._chartProperties.heightMargin;
        var width  = window.innerWidth - pageManager._chartProperties.widthMargin;
        var params = {
            "height" : height,
            "width" : width
        };
        this._chart.handleRequest("resize", params);
    },


    updatePoints: function(data, pageControl) {

        pageControl._data = data;
        pageControl._experiment.init( pageControl._data);
        var params = {
            "data" : data,
            "domains": pageControl._experiment._dataDomains
        };
        pageControl._chart.handleRequest("update", params);
    },

    setSymbol: function(symbol, pageControl, plotName) {
        pageControl._plotProperties.forEach( function (configItem) {
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

        var params = {
            "data" : pageControl._data,
            "domains": pageControl._experiment._dataDomains,
            "plotProperties": pageControl._plotProperties,
            "plotName": plotName
        };
        pageControl._chart.handleRequest("symbolUpdate", params);
    },

    /**
     *
     * @param color
     * @param pageControl
     * @param plotName
     */
    setSymbolColor: function(color, pageControl, plotName) {

        pageControl._plotProperties.forEach( function (configItem) {
            if (configItem.name === plotName) {
                configItem.display.fillColor = color;
            }
        });

        var params = {
            "data" : pageControl._data,
            "domains": pageControl._experiment._dataDomains,
            "plotProperties": pageControl._plotProperties,
            "plotName": plotName
        };
        pageControl._chart.handleRequest("styleUpdate", params);
    },

    /**
     *
     * @param color
     * @param pageControl
     * @param plotName
     */
    setPlotStyle: function(plotStyle, pageControl, plotName) {

        pageControl._plotProperties.forEach( function (configItem) {
            if (configItem.name === plotName) {
                configItem.display.plotStyle = "bar";

                switch (plotStyle) {
                    case "scatter":
                        configItem.display.plotStyle = "scatter";
                        break;
                    case "bar" :
                        configItem.display.plotStyle = "bar";
                        break;
                }

            }
        });

        var params = {
            "data" : pageControl._data,
            "domains": pageControl._experiment._dataDomains,
            "plotProperties": pageControl._plotProperties,
            "plotName": plotName,
            "plotStyle": plotStyle
        };
        pageControl._chart.handleRequest("plotStyleUpdate", params);
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

        var olddiv = document.getElementById("experiment");

        while (olddiv.firstChild) {
            olddiv.removeChild(olddiv.firstChild);
        };

        var uuid = this._dataStoreManager.generateUUID();

        switch (this._currentExperiment) {
            case "expA" :
                data = experimentOriginalData;
                annotations = new experimentAnnotations();
                properties = experimentPlotProperties;
                dataManager = new experimentDataManager();
                break;
            case "expB" :
                data = experimentBOriginalData;
                annotations = new experimentBAnnotations();
                properties = experimentBPlotProperties;
                dataManager = new experimentBDataManager();
                break;

        };

        chartProperties.height = window.innerHeight - chartProperties.heightMargin;
        chartProperties.width = window.innerWidth - chartProperties.widthMargin;
        chartProperties.containerID = "experiment";

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

        toolTipProperties.containerID = "experiment";
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