// Update with new values
// http://bl.ocks.org/WilliamQLiu/bd12f73d0b79d70bfbae

// zoom
// http://jsfiddle.net/Nu95q/12/
// http://bl.ocks.org/stepheneb/1182434
//http://bl.ocks.org/peterssonjonas/4a0e7cb8d23231243e0e
// Ordinal scales - http://jsfiddle.net/9rypxf10/

// Append lines
// http://bl.ocks.org/nsonnad/4481531

// Legend
// http://bl.ocks.org/ZJONSSON/3918369

// Clickable legend
// http://bl.ocks.org/bobmonteverde/2070123
// https://gist.github.com/bobmonteverde/2070123


/**
 *
 * @type {{_chart: null, init: Function, resize: Function}}
 */
var pageControl = {

    _chart: null,
    _chartProperties: null,
    _experiment : null,

    init: function (pageControlParameters) {
        "use strict";

        var plotRenderer = getPlotRenderer(pageControlParameters.plotStyle);

        this._experiment = pageControlParameters.experiment;
        this._chartProperties = pageControlParameters.chartProperties;

        toolTipProperties.containerID = "experiment";
        toolTipProperties.formatter = pageControlParameters.toolTipFormatter;
        toolTip.create(toolTipProperties);

        this._experiment.init(pageControlParameters.data);

        var chartParameters = {
            "chartProperties" : this._chartProperties,
            "data" : pageControlParameters.data,
            "plotRenderer" : plotRenderer,
            "legend" : pageControlParameters.createLegend,
            "toolTip" : toolTip,
            "dataMapper": this._experiment.mapData,
            "domains": this._experiment._dataDomains,
            "plotProperties": pageControlParameters.plotProperties,
            "labelProperties" : pageControlParameters.labelProperties,
            "legendProperties" : pageControlParameters.legendProperties
        };

        this._chart = chart;

        d3.select(window).on('resize', this.resize.bind(this));

        this._chart.create(chartParameters);
    },

    resize: function(){
        "use strict";

        var height = window.innerHeight - pageControl._chartProperties.heightMargin;
        var width  = window.innerWidth - pageControl._chartProperties.widthMargin;
        this._chart.resize(width, height);
    },


    updatePoints: function(data, pageControl) {
        "use strict";
        pageControl._experiment.init(data);
        pageControl._chart.updateData(data, pageControl._experiment._dataDomains);
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
};

function addEventHandlers() {

    document.getElementById("addPointButton").addEventListener("click", function() {
        "use strict";
        pageControl.updatePoints(experimentAddData, pageControl);
        event.stopPropagation();

    }.bind(null,event,experimentOriginalData));

    document.getElementById("removePointButton").addEventListener("click", function() {
        "use strict";

        pageControl.updatePoints(experimentRemoveData, pageControl);
        event.stopPropagation();

    }.bind(null,event,experimentRemoveData));

    document.getElementById("changePointButton").addEventListener("click", function() {
        "use strict";
        console.log("changePointButton-start");
        pageControl.updatePoints(experimentDifferentTimesData, pageControl);
        event.stopPropagation();

    }.bind(null,event, experimentDifferentTimesData));

    document.getElementById("resetPointsButton").addEventListener("click", function() {
        "use strict";
        pageControl.updatePoints(experimentOriginalData, pageControl);
        event.stopPropagation();
    }.bind(null,event,experimentOriginalData));

    document.getElementById("circleSymbol").addEventListener("click", function(event) {
        "use strict";
        pageControl.setSymbol("circle", pageControl);
        event.stopPropagation();
    });

    document.getElementById("squareSymbol").addEventListener("click", function(event) {
        "use strict";
        pageControl.setSymbol("square", pageControl);
        event.stopPropagation();
    });

    document.getElementById("blueColor").addEventListener("click", function(event) {
        "use strict";
        pageControl.setSymbolColor("blue", pageControl);
        event.stopPropagation();
    });

    document.getElementById("pinkColor").addEventListener("click", function(event) {
        "use strict";
        pageControl.setSymbolColor("pink", pageControl);
        event.stopPropagation();
    });
}

/**
 *
 */
function main() {
    "use strict";

    chartProperties.height = window.innerHeight - chartProperties.heightMargin;
    chartProperties.width = window.innerWidth - chartProperties.widthMargin;
    chartProperties.containerID = "experiment";

    var pageControlParameters = {
        "chartProperties": chartProperties,
        "experiment": experimentDataManager,
        "data": experimentOriginalData,
        "legend": drawLegend,
        "toolTipFormatter": experimentToolTipContent,
        "plotStyle": "scatter",
        "plotProperties": experimentPlotProperties,
        "labelProperties": labelProperties,
        "legendProperties": legendProperties
    };

    pageControl.init(pageControlParameters);

    addEventHandlers();
};

//############################
//
//
//############################
main();