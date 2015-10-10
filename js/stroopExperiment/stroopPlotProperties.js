/**
 *
 * @type {{incongruent: {plotClassName: string, xProp: string, yProp: string, width: number, height: number, fillColor: string, symbol: string, name: string}, congruent: {plotClassName: string, xProp: string, yProp: string, radius: number, fillColor: string, symbol: string, name: string}, difference: {plotClassName: string, xProp: string, yProp: string, radius: number, fillColor: string, textStroke: string, textFill: string, symbol: string, name: string, fontSize: string, unicode: string, textOffset: number}}}
 */
var stroopPlotProperties = [
    {
        plotClassName: "dot",
        xProp: "Participant",
        yProp: "Incongruent",
        width: 10,
        height: 10,
        fillColor: "#1f77b4",
        symbol: "triangle",
        name: "incongruent"
    },

    {
        plotClassName: "cdot",
        xProp: "Participant",
        yProp: "Congruent",
        radius: 5,
        fillColor: "lightgreen",
        symbol: "dot",
        name: "congruent"
    },

    //"difference": {
    //    plotClassName: "ddot",
    //    xProp: "Participant",
    //    yProp: "Difference",
    //    radius: 10,
    //    fillColor: "#ff7f0e",
    //    textStroke: "orange",
    //    textFill: "orange",
    //    symbol: "font",
    //    name: "difference",
    //    fontSize: "2em",
    //    unicode: "\uf0e7",
    //    textOffset: 5
    //}

     {
        plotClassName: "ddot",
        xProp: "Participant",
        yProp: "Difference",
        name: "difference",
        symbol: "icon",
        width: 20,
        height: 20,
        icon: "images/cloud.png"
    }];




