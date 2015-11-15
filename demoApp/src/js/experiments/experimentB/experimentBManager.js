/**
 * @file
 */


/*global d3:false */
/*global module:false */


/**
 *
 * @constructor
 */
export function ExperimentBManager() {
    "use strict";

    /**
     *
     * @param data
     */
    this.init =  function (data ) {

        var dataDomains = calcDomains(data);
        var zoomScaleFactors = initializeZoomFactors();

        return {
            domains: dataDomains,
            zoomScaleFactors: zoomScaleFactors
        };
    };

    function initializeZoomFactors() {

        return {
            yZoomFactors : {
                "yMin": 0.25,
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
            return +d.Incongruent;
        });

        var xDomain = [];
        xDomain.push("");
        for (var key in data) {
            var item = data[key];
            xDomain.push(item.Participant);
        }
        xDomain.push(" ");

        var yDomain = [0, maxY + 5];

        return {"xDomain": xDomain,
                "yDomain": yDomain};
    }

    /**
     *
     * @param d
     * @returns {Array}
     */
    this.mapData = function (d) {

        var item = [];
        item.Participant = d.Participant;
        item.Incongruent = +d.Incongruent;
        item.Congruent = +d.Congruent;
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

        if (yProp === "Incongruent") {
            content = content + "* ";
        } else {
            content = content + "&nbsp;&nbsp;";
        }
        content = content + "Incongruent: " + d.Incongruent + " secs";

        if (yProp === "Congruent" ) {
            content = content + "<br/>* ";
        } else {
            content = content + "<br/>&nbsp;&nbsp;";
        }
        content = content + "Congruent: " + d.Congruent + " secs";

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

        labelProperties.xAxisLabelProperties.labelText = "Participants";
        labelProperties.yAxisLabelProperties.labelText = "Count";
        labelProperties.titleProperties.labelText      = "Golgi Lab - Experiment B - Differences";
    };

}

