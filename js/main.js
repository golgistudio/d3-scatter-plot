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

function closeAllMenus() {
    document.getElementById("menuControl").classList.remove( "open" );
    document.getElementById("symbolControl").classList.remove( "open" );
    document.getElementById("colorControl").classList.remove( "open" );
}

function closeOtherMenus(id) {
    if (id !== "menuControl") {
        document.getElementById("menuControl").classList.remove( "open" );
    }

    if (id !== "symbolControl") {
        document.getElementById("symbolControl").classList.remove( "open" );
    }

    if (id !== "colorControl") {
        document.getElementById("colorControl").classList.remove( "open" );
    }
}

function addEventHandlers() {

    document.body.addEventListener("click", function(event){
        closeAllMenus();
        event.stopPropagation();
    });

    document.getElementById("menuButton").addEventListener("click", function(event){
        closeOtherMenus("menuControl");
        document.getElementById("menuControl").classList.toggle( "open" );
        event.stopPropagation();
    });

    document.getElementById("symbolMenu").addEventListener("click", function(event){
        closeOtherMenus("symbolControl");
        document.getElementById("symbolControl").classList.toggle( "open" );
        event.stopPropagation();
    });

    document.getElementById("colorMenu").addEventListener("click", function(event){
        closeOtherMenus("colorControl");
        document.getElementById("colorControl").classList.toggle( "open" );
        event.stopPropagation();
    });

    document.getElementById("addPointButton").addEventListener("click", function(event) {
        pageManager.updatePoints(experimentAddData, pageManager);
        event.stopPropagation();

    });

    document.getElementById("removePointButton").addEventListener("click", function(event) {
        pageManager.updatePoints(experimentRemoveData, pageManager);
        event.stopPropagation();

    });

    document.getElementById("changePointButton").addEventListener("click", function(event) {

        console.log("changePointButton-start");
        pageManager.updatePoints(experimentDifferentTimesData, pageManager);
        event.stopPropagation();

    });

    document.getElementById("resetPointsButton").addEventListener("click", function(event) {

        pageManager.updatePoints(experimentOriginalData, pageManager);
        event.stopPropagation();
    });

    document.getElementById("circleSymbol").addEventListener("click", function(event) {

        pageManager.setSymbol("dot", pageManager, "Congruent");
        event.stopPropagation();
    });

    document.getElementById("triangleSymbol").addEventListener("click", function(event) {

        pageManager.setSymbol("triangle", pageManager, "Congruent");
        event.stopPropagation();
    });

    document.getElementById("iconSymbol").addEventListener("click", function(event) {

        pageManager.setSymbol("icon", pageManager, "Congruent");
        event.stopPropagation();
    });


    /**
     *  update of the incongruent plot
     */
    document.getElementById("blueColor").addEventListener("click", function(event) {

        pageManager.setSymbolColor("blue", pageManager, "Incongruent");
        event.stopPropagation();
    });

    /**
     *  update of the incongruent plot
     */
    document.getElementById("pinkColor").addEventListener("click", function(event) {

        pageManager.setSymbolColor("purple", pageManager, "Incongruent");
        event.stopPropagation();
    });
}

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

    pageManager.init(pageProperties);

    addEventHandlers();
}

//############################
//
//
//############################
document.addEventListener('DOMContentLoaded', function(){
    main();
});
