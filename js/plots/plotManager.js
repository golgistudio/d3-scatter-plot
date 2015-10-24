"use strict";

/**
 *
 * @param plotStyle
 * @returns {{renderPlot: Function, addSymbols: Function}}
 */
function getPlotRenderer(plotStyle) {


    switch(plotStyle) {
        case "scatter"  : return new scatterPlot();
            break;
    }
};