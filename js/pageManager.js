
"use strict";

/**
 *
 * @type {{_chart: null, init: Function, resize: Function}}
 */
var pageManager = {

    _chart: null,
    _chartProperties: null,
    _experiment : null,

    init: function (pageParameters) {
        

        var plotRenderer = getPlotRenderer(pageParameters.plotStyle);

        this._experiment = pageParameters.experiment;
        this._chartProperties = pageParameters.chartProperties;

        toolTipProperties.containerID = "experiment";
        toolTipProperties.formatter = pageParameters.toolTipFormatter;
        var toolTipObject = new toolTip();
        toolTipObject.create(toolTipProperties);

        this._experiment.init(pageParameters.data);

        var chartParameters = {
            "chartProperties" : this._chartProperties,
            "data" : pageParameters.data,
            "plotRenderer" : plotRenderer,
            "legend" : pageParameters.createLegend,
            "toolTip" : toolTipObject,
            "dataMapper": this._experiment.mapData,
            "domains": this._experiment._dataDomains,
            "plotProperties": pageParameters.plotProperties,
            "labelProperties" : pageParameters.labelProperties,
            "legendProperties" : pageParameters.legendProperties
        };

        this._chart = new chart();

        d3.select(window).on('resize', this.resize.bind(this));
        this._chart.handleRequest("create", chartParameters);
    },

    resize: function(){
        "use strict";

        var height = window.innerHeight - pageManager._chartProperties.heightMargin;
        var width  = window.innerWidth - pageManager._chartProperties.widthMargin;
        var params = {
            "height" : height,
            "width" : width
        };
        this._chart.handleRequest("resize", params);
    },


    updatePoints: function(data, pageControl) {
        "use strict";
        pageControl._experiment.init(data);
        var params = {
            "data" : data,
            "domains": pageControl._experiment._dataDomains
        };
        pageControl._chart.handleRequest("update", params);
    },

    setSymbol: function(symbol, pageControl) {
        "use strict";
        console.log("setSymbol: " + symbol);
    },

    setSymbolColor: function(color, pageControl) {
        "use strict";
        console.log("setSymbolColor: " + color);
    }
};