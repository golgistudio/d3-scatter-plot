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
import {CommandManager} from './commands/commandManager.js';
import {PlotCommandFactory} from './commands/plotCommandFactory.js';


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
    updateSelected(["redo","unwind","rewind" ], "undo");
    updateSelected(["fr"], "eng");
}

/**
 *
 */
function addTopMenuEventHandlers() {
    "use strict";

    /**
     *
     */
    function closeAllMenus() {
        document.getElementById("dataControl").classList.remove( "open" );
        document.getElementById("symbolControl").classList.remove( "open" );
        document.getElementById("colorControl").classList.remove( "open" );
        document.getElementById("plotStyleControl").classList.remove( "open" );
        document.getElementById("experimentControl").classList.remove( "open" );
        document.getElementById("undo_redoControl").classList.remove( "open" );
        document.getElementById("langControl").classList.remove( "open" );
    }

    /**
     *
     * @param id
     */
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

        if (id !== "undo_redo") {
            document.getElementById("undo_redoControl").classList.remove( "open" );
        }

        if (id !== "language") {
            document.getElementById("langControl").classList.remove( "open" );
        }
    }

    /**
     *
     * @param event
     */
    function handleMenuEvent(event) {
        var topMenuId =  event.target.id;
        var menuId = topMenuId.replace(/Menu/g, "Control");
        closeOtherMenus(menuId);
        document.getElementById(menuId).classList.toggle( "open" );
        event.stopPropagation();
    }

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

    document.getElementById("undo_redoMenu").addEventListener("click", function(event){
        handleMenuEvent(event);
    });

    document.getElementById("langMenu").addEventListener("click", function(event){
        handleMenuEvent(event);
    });



}

/**
 *
 * @param pageManager
 */
export function addMenuEventHandlers(pageManager) {
    "use strict";

    addTopMenuEventHandlers();

    var commandFactory = new PlotCommandFactory();
    var commandManager = new CommandManager(commandFactory);

    var currentSelections = {
        activeExperiment: "expA",
        dataPoints: "reset",
        symbol: "dot",
        symbolColor: "blue",
        plotStyle: "bar"
    };

    document.getElementById("addPointButton").addEventListener("click", function(event) {
        updateSelected(["removePointButton", "changePointButton", "resetPointsButton"], "addPointButton");

        var data = null;

        switch(currentSelections.activeExperiment) {
            case "expA" : data = experimentAddData;
                break;
            case "expB" : data = experimentBAddData;
                break;

        }
        pageManager.updatePoints(data);
        currentSelections.dataPoints = data;
        event.stopPropagation();

    });

    document.getElementById("removePointButton").addEventListener("click", function(event) {
        updateSelected(["addPointButton", "changePointButton", "resetPointsButton"], "removePointButton");

        var data = null;

        switch(currentSelections.activeExperiment) {
            case "expA" : data = experimentRemoveData;
                break;
            case "expB" : data = experimentBRemoveData;
                break;

        }
        pageManager.updatePoints(data);
        currentSelections.dataPoints = data;
        event.stopPropagation();

    });

    document.getElementById("changePointButton").addEventListener("click", function(event) {
        updateSelected(["addPointButton", "removePointButton", "resetPointsButton"], "changePointButton");

        var data = null;

        switch(currentSelections.activeExperiment) {
            case "expA" : data = experimentDifferentTimesData;
                break;
            case "expB" : data = experimentBDifferentTimesData;
                break;

        }
        pageManager.updatePoints(data);
        currentSelections.dataPoints = data;
        event.stopPropagation();

    });

    document.getElementById("resetPointsButton").addEventListener("click", function(event) {
        updateSelected(["addPointButton", "removePointButton", "changePointButton"], "resetPointsButton");

        var data = null;

        switch(currentSelections.activeExperiment) {
            case "expA" : data = experimentOriginalData;
                break;
            case "expB" : data = experimentBOriginalData;
                break;
        }

        pageManager.updatePoints(data);
        currentSelections.dataPoints = data;
        event.stopPropagation();
    });

    function handleSymbolChange( pageManager, symbolName, oldSymbolName) {

        var newParams = {
            symbol: symbolName,
            chartDiv: "chart1"
        };

        var oldParams = {
            symbol: oldSymbolName,
            chartDiv: "chart1"
        };

        switch(currentSelections.activeExperiment) {
            case "expA" :
                newParams.plotName = "Control";
                oldParams.plotName = "Control";
                break;
            case "expB" :
                newParams.plotName = "Congruent";
                oldParams.plotName = "Congruent";
                break;
        }

        commandManager.run("execute", "symbolChange", oldParams, newParams );
    }

    document.getElementById("circleSymbol").addEventListener("click", function(event) {

        updateSelected(["triangleSymbol", "iconSymbol", "squareSymbol"], "circleSymbol");

        var newSymbol = "dot";
        handleSymbolChange(pageManager, newSymbol, currentSelections.symbol);
        currentSelections.symbol = newSymbol;
        event.stopPropagation();
    });

    document.getElementById("triangleSymbol").addEventListener("click", function(event) {

        updateSelected(["iconSymbol", "circleSymbol", "squareSymbol"], "triangleSymbol");

        var newSymbol = "triangle";
        handleSymbolChange(pageManager, newSymbol, currentSelections.symbol);

        currentSelections.symbol = newSymbol;
        event.stopPropagation();
    });

    document.getElementById("iconSymbol").addEventListener("click", function(event) {

        updateSelected(["triangleSymbol", "circleSymbol", "squareSymbol"], "iconSymbol");

        var newSymbol = "icon";
        handleSymbolChange(pageManager, newSymbol, currentSelections.symbol);

        currentSelections.symbol = newSymbol;
        event.stopPropagation();
    });

    document.getElementById("squareSymbol").addEventListener("click", function(event) {

        updateSelected(["triangleSymbol", "circleSymbol", "iconSymbol"], "squareSymbol");

        var newSymbol = "square";
        handleSymbolChange(pageManager, newSymbol, currentSelections.symbol);

        currentSelections.symbol = newSymbol;
        event.stopPropagation();
    });

    /**
     *  update of the incongruent plot
     */
    document.getElementById("blueColor").addEventListener("click", function(event) {

        updateSelected(["pinkColor"], "blueColor");


        switch(currentSelections.activeExperiment) {
            case "expA" :
                pageManager.setSymbolColor("blue", "Test", "chart1");
                break;
            case "expB" :
                pageManager.setSymbolColor("blue", "Incongruent", "chart1");
                break;
        }

        currentSelections.symbolColor = "blue";
        event.stopPropagation();
    });


    /**
     *  update
     */
    document.getElementById("pinkColor").addEventListener("click", function(event) {

        updateSelected(["blueColor"], "pinkColor");


        switch(currentSelections.activeExperiment) {
            case "expA" :
                pageManager.setSymbolColor("purple",  "Test", "chart1");
                break;
            case "expB" :
                pageManager.setSymbolColor("purple",  "Incongruent", "chart1");
                break;
        }
        currentSelections.symbolColor = "purple";
        event.stopPropagation();
    });

    /**
     *  update of the Difference plot
     */
    document.getElementById("scatter").addEventListener("click", function(event) {

        updateSelected(["barChart"], "scatter");
        var chartDiv = null;

        switch(currentSelections.activeExperiment) {
            case "expA" :
                chartDiv = "chart2";
                pageManager.setPlotStyle("scatter",  "Difference", chartDiv);
                break;
            case "expB" :
                chartDiv = "chart1";
                pageManager.setPlotStyle("scatter",  "Difference", chartDiv);
                break;
        }

        currentSelections.plotStyle = "scatter";
        event.stopPropagation();
    });

    /**
     *  update of the Difference plot
     */
    document.getElementById("barChart").addEventListener("click", function(event) {

        updateSelected(["scatter"], "barChart");

        var chartDiv = null;

        switch(currentSelections.activeExperiment) {
            case "expA" :
                chartDiv = "chart2";
                pageManager.setPlotStyle("bar",  "Difference", chartDiv);
                break;
            case "expB" :
                chartDiv = "chart1";
                pageManager.setPlotStyle("bar",  "Difference", chartDiv);
                break;
        }
        currentSelections.plotStyle = "bar";
        event.stopPropagation();


    });

    /**
     *  Experiment A
     */
    document.getElementById("expA").addEventListener("click", function(event) {

        initializeSelectedMenus();
        updateSelected(["expB"], "expA");
        pageManager.switchExperiment("expA");
        currentSelections.activeExperiment = "expA";
        event.stopPropagation();
    });

    /**
     *  Experment B
     */
    document.getElementById("expB").addEventListener("click", function(event) {
        initializeSelectedMenus();
        updateSelected(["expA"], "expB");
        pageManager.switchExperiment("expB");
        currentSelections.activeExperiment = "expB";
        event.stopPropagation();
    });

    document.getElementById("undo").addEventListener("click", function(event) {

        updateSelected(["redo", "unwind", "rewind"], "undo");
        commandManager.run("undo");
        event.stopPropagation();
    });

    document.getElementById("redo").addEventListener("click", function(event) {

        updateSelected(["undo", "unwind", "rewind"], "redo");
        commandManager.run("redo");
        event.stopPropagation();
    });

    document.getElementById("unwind").addEventListener("click", function(event) {

        updateSelected(["undo", "redo", "rewind"], "unwind");
        commandManager.run("unwind");
        event.stopPropagation();
    });

    document.getElementById("rewind").addEventListener("click", function(event) {

        updateSelected(["undo", "unwind", "redo"], "rewind");
        commandManager.run("rewind");
        event.stopPropagation();
    });

    initializeSelectedMenus();

}





