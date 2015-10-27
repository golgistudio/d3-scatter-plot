"use strict";

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
//http://jsfiddle.net/dsummersl/EqLBJ/1/

// Menu
// http://codepen.io/nikhil/pen/sicrK

"use strict";


/**
 *
 */
function main() {


    chartProperties.height = window.innerHeight - chartProperties.heightMargin;
    chartProperties.width = window.innerWidth - chartProperties.widthMargin;
    chartProperties.containerID = "experiment";

    var pageProperties = {
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

    addMenuEventHandlers(pageManager);

    pageManager.init(pageProperties);
}

//############################
//
//
//############################
document.addEventListener('DOMContentLoaded', function(){
    main();
});
