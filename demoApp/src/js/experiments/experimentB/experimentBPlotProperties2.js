"use strict";

/**
 *
 * @type {{incongruent: {plotClassName: string, xProp: string, yProp: string, width: number, height: number, fillColor: string, symbol: string, name: string}, congruent: {plotClassName: string, xProp: string, yProp: string, radius: number, fillColor: string, symbol: string, name: string}, difference: {plotClassName: string, xProp: string, yProp: string, radius: number, fillColor: string, textStroke: string, textFill: string, symbol: string, name: string, fontSize: string, unicode: string, textOffset: number}}}
 */
var experimentBPlotProperties2 = [
    {
        plotClassName: "incongruent",
        xProp: "Participant",
        yProp: "Incongruent",
        name: "Incongruent",
        display: {
            width:        20,
            height:       20,
            fillColor:    "#c49c94",
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
            fillColor:   "#dbdb8d",
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
        name: "Difference",
        display : {
            radius:     10,
            fillColor:  "#ffbb78",
            textStroke: "black",
            textFill:   "#ffbb78",
            symbol:     "font",
            fontSize:     "3em",
            unicode:      "\uf0e7",
            textOffset:   5,
            plotRenderer: null,
            plotStyle:    "bar",
            width:        20,
            height:       20
        }
    }];





