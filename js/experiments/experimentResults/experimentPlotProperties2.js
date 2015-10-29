"use strict";

/**
 *
 * @type {{incongruent: {plotClassName: string, xProp: string, yProp: string, width: number, height: number, fillColor: string, symbol: string, name: string}, congruent: {plotClassName: string, xProp: string, yProp: string, radius: number, fillColor: string, symbol: string, name: string}, difference: {plotClassName: string, xProp: string, yProp: string, radius: number, fillColor: string, textStroke: string, textFill: string, symbol: string, name: string, fontSize: string, unicode: string, textOffset: number}}}
 */
var experimentPlotProperties2 = [

    {
        plotClassName: "difference",
        xProp: "Participant",
        yProp: "Difference",
        name: "Difference",
        display : {
            radius:     10,
            fillColor:  "orange",
            textStroke: "black",
            textFill:   "orange",
            symbol:     "font",
            fontSize:     "3em",
            unicode:      "\uf0e7",
            textOffset:   5,
            plotRenderer: null,
            plotStyle:    "bar",
            width:        15,
            height:       15
        }
    }];





