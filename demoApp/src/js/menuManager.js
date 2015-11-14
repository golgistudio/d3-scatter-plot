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
import {commandNames} from './commands/commandNames.js';

/**
 *
 */
export function addMenuEventHandlers() {
    "use strict";

    var commandFactory = new PlotCommandFactory();
    var commandManager = new CommandManager(commandFactory);

    var currentSelections = {
        activeExperiment: "expA",
        dataPoints:       "reset",
        symbol:           "dot",
        symbolColor:      "blue",
        plotStyle:        "bar",
        undo:             "undo",
        language:         "en"
    };

    var menuIds = {
        symbols : ["triangleSymbol", "iconSymbol", "squareSymbol", "circleSymbol"],
        topMenu: ["dataControl",
            "symbolControl",
            "colorControl",
            "plotStyleControl",
            "experimentControl",
            "undo_redoControl",
            "langControl"],
        colors : ["blueColor", "pinkColor"],
        data: ["removePointButton", "changePointButton", "resetPointsButton", "addPointButton"],
        language: ["fr", "en"],
        undo:["redo", "unwind", "rewind", "undo"],
        experiment:["expB", "expB"],
        plotStyle:["scatter", "barChart"]
    };

    var htmlTags = {
        optionSelected : "optionSelected",
        open: "open",
        chart1Id : "chart1",
        chart2Id: "chart2"
    };


    /**
     *
     * @param idList
     * @param selected
     */
    function updateSelection(idList, selected) {

        var length = idList.length;

        for (var iii = 0; iii < length; iii++) {
            if (idList[iii] === selected) {
                document.getElementById(selected).classList.toggle(htmlTags.optionSelected);
            } else {
                document.getElementById(idList[iii]).classList.remove(htmlTags.optionSelected);
            }
        }
    }

    /**
     *
     */
    function initializeSelectedMenus() {
        updateSelection(menuIds.experiment, "expA");
        updateSelection(menuIds.plotStyle, "barChart");
        updateSelection(menuIds.colors, "blueColor");
        updateSelection(menuIds.data, "resetPointsButton");
        updateSelection(menuIds.symbols, "circleSymbol");
        updateSelection(menuIds.undo, "undo");
        updateSelection(menuIds.language, "en");
    }

    /**
     *
     */
    function closeAllMenus() {

        menuIds.topMenu.forEach(function (item) {
            document.getElementById(item).classList.remove(htmlTags.open);
        });
    }

    /**
     *
     * @param id
     */
    function closeOtherMenus(id) {

        menuIds.topMenu.forEach(function (item) {
            if (item === id) {
                document.getElementById(item).classList.remove(htmlTags.open);
            }
        });
    }

    /**
     *
     * @param topMenuId
     */
    function handleTopMenuEvent(topMenuId) {
        var menuId    = topMenuId.replace(/Menu/g, "Control");
        closeOtherMenus(menuId);
        document.getElementById(menuId).classList.toggle(htmlTags.open);
        event.stopPropagation();
    }

    /**
     *
     * @param selectedId
     */
    function handleColorChange(selectedId) {

        var selectionMap = {
            "blueColor": "blue",
            "pinkColor": "purple"
        };

        var newSelection = selectionMap[selectedId];

        var newParams = {
            color:   newSelection,
            chartDiv: htmlTags.chart1Id
        };

        var oldParams = {
            color:   currentSelections.symbolColor,
            chartDiv: htmlTags.chart1Id
        };

        switch (currentSelections.activeExperiment) {
            case "expA" :
                newParams.plotName = "Test";
                oldParams.plotName = "Test";
                break;
            case "expB" :
                newParams.plotName = "Incongruent";
                oldParams.plotName = "Incongruent";
                break;
        }

        updateSelection(menuIds.colors, selectedId);
        commandManager.run("execute", commandNames.colorChange, oldParams, newParams);
        currentSelections.symbolColor = newSelection;
    }


    /**
     *
     * @param selectedId
     */
    function handleDataChange(selectedId) {

        var selectionMap = {
            "removePointButton": {
                "expA": experimentRemoveData,
                "expB": experimentBRemoveData
            },
            "changePointButton": {
                "expA": experimentDifferentTimesData,
                "expB": experimentBDifferentTimesData
            },
            "resetPointsButton": {
                "expA": experimentOriginalData,
                "expB": experimentBOriginalData
            },
            "addPointButton":    {
                "expA": experimentAddData,
                "expB": experimentBAddData
            }
        };

        var newSelection = selectionMap[selectedId][currentSelections.activeExperiment];

        var newParams = {
            data: newSelection
        };

        var oldParams = {
            symbol: currentSelections.dataPoints
        };

        updateSelection(menuIds.data, selectedId);
        commandManager.run(commandNames.execute, commandNames.dataChange, oldParams, newParams);
        currentSelections.dataPoints = newSelection;
    }


    /**
     *
     * @param selectedId
     */
    function handleSymbolChange(selectedId) {

        var selectionMap = {
            "circleSymbol":   "dot",
            "triangleSymbol": "triangle",
            "iconSymbol":     "icon",
            "squareSymbol":   "square"
        };

        var newSelection = selectionMap[selectedId];

        var newParams = {
            symbol:   newSelection,
            chartDiv: htmlTags.chart1Id
        };

        var oldParams = {
            symbol:   currentSelections.symbol,
            chartDiv: htmlTags.chart1Id
        };

        switch (currentSelections.activeExperiment) {
            case "expA" :
                newParams.plotName = "Control";
                oldParams.plotName = "Control";
                break;
            case "expB" :
                newParams.plotName = "Congruent";
                oldParams.plotName = "Congruent";
                break;
        }

        updateSelection(menuIds.symbols, selectedId);
        commandManager.run(commandNames.execute, commandNames.symbolChange, oldParams, newParams);
        currentSelections.symbol = newSelection;
    }

    /**
     *
     * @param selectedId
     */
    function handlePlotStyleChange(selectedId) {

        var selectionMap     = {
            "scatter":   "scatter",
            "barChart": "bar"
        };

        var newSelection = selectionMap[selectedId];

        var newParams = {
            plotStyle:   newSelection
        };

        var oldParams = {
            plotStyle:   currentSelections.plotStyle
        };

        switch (currentSelections.activeExperiment) {
            case "expA" :
                newParams.chartDiv = htmlTags.chart2Id;
                newParams.plotName = "Difference";
                break;
            case "expB" :
                newParams.chartDiv = "htmlTags.chart1Id";
                newParams.plotName = "Difference";
                break;
        }

        updateSelection(menuIds.experiment, selectedId);
        commandManager.run(commandNames.execute, commandNames.plotStyleChange, oldParams, newParams);
        currentSelections.plotStyle = newSelection;
    }

    /**
     *
     */
    function handleExperimentChange(selectedId) {

        initializeSelectedMenus();

        var selectionMap     = {
            "expA":   "expA",
            "expB": "expB"
        };

        var newSelection = selectionMap[selectedId];

        var newParams = {
            experiment:   newSelection
        };

        var oldParams = {
            experiment:   currentSelections.activeExperiment
        };

        updateSelection(menuIds.experiment, selectedId);
        commandManager.run(commandNames.execute, commandNames.experimentChange, oldParams, newParams);
        currentSelections.activeExperiment = newSelection;
    }

    /**
     *
     * @param selectedId
     */
    function handleStateChange(selectedId) {

        var stateMap     = {
            "undo":  commandNames.undo,
            "redo": commandNames.redo,
            "unwind" : commandNames.unwind,
            "rewind": commandNames.rewind
        };

        var newState = stateMap[selectedId];

        updateSelection(menuIds.experiment, selectedId);
        commandManager.run(newState);
        currentSelections.undo = newState;
    }

    /**
     *
     * @param selectedId
     */
    function handleLanguageChange(selectedId) {

        var selectionMap     = {
            "fr": "fr",
            "en": "en"
        };

        var newSelection = selectionMap[selectedId];

        var newParams = {
            language:   newSelection
        };

        var oldParams = {
            language:   currentSelections.language
        };

        updateSelection(menuIds.language, selectedId);
        commandManager.run(commandNames.execute, commandNames.languageChange, oldParams, newParams);
        currentSelections.language = newSelection;
    }

    /**
     *
     * @param event
     */
    function handleClickEvent(event) {

        switch (event.target.id) {
            case "circleSymbol":
            case "triangleSymbol":
            case "iconSymbol":
            case "squareSymbol":
                handleSymbolChange(event.target.id);
                event.stopPropagation();
                break;

            case "removePointButton":
            case "changePointButton":
            case "resetPointsButton":
            case"addPointButton":
                handleDataChange(event.target.id);
                event.stopPropagation();
                break;

            case "blueColor" :
            case "pinkColor":
                handleColorChange(event.target.id);
                event.stopPropagation();
                break;

            case "dataMenu":
            case "symbolMenu":
            case"colorMenu":
            case "plotStyleMenu":
            case "experimentMenu":
            case "undo_redoMenu":
            case "langMenu":
                handleTopMenuEvent(event.target.id);
                event.stopPropagation();
                break;

            case "scatter":
            case "barChart":
                handlePlotStyleChange(event.target.id);
                event.stopPropagation();
                break;

            case "expA":
            case "expB":
                handleExperimentChange(event.target.id);
                event.stopPropagation();
                break;

            case "undo":
            case "redo":
            case "unwind":
            case "rewind":
                handleStateChange(event.target.id);
                event.stopPropagation();
                break;

            case "fr":
            case "en":
                handleLanguageChange(event.target.id);
                event.stopPropagation();
                break;

        }

    }

    initializeSelectedMenus();

    document.body.addEventListener("click", function (event) {
        closeAllMenus();
        handleClickEvent(event);
    });
}





