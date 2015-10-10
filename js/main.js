/**
 *
 * @type {{_chart: null, init: Function, resize: Function}}
 */
var pageControl = {

    _chart: null,

    init: function (pageControlParameters) {
        "use strict";
        var experimentParameters = {
            "data" : pageControlParameters.data,
            "tooltipContent": pageControlParameters.toolTipContent
        } ;

        var plotRenderer = getPlotRenderer(pageControlParameters.plotStyle);

        toolTipProperties.containerID = "stroop";
        toolTipProperties.formatter = pageControlParameters.toolTipFormatter;
        toolTip.create(toolTipProperties);

        pageControlParameters.experiment.init(experimentParameters);

        var chartParameters = {
            "chartProperties" : pageControlParameters.chartProperties,
            "data" : pageControlParameters.data,
            "plotRenderer" : plotRenderer,
            "legend" : pageControlParameters.createLegend,
            "toolTip" : toolTip,
            "dataMapper": pageControlParameters.experiment.mapData,
            "domains": pageControlParameters.experiment._dataDomains,
            "plotProperties": pageControlParameters.plotProperties,
            "labelProperties" : pageControlParameters.labelProperties,
            "legendProperties" : pageControlParameters.legendProperties
        };

        this._chart = chart;
        d3.select(window).on('resize', this.resize.bind(this));

        this._chart.create(chartParameters);
    },

    resize: function(chart){
        "use strict";
        var height = window.innerHeight - 25
        var width  = window.innerWidth - 25;
        this._chart.resize(width, height);
    }
};

/**
 *
 * @param plotStyle
 * @returns {{renderPlot: Function, addSymbols: Function}}
 */
function getPlotRenderer(plotStyle) {
    "use strict";

    switch(plotStyle) {
        case "scatter"  : return scatterPlot;
        break;
    }
}

/**
 *
 */
function main() {
    "use strict";

    chartProperties.height = window.innerHeight - 25;
    chartProperties.width = window.innerWidth - 25;
    chartProperties.containerID = "stroop";

    var pageControlParameters = {
        "chartProperties": chartProperties,
        "experiment": stroopExperiment,
        "data": stroopSampleData,
        "legend": drawLegend,
        "toolTipFormatter": stroopToolTipContent,
        "plotStyle": "scatter",
        "plotProperties": stroopPlotProperties,
        "labelProperties": labelProperties,
        "legendProperties": legendProperties
    };

    pageControl.init(pageControlParameters);
};

//############################
//
//
//############################
main();