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
        name: "incongruent",
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
        name: "congruent",
        display: {
            radius:      10,
            fillColor:   "lightgreen",
            symbol:      "dot",
            strokeColor: "black",
            plotRenderer: null,
            plotStyle:    "scatter"
        }
    },

    {
        plotClassName: "difference",
        xProp: "Participant",
        yProp: "Difference",
        name: "difference",
        display : {
            radius:     10,
            fillColor:  "#ff7f0e",
            textStroke: "black",
            textFill:   "orange",
            symbol:     "font",
            fontSize:     "3em",
            unicode:      "\uf0e7",
            textOffset:   5,
            plotRenderer: null,
            plotStyle:    "scatter"
        }
    }];





