// Update with new values
// http://bl.ocks.org/WilliamQLiu/bd12f73d0b79d70bfbae

//http://jsfiddle.net/zhFbn/

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

// Understanding clipping issues
// http://stackoverflow.com/questions/32978439/d3-clipping-issues-on-zoom


function addEventHandlers() {

    document.getElementById("addPointButton").addEventListener("click", function() {
        "use strict";
        pageManager.updatePoints(experimentAddData, pageManager);
        event.stopPropagation();

    }.bind(null,event,experimentOriginalData));

    document.getElementById("removePointButton").addEventListener("click", function() {
        "use strict";

        pageManager.updatePoints(experimentRemoveData, pageManager);
        event.stopPropagation();

    }.bind(null,event,experimentRemoveData));

    document.getElementById("changePointButton").addEventListener("click", function() {
        "use strict";
        console.log("changePointButton-start");
        pageManager.updatePoints(experimentDifferentTimesData, pageManager);
        event.stopPropagation();

    }.bind(null,event, experimentDifferentTimesData));

    document.getElementById("resetPointsButton").addEventListener("click", function() {
        "use strict";
        pageManager.updatePoints(experimentOriginalData, pageManager);
        event.stopPropagation();
    }.bind(null,event,experimentOriginalData));

    document.getElementById("circleSymbol").addEventListener("click", function(event) {
        "use strict";
        pageManager.setSymbol("circle", pageManager);
        event.stopPropagation();
    });

    document.getElementById("squareSymbol").addEventListener("click", function(event) {
        "use strict";
        pageManager.setSymbol("square", pageManager);
        event.stopPropagation();
    });

    document.getElementById("blueColor").addEventListener("click", function(event) {
        "use strict";
        pageManager.setSymbolColor("blue", pageManager);
        event.stopPropagation();
    });

    document.getElementById("pinkColor").addEventListener("click", function(event) {
        "use strict";
        pageManager.setSymbolColor("pink", pageManager);
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

    var pageProperties = {
        "chartProperties": chartProperties,
        "experiment": new experimentDataManager(),
        "data": experimentOriginalData,
        "legend": drawLegend,
        "toolTipFormatter": experimentToolTipContent,
        "plotStyle": "scatter",
        "plotProperties": experimentPlotProperties,
        "labelProperties": labelProperties,
        "legendProperties": legendProperties
    };

    pageManager.init(pageProperties);

    addEventHandlers();
};

//############################
//
//
//############################
main();