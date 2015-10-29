"use strict";

/**
 *
 * @type {{yAxisClassName: string, xAxisClassName: string, xAxisLabel: string, yAxisLabel: string, title: string, titleClassName: string}}
 */
function labelProperties () {

    this.titleProperties      = {
            "className":  "title",
            "fontSize":   "16px",
            "labelText":  "",
            "textAnchor": "middle",
            "xPosition":  0,
            "yPosition":  0,
            "transform":  ""
        };

        this.xAxisLabelProperties = {
            "className":  "xLabel",
            "font-size":  "16px",
            "labelText":  "",
            "textAnchor": "middle",
            "xPosition":  0,
            "yPosition":  0,
            "transform":  ""
        };
        this.yAxisLabelProperties = {
            "className":  "yLabel",
            "font-size":  "16px",
            "labelText":  "",
            "textAnchor": "middle",
            "yPosition":  0,
            "xPosition":  0,
            "transform":  "rotate(-90)"
        };
}





