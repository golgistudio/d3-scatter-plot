"use strict";

/**
 *
 * @type {{incongruent: {plotClassName: string, xProp: string, yProp: string, width: number, height: number, fillColor: string, symbol: string, name: string}, congruent: {plotClassName: string, xProp: string, yProp: string, radius: number, fillColor: string, symbol: string, name: string}, difference: {plotClassName: string, xProp: string, yProp: string, radius: number, fillColor: string, textStroke: string, textFill: string, symbol: string, name: string, fontSize: string, unicode: string, textOffset: number}}}
 */
var experimentPlotProperties = [
    {
        plotClassName: "incongruent",
        xProp: "Participant",
        yProp: "Incongruent",
        name: "Incongruent",
        display: {
            width:        20,
            height:       20,
            fillColor:    "#1f77b4",
            strokeColor:  "black",
            symbol:       "square",
            plotRenderer: null,
            plotStyle:    "scatter"
        }
    },

    {
        plotClassName: "congruent",
        xProp: "Participant",
        yProp: "Congruent",
        name: "Congruent",
        display: {
            radius:      10,
            fillColor:   "lightgreen",
            symbol:      "dot",
            strokeColor: "black",
            plotRenderer: null,
            plotStyle:    "scatter"
        }
    }

];





