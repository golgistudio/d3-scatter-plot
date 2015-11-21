/**
 * @file
 */


/*global d3:false */
/*global module:false */

/**
 *
 * @constructor
 */
export function ExperimentManager2() {
    "use strict";



    /**
     *
     * @returns {{yZoomFactors: {yMin: number, yMax: number}, xZoomFactors: {xMin: number, xMax: number}}}
     */
    function initializeZoomFactors() {

        return {
            yZoomFactors : {
                "yMin": 1,
                "yMax": 10
            },
            xZoomFactors :  {
                "xMin": 1,
                "xMax": 1
            }
        };
    }

    /**
     *
     * @param data
     * @returns {{xDomain: Array, yDomain: Array}}
     */
    function calcDomains (data) {

        var maxY = d3.max(data, function (d) {
            return +d.Test;
        });

        var xDomain = [];
        xDomain.push("");
        for (var key in data) {
            var item = data[key];
            xDomain.push(item.Subject);
        }
        xDomain.push(" ");

        var yDomain = [0, maxY + 5];

        return {"xDomain": xDomain,
                "yDomain": yDomain};
    }

    /**
     *
     * @param data
     */
    this.init =  function (data) {

        var dataDomains = calcDomains(data);
        var zoomScaleFactors = initializeZoomFactors();

        return {
            domains: dataDomains,
            zoomScaleFactors: zoomScaleFactors
        };
    };


    /**
     *
     * @param d
     * @returns {Array}
     */
    this.mapData = function (d) {

        var item = [];
        item.Subject = d.Subject;
        item.Test = +d.Test;
        item.Control = +d.Control;
        item.Difference = +d.Difference;
        return item;
    };

    /**
     *
     * @param d
     * @param plotPropIndex
     * @param yProp
     * @returns {string}
     */
    this.experimentToolTipContent = function(d, plotPropIndex, yProp) {

        var content = d[plotPropIndex] + "<br/>" + "<br/>";

        if (yProp === "Test") {
            content = content + "* ";
        } else {
            content = content + "&nbsp;&nbsp;";
        }
        content = content + "Test: " + d.Test + " secs";

        if (yProp === "Control" ) {
            content = content + "<br/>* ";
        } else {
            content = content + "<br/>&nbsp;&nbsp;";
        }
        content = content + "Control: " + d.Control + " secs";

        if (yProp === "Difference" ) {
            content = content + "<br/>* ";
        } else {
            content = content + "<br/>&nbsp;&nbsp;";
        }
        content = content + "Difference: " + d.Difference + " secs";

        return content;
    };

    /**
     *
     * @param labelProperties
     */
    this.updateLabelProperties  = function(labelProperties) {

        labelProperties.xAxisLabelProperties.labelText = "Subjects";
        labelProperties.yAxisLabelProperties.labelText = "Time (seconds)";
        labelProperties.titleProperties.labelText      = "Golgi Lab - Experiment A - Differences";
    };

}

