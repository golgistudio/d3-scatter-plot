/**
 * @file
 */

/*global document:false */
/*global experimentAddData:false */
/*global experimentBAddData:false */
/*global experimentRemoveData:false */
/*global experimentBRemoveData:false */
/*global experimentDifferentTimesData:false */
/*global experimentBDifferentTimesData:false */
/*global experimentOriginalData:false */
/*global experimentBOriginalData:false */

/*global module:false */
/*global require:false */

import {experimentBAddData} from './experiments/experimentB/data/experimentBAddData.js';
import {experimentBRemoveData} from './experiments/experimentB/data/experimentBRemoveData.js';
import {experimentBDifferentTimesData} from './experiments/experimentB/data/experimentBDifferentTimesData.js';
import {experimentBOriginalData} from './experiments/experimentB/data/experimentBOriginalData.js';

import {experimentAddData} from './experiments/experimentResults/data/experimentAddData.js';
import {experimentRemoveData} from './experiments/experimentResults/data/experimentRemoveData.js';
import {experimentDifferentTimesData} from './experiments/experimentResults/data/experimentDifferentTimesData.js';
import {experimentOriginalData} from './experiments/experimentResults/data/experimentOriginalData.js';


/**
 *
 * @param unselected
 * @param selected
 */
function updateSelected(unselected, selected) {

    var length = unselected.length;

    for (var iii = 0; iii < length; iii++){
        document.getElementById(unselected[iii]).classList.remove( "optionSelected" );
    }

    document.getElementById(selected).classList.toggle( "optionSelected" );
}

/**
 *
 */
function initializeSelectedMenus() {
    updateSelected(["expB"], "expA");
    updateSelected(["scatter"], "barChart");
    updateSelected(["pinkColor"], "blueColor");
    updateSelected(["addPointButton", "removePointButton", "changePointButton"], "resetPointsButton");
    updateSelected(["triangleSymbol", "iconSymbol"], "circleSymbol");
}


/**
 *
 */
function addTopMenuEventHandlers() {
    "use strict";

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
        handleMenuEvent(event);
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
    }

    function handleMenuEvent(event) {
        var topMenuId =  event.target.id;
        var menuId = topMenuId.replace(/Menu/g, "Control");
        closeOtherMenus(menuId);
        document.getElementById(menuId).classList.toggle( "open" );
        event.stopPropagation();
    }

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

/**
 *
 * @param pageManager
 */
export function addMenuEventHandlers(pageManager) {
    "use strict";

    addTopMenuEventHandlers();

    document.getElementById("addPointButton").addEventListener("click", function(event) {
        updateSelected(["removePointButton", "changePointButton", "resetPointsButton"], "addPointButton");
        var experiment = pageManager.getActiveExperiment();
        var data = null;

        switch(experiment) {
            case "expA" : data = experimentAddData;
                break;
            case "expB" : data = experimentBAddData;
                break;

        }
        pageManager.updatePoints(data, pageManager);
        event.stopPropagation();

    });

    document.getElementById("removePointButton").addEventListener("click", function(event) {
        updateSelected(["addPointButton", "changePointButton", "resetPointsButton"], "removePointButton");
        var experiment = pageManager.getActiveExperiment();
        var data = null;

        switch(experiment) {
            case "expA" : data = experimentRemoveData;
                break;
            case "expB" : data = experimentBRemoveData;
                break;

        }
        pageManager.updatePoints(data, pageManager);
        event.stopPropagation();

    });

    document.getElementById("changePointButton").addEventListener("click", function(event) {
        updateSelected(["addPointButton", "removePointButton", "resetPointsButton"], "changePointButton");
        var experiment = pageManager.getActiveExperiment();
        var data = null;

        switch(experiment) {
            case "expA" : data = experimentDifferentTimesData;
                break;
            case "expB" : data = experimentBDifferentTimesData;
                break;

        }
        pageManager.updatePoints(data, pageManager);
        event.stopPropagation();

    });

    document.getElementById("resetPointsButton").addEventListener("click", function(event) {
        updateSelected(["addPointButton", "removePointButton", "changePointButton"], "resetPointsButton");
        var experiment = pageManager.getActiveExperiment();
        var data = null;

        switch(experiment) {
            case "expA" : data = experimentOriginalData;
                break;
            case "expB" : data = experimentBOriginalData;
                break;
        }

        pageManager.updatePoints(data, pageManager);
        event.stopPropagation();
    });

    document.getElementById("circleSymbol").addEventListener("click", function(event) {

        updateSelected(["triangleSymbol", "iconSymbol"], "circleSymbol");

        var experiment = pageManager.getActiveExperiment();

        switch(experiment) {
            case "expA" :
                pageManager.setSymbol("dot", pageManager, "Control", "chart1");
                break;
            case "expB" :
                pageManager.setSymbol("dot", pageManager, "Congruent", "chart1");
                break;
        }
        event.stopPropagation();
    });

    document.getElementById("triangleSymbol").addEventListener("click", function(event) {

        updateSelected(["iconSymbol", "circleSymbol"], "triangleSymbol");

        var experiment = pageManager.getActiveExperiment();

        switch(experiment) {
            case "expA" :
                pageManager.setSymbol("triangle", pageManager, "Control", "chart1");
                break;
            case "expB" :
                pageManager.setSymbol("triangle", pageManager, "Congruent", "chart1");
                break;
        }
        event.stopPropagation();
    });

    document.getElementById("iconSymbol").addEventListener("click", function(event) {

        updateSelected(["triangleSymbol", "circleSymbol"], "iconSymbol");

        var experiment = pageManager.getActiveExperiment();

        switch(experiment) {
            case "expA" :
                pageManager.setSymbol("icon", pageManager, "Control", "chart1");
                break;
            case "expB" :
                pageManager.setSymbol("icon", pageManager, "Congruent", "chart1");
                break;
        }
        event.stopPropagation();
    });

    /**
     *  update of the incongruent plot
     */
    document.getElementById("blueColor").addEventListener("click", function(event) {

        updateSelected(["pinkColor"], "blueColor");

        var experiment = pageManager.getActiveExperiment();

        switch(experiment) {
            case "expA" :
                pageManager.setSymbolColor("blue", pageManager, "Test", "chart1");
                break;
            case "expB" :
                pageManager.setSymbolColor("blue", pageManager, "Incongruent", "chart1");
                break;
        }
        event.stopPropagation();
    });


    /**
     *  update
     */
    document.getElementById("pinkColor").addEventListener("click", function(event) {

        updateSelected(["blueColor"], "pinkColor");

        var experiment = pageManager.getActiveExperiment();

        switch(experiment) {
            case "expA" :
                pageManager.setSymbolColor("purple", pageManager, "Test", "chart1");
                break;
            case "expB" :
                pageManager.setSymbolColor("purple", pageManager, "Incongruent", "chart1");
                break;
        }

        event.stopPropagation();
    });

    /**
     *  update of the Difference plot
     */
    document.getElementById("scatter").addEventListener("click", function(event) {

        updateSelected(["barChart"], "scatter");
        var experiment = pageManager.getActiveExperiment();
        var chartDiv = null;

        switch(experiment) {
            case "expA" :
                chartDiv = "chart2";
                pageManager.setPlotStyle("scatter", pageManager, "Difference", chartDiv);
                break;
            case "expB" :
                chartDiv = "chart1";
                pageManager.setPlotStyle("scatter", pageManager, "Difference", chartDiv);
                break;
        }


        event.stopPropagation();
    });

    /**
     *  update of the Difference plot
     */
    document.getElementById("barChart").addEventListener("click", function(event) {

        updateSelected(["scatter"], "barChart");

        var experiment = pageManager.getActiveExperiment();
        var chartDiv = null;

        switch(experiment) {
            case "expA" :
                chartDiv = "chart2";
                pageManager.setPlotStyle("bar", pageManager, "Difference", chartDiv);
                break;
            case "expB" :
                chartDiv = "chart1";
                pageManager.setPlotStyle("bar", pageManager, "Difference", chartDiv);
                break;
        }
        event.stopPropagation();


    });

    /**
     *  Experiment A
     */
    document.getElementById("expA").addEventListener("click", function(event) {

        initializeSelectedMenus();
        updateSelected(["expB"], "expA");
        pageManager.switchExperiment("expA", pageManager);
        event.stopPropagation();
    });

    /**
     *  Experment B
     */
    document.getElementById("expB").addEventListener("click", function(event) {
        initializeSelectedMenus();
        updateSelected(["expA"], "expB");
        pageManager.switchExperiment("expB", pageManager);

        event.stopPropagation();
    });

    initializeSelectedMenus();

}





