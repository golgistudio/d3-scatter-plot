/**
 * Created by laurie on 10/27/15.
 */

"use strict";

function addMenuEventHandlers(pageManager) {

    addTopMenuEventHandlers();

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

    /**
     *  update of the incongruent plot
     */
    document.getElementById("pinkColor").addEventListener("click", function(event) {

        pageManager.setSymbolColor("purple", pageManager, "Incongruent");
        event.stopPropagation();
    });

    /**
     *  update of the Difference plot
     */
    document.getElementById("scatter").addEventListener("click", function(event) {

        pageManager.setPlotStyle("scatter", pageManager, "Difference");
        event.stopPropagation();
    });

    /**
     *  update of the Difference plot
     */
    document.getElementById("barChart").addEventListener("click", function(event) {

        pageManager.setPlotStyle("barChart", pageManager, "Difference");
        event.stopPropagation();
    });

    /**
     *  Experiment A
     */
    document.getElementById("expA").addEventListener("click", function(event) {

        pageManager.switchExperiment("expA", pageManager);
        event.stopPropagation();
    });

    /**
     *  Experment B
     */
    document.getElementById("expB").addEventListener("click", function(event) {

        pageManager.switchExperiment("expB", pageManager);
        event.stopPropagation();
    });

}


function addTopMenuEventHandlers() {

    document.body.addEventListener("click", function(event){
        closeAllMenus();
        event.stopPropagation();
    });

    document.getElementById("dataMenu").addEventListener("click", function(event){
        handleMenuEvent(event);
    });

    document.getElementById("symbolMenu").addEventListener("click", function(event){
        handleMenuEvent(event);
    });

    document.getElementById("colorMenu").addEventListener("click", function(event){
        handleMenuEvent(event);
    });
    document.getElementById("plotStyleMenu").addEventListener("click", function(event){
        handleMenuEvent(event);;
    });

    document.getElementById("experimentMenu").addEventListener("click", function(event){
        handleMenuEvent(event);
    });

    function closeAllMenus() {
        document.getElementById("dataControl").classList.remove( "open" );
        document.getElementById("symbolControl").classList.remove( "open" );
        document.getElementById("colorControl").classList.remove( "open" );
        document.getElementById("plotStyleControl").classList.remove( "open" );
        document.getElementById("experimentControl").classList.remove( "open" );
    };

    function handleMenuEvent(event) {
        var topMenuId = event.srcElement.id;
        var menuId = topMenuId.replace(/Menu/g, "Control");
        closeOtherMenus(menuId);
        document.getElementById(menuId).classList.toggle( "open" );
        event.stopPropagation();
    };

    function closeOtherMenus(id) {
        if (id !== "dataControl") {
            document.getElementById("dataControl").classList.remove( "open" );
        }

        if (id !== "symbolControl") {
            document.getElementById("symbolControl").classList.remove( "open" );
        }

        if (id !== "colorControl") {
            document.getElementById("colorControl").classList.remove( "open" );
        }

        if (id !== "plotStyleControl") {
            document.getElementById("plotStyleControl").classList.remove( "open" );
        }

        if (id !== "experimentControl") {
            document.getElementById("experimentControl").classList.remove( "open" );
        }
    }

}
