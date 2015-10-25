
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

    init: function (pageParameters) {

        var plotRenderer = getPlotRenderer(pageParameters.plotStyle);

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
            "plotRenderer" : plotRenderer,
            "toolTip" : toolTipObject,
            "dataMapper": this._experiment.mapData,
            "domains": this._experiment._dataDomains,
            "zoomScaleFactors" : this._experiment._zoomScaleFactors,
            "plotProperties": this._plotProperties,
            "labelProperties" : pageParameters.labelProperties,
            "legendProperties" : pageParameters.legendProperties,
            "transitionProperties" : pageParameters.transitionProperties
        };

        this._chart = new Chart();

        d3.select(window).on('resize', this.resize.bind(this));
        this._chart.handleRequest("create", chartParameters);
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
                configItem.symbol = symbol;

                switch (symbol) {
                    case "icon":
                        configItem.icon = "images/stopwatch-1-64x64.png";
                        configItem.width = 20;
                        configItem.height = 20;
                        break;
                    case "triangle" :
                        configItem.size = 64;
                        break;
                    case "circle" :
                        configItem.radius = 5;
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
                configItem.fillColor = color;
            }
        });

        var params = {
            "data" : pageControl._data,
            "domains": pageControl._experiment._dataDomains,
            "plotProperties": pageControl._plotProperties,
            "plotName": plotName
        };
        pageControl._chart.handleRequest("styleUpdate", params);
    }
};