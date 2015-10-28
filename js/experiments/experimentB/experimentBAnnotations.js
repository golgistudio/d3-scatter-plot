"use strict";

function experimentBAnnotations() {

    /**
     *
     * @param d
     * @param plotPropIndex
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
    }

    /**
     *
     * @param labelProperties
     */
    this.updateLabelProperties  = function(labelProperties) {
        labelProperties.xAxisLabel = "Subjects";
        labelProperties.yAxisLabel = "Count";
        labelProperties.title      = "Golgi Lab Study Results - Experiment B";
    }
};
