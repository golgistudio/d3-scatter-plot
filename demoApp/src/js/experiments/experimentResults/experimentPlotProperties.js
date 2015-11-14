/**
 * @file
 */

/*global module:false */

/**
 *
 * @type {Array}
 */
export var experimentPlotProperties = [
    {
        plotClassName: "test",
        xProp: "Subject",
        yProp: "Test",
        name: "Test",
        display: {
            width:        20,
            height:       20,
            fillColor:    "#17becf",
            strokeColor:  "black",
            symbol:       "square",
            plotRenderer: null,
            plotStyle:    "scatter",
            hoverColor:   "orange",
            strokeWidth: 1,
            strokeHoverWidth: 5
        }
    },

    {
        plotClassName: "control",
        xProp: "Subject",
        yProp: "Control",
        name: "Control",
        display: {
            radius:      10,
            fillColor:   "lightgreen",
            symbol:      "dot",
            strokeColor: "black",
            plotRenderer: null,
            plotStyle:    "scatter",
            hoverColor:   "orange",
            strokeWidth: 1,
            strokeHoverWidth: 5
        }
    }

];







