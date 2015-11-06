/**
 * @file
 */

/*global module:false */

/**
 *
 * @type {Array}
 */
var experimentPlotProperties = [
    {
        plotClassName: "test",
        xProp: "Subject",
        yProp: "Test",
        name: "Test",
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
            plotStyle:    "scatter"
        }
    }

];

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = experimentPlotProperties;
}






